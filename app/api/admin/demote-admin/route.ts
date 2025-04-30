import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

export async function POST(req: Request) {
  try {
    const { userID } = await req.json();
    const client = await pool.getConnection();

    // Change user's rID to 0 (regular user) and minID to NULL
    const updateQuery = `
      UPDATE users 
      SET rID = 0, minID = NULL 
      WHERE userID = ?
    `;
    
    await client.execute(updateQuery, [userID]);
    
    // Set church_id to NULL in the churchmember table
    const updateChurchMemberQuery = `
      UPDATE churchmember
      SET church_id = NULL
      WHERE member_id = ?
    `;
    await client.execute(updateChurchMemberQuery, [member_id]);

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

    client.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error demoting admin:", error);
    return NextResponse.json({ error: "Failed to demote admin" }, { status: 500 });
  }
} 