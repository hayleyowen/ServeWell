import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

export async function GET() {
    let connection;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Query the database
        const [rows] = await connection.execute(
            "SELECT file_name, file_data FROM uploaded_files ORDER BY created_at DESC LIMIT 1"
        );

        // Release the connection
        connection.release();

        if (rows.length === 0) {
            return NextResponse.json({ success: false, message: "No file found" });
        }

        const fileData = rows[0].file_data.toString("base64");

        return NextResponse.json({ success: true, filename: rows[0].file_name, fileData });
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch file" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(req: Request) {
    let connection;
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        connection = await pool.getConnection();
        await connection.execute(
            "INSERT INTO uploaded_files (file_name, file_data) VALUES (?, ?)",
            [file.name, buffer]
        );
        connection.release();

        return NextResponse.json({ success: true, message: "File uploaded successfully" });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, error: "File upload failed" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}