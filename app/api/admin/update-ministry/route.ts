import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: Request) {
  try {
    const { admin_id, ministry_id } = await req.json();

    if (!admin_id || !ministry_id) {
      return NextResponse.json({ error: "Missing admin_id or ministry_id" }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `UPDATE admin SET ministry_id = $1 WHERE member_id = $2 RETURNING *`;
    const values = [ministry_id, admin_id];
    const result = await client.query(query, values);
    client.release();

    return NextResponse.json({ success: true, admin: result.rows[0] });
  } catch (error) {
    console.error("Error updating admin ministry:", error);
    return NextResponse.json({ error: "Failed to update ministry" }, { status: 500 });
  }
}
