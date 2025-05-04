import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { demoteAndAssignSchema } from "@/app/utils/zodSchema";
import { apiSuperAdminVerification, checkMatchingChurches } from "@/app/lib/apiauth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Demote and assign request body:", body);

    // Validate the request body using Zod schema
    const validateData = demoteAndAssignSchema.safeParse(body);
    if (!validateData.success) {
      console.error("Validation error:", validateData.error);
      return NextResponse.json({ message: "Invalid Data given" }, { status: 400 });
    }

    const userID = validateData.data?.userID;
    const minID = validateData.data?.minID;
    const auth0ID = validateData.data?.auth0ID;


    if (!userID || !minID || !auth0ID) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Verify that the request is coming from a super admin
    const superAdminChurchID = await apiSuperAdminVerification(auth0ID);

    if (superAdminChurchID.error) {
      return NextResponse.json({ message: superAdminChurchID.error }, { status: 403 });
    }

    // Compare the churchID of the super admin with the user being altered
    const compare = await checkMatchingChurches(userID, superAdminChurchID);
    if (!compare) {
      return NextResponse.json({ error: "You are not authorized to alter this user" }, { status: 403 });
    }

    const client = await pool.getConnection();
    await client.beginTransaction(); // Start transaction

    // 1. Update user role from super admin (rID = 2) to regular admin (rID = 1)
    const updateRoleQuery = `
      UPDATE users
      SET rID = 1
      WHERE userID = ?
    `;
    await client.execute(updateRoleQuery, [userID]);

    // 2. Assign ministry to the user
    const assignMinistryQuery = `
      UPDATE users
      SET minID = ?
      WHERE userID = ?
    `;
    await client.execute(assignMinistryQuery, [minID, userID]);

    // 3. Make sure the user has the correct church_id
    // First, get the church_id for this ministry
    const [ministryRows]: any[] = await client.execute(
      `SELECT church_id FROM ministry WHERE ministry_id = ? LIMIT 1`,
      [minID]
    );
    
    if (ministryRows.length === 0 || !ministryRows[0].church_id) {
      await client.rollback(); // Rollback if ministry or church not found
      client.release();
      return NextResponse.json({ error: "Ministry not found or has no church ID" }, { status: 404 });
    }
    
    const churchId = ministryRows[0].church_id;
    
    // Update the user's church_id in users table
    const updateChurchMemberQuery = `
      UPDATE users
      SET churchID = ?
      WHERE userID = ?
    `;
    await client.execute(updateChurchMemberQuery, [churchId, userID]);

    client.commit(); // Commit transaction
    client.release();
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error demoting super admin and assigning ministry:", error);
    return NextResponse.json(
      { error: "Failed to demote super admin and assign ministry", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 