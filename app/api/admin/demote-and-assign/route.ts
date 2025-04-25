import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { PoolConnection } from "mysql2/promise"; // Import type for connection

export async function POST(req: Request) {
  let client: PoolConnection | null = null; // Define client connection variable

  try {
    const { member_id, minID, auth0ID } = await req.json();

    if (!member_id || !minID) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    client = await pool.getConnection();
    await client.beginTransaction(); // Start transaction

    // 1. Update user role from super admin (rID = 2) to regular admin (rID = 1)
    const updateRoleQuery = `
      UPDATE users
      SET rID = 1
      WHERE memID = ?
    `;
    await client.execute(updateRoleQuery, [member_id]);

    // 2. Assign ministry to the user
    const assignMinistryQuery = `
      UPDATE users
      SET minID = ?
      WHERE memID = ?
    `;
    await client.execute(assignMinistryQuery, [minID, member_id]);

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
    
    // Update the user's church_id in churchmember table
    const updateChurchMemberQuery = `
      UPDATE churchmember
      SET church_id = ?
      WHERE member_id = ?
    `;
    await client.execute(updateChurchMemberQuery, [churchId, member_id]);

    await client.commit(); // Commit transaction
    client.release();
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error demoting super admin and assigning ministry:", error);
    // Rollback transaction in case of error
    if (client) {
      await client.rollback();
      client.release();
    }
    return NextResponse.json(
      { error: "Failed to demote super admin and assign ministry", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 