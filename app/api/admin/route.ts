import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { showRequestingAdmins } from "@/app/lib/data";

export async function GET(req: Request) {
  const { auth0ID } = await req.json();
  try {
    const client = await pool.getConnection();

    const ra = await showRequestingAdmins(auth0ID);
    console.log(ra);
    client.release();

    return NextResponse.json(ra);
  } catch (error) {
    console.error("Error fetching unassigned admins:", error);
    return NextResponse.json({ error: "Failed to fetch unassigned admins" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { church_id, member_id } = await req.json();

    if (!church_id) {
      return NextResponse.json({ error: "Missing church_id" }, { status: 400 });
    }
    if (!member_id) {
      return NextResponse.json({ error: "Missing member_id" }, { status: 400 });
    }  

    const client = await pool.getConnection();

    const query = `UPDATE churchmember SET church_id = ? WHERE member_id = ?;`;
    const values = [church_id, member_id];
    const [result] = await client.execute(query, values);
    client.release();

    return NextResponse.json({ success: true, affectedRows: result.affectedRows });
  } catch (error) {
    console.error("Error updating admin ministry:", error);
    return NextResponse.json({ error: "Failed to update ministry" }, { status: 500 });
  }
}