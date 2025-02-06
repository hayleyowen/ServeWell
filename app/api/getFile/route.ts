import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query(
            "SELECT file_name, file_data FROM uploaded_files ORDER BY created_at DESC LIMIT 1"
        );
        client.release();
        
        

        if (result.rows.length === 0) {
            return NextResponse.json({ success: false, message: "No file found" });
        }

        const fileData = result.rows[0].file_data.toString("base64");

        return NextResponse.json({ success: true, filename: result.rows[0].filename, fileData });
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch file" }, { status: 500 });
    }
}
