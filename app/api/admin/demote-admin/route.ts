import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { demoteAdminSchema } from "@/app/utils/zodSchema";
import { apiSuperAdminVerification, checkMatchingChurches } from "@/app/lib/apiauth";

export async function POST(req: Request) {
  const client = await pool.getConnection();
  try {
    const body = await req.json();
    console.log("Demote admin request body:", body);

    // Server-side validation using zod
    const validateData = demoteAdminSchema.safeParse(body);
    if (!validateData.success) {
      console.error("Validation error:", validateData.error);
      return NextResponse.json({ message: "Invalid Data given" }, { status: 400 });
    }

    const userID = validateData.data?.userID;
    const auth0ID = validateData.data?.auth0ID;

    if (!userID || !auth0ID) {
      return NextResponse.json({ error: "UserID and Auth0ID are required" }, { status: 400 });
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

    await client.beginTransaction(); // Start transaction
    // Change user's rID to 0 (regular user) and minID to NULL
    const updateQuery = `
      UPDATE users 
      SET rID = 0, minID = NULL, churchID = NULL 
      WHERE userID = ?
    `;
    
    await client.execute(updateQuery, [userID]);

    // Remove from requestingAdmins table
    const deleteQuery = `
      DELETE FROM requestingAdmins 
      WHERE auth0ID = (
        SELECT auth0ID 
        FROM users 
        WHERE userID = ?
      )
    `;
    
    await client.execute(deleteQuery, [userID]);

    await client.commit(); // Commit transaction
    return NextResponse.json({ success: true });
  } catch (error) {
    await client.rollback(); // Rollback transaction in case of error
    console.error("Error demoting admin:", error);
    return NextResponse.json({ error: "Failed to demote admin" }, { status: 500 });
  } finally {
    client.release(); // Ensure the connection is released
  }
} 