import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { PoolConnection, RowDataPacket } from "mysql2/promise"; // Import RowDataPacket

interface RequestingAdmin extends RowDataPacket {
  churchID: number;
}

export async function POST(req: Request) {
  let client: PoolConnection | null = null; // Define client connection variable

  try {
    const { userID } = await req.json();
    client = await pool.getConnection();
    await client.beginTransaction(); // Start transaction

    // First, get the church_id from the requestingAdmins table
    const [requestingAdmin] = await client.execute<RequestingAdmin[]>(
      `SELECT churchID FROM requestingAdmins 
       WHERE auth0ID = (SELECT auth0ID FROM users WHERE userID = ?)`,
      [userID]
    );

    if (!requestingAdmin || requestingAdmin.length === 0) {
      await client.rollback();
      client.release();
      return NextResponse.json({ error: "No church request found for this user" }, { status: 400 });
    }

    const churchID = requestingAdmin[0].churchID;

    // Update user's role to super-admin (rID = 2) and set churchID
    const updateQuery = `
      UPDATE users 
      SET rID = 2, minID = NULL, churchID = ?
      WHERE userID = ?
    `;
    
    await client.execute(updateQuery, [churchID, userID]);
    
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

    await client.commit(); // Commit transaction
    client.release();
    return NextResponse.json({ success: true });

  } catch (error) {
    if (client) {
      await client.rollback();
      client.release();
    }
    console.error("Error promoting to super-admin:", error);
    return NextResponse.json({ error: "Failed to promote to super-admin" }, { status: 500 });
  }
} 