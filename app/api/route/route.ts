import { NextResponse } from "next/server";
import pool from "@/app/lib/database"; // Ensure this path is correct

export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT NOW()");
        client.release();

        return NextResponse.json({ message: "Connected to database", time: result.rows[0] });
    } catch (error) {
        console.error("Database connection error:", error);
        return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 });
    }
}
