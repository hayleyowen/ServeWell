import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { PoolConnection } from "mysql2/promise"; // Import type for connection

export async function POST(req: Request) {
  let client: PoolConnection | null = null; // Define client connection variable

  try {
    const { member_id, auth0ID } = await req.json(); // Get both IDs from request

    if (!member_id || !auth0ID) {
        return NextResponse.json({ error: "Missing member_id or auth0ID" }, { status: 400 });
    }

    client = await pool.getConnection();
    await client.beginTransaction(); // Start transaction

    // 1. Find the church_id of the requesting super admin (auth0ID)
    const [adminUserRows]: any[] = await client.execute(
      `SELECT cm.church_id 
       FROM users u
       JOIN churchmember cm ON u.memID = cm.member_id
       WHERE u.auth0ID = ? 
       LIMIT 1`,
      [auth0ID]
    );

    if (adminUserRows.length === 0 || !adminUserRows[0].church_id) {
        await client.rollback(); // Rollback if requesting admin or church not found
        client.release();
        return NextResponse.json({ error: "Requesting super admin not found or has no church ID" }, { status: 404 });
    }
    const requestingUserChurchId = adminUserRows[0].church_id;

    // 2. Update promoted user's role to super-admin (rID = 2) in users table
    const updateUserQuery = `UPDATE users SET rID = 2 WHERE memID = ?`;
    await client.execute(updateUserQuery, [member_id]);
    
    // 3. Update promoted user's church_id in churchmember table
    const updateChurchMemberQuery = `UPDATE churchmember SET church_id = ? WHERE member_id = ?`;
    await client.execute(updateChurchMemberQuery, [requestingUserChurchId, member_id]);

    // 4. Remove promoted user from requestingAdmins table (using their auth0ID)
    // First get their auth0ID based on member_id
    const [promotedUserRows]: any[] = await client.execute(
        `SELECT auth0ID FROM users WHERE memID = ? LIMIT 1`,
        [member_id]
    );
    const promotedUserAuth0ID = promotedUserRows.length > 0 ? promotedUserRows[0].auth0ID : null;

    if (promotedUserAuth0ID) {
        const deleteQuery = `DELETE FROM requestingAdmins WHERE auth0ID = ?`;
        await client.execute(deleteQuery, [promotedUserAuth0ID]);
    } else {
        console.warn(`Could not find auth0ID for promoted member_id: ${member_id} to delete from requestingAdmins.`);
        // Decide if this is an error or just a warning. Continuing for now.
    }

    await client.commit(); // Commit transaction
    client.release();
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error promoting to super-admin:", error);
    // Rollback transaction in case of error
    if (client) {
        await client.rollback();
        client.release();
    }
    return NextResponse.json({ error: "Failed to promote to super-admin" }, { status: 500 });
  }
} 