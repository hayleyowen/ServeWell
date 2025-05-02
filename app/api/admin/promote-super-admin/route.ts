import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { PoolConnection } from "mysql2/promise"; // Import type for connection

export async function POST(req: Request) {
  let client: PoolConnection | null = null; // Define client connection variable

  try {
    const { userID } = await req.json();
    const client = await pool.getConnection();

    // Update user's role to super-admin (rID = 2)
    const updateQuery = `
      UPDATE users 
      SET rID = 2 , minID = NULL
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