import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in your .env file
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT ministry_id, ministryname FROM ministry");
    client.release();
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching ministries:", error);
    return NextResponse.json({ error: "Failed to fetch ministries" }, { status: 500 });
  }
}
