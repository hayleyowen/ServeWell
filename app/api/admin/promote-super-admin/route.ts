import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

export async function POST(req: Request) {
  try {
    const { userID } = await req.json();
    const client = await pool.getConnection();

    // Update user's role to super-admin (rID = 2)
    const updateQuery = `
      UPDATE users 
      SET rID = 2 
      WHERE userID = ?
    `;
    
    await client.execute(updateQuery, [userID]);
    
    // Remove from requestingAdmins table since they're now a super-admin
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
    console.error("Error promoting to super-admin:", error);
    return NextResponse.json({ error: "Failed to promote to super-admin" }, { status: 500 });
  }
} 