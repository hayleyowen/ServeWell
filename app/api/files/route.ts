import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

export async function GET() {
    let connection;
    try {
        connection = await pool.getConnection();

        // Fetch the latest uploaded file
        const [rows] = await connection.execute(
            "SELECT file_name, file_data, tab_name FROM uploaded_files ORDER BY created_at DESC LIMIT 1"
        );

        connection.release();

        if (!rows || rows.length === 0) {
            console.error("❌ No files found in the database.");
            return NextResponse.json({ success: false, message: "No file found" });
        }

        const fileRow = rows[0];

        if (!fileRow.file_data) {
            console.error("❌ File data is NULL in the database.");
            return NextResponse.json({ success: false, message: "File data is missing" });
        }

        const fileData = Buffer.from(fileRow.file_data).toString("base64");

        console.log("📤 Sending file to frontend:", fileRow.file_name, "Tab:", fileRow.tab_name);

        return NextResponse.json({ 
            success: true, 
            filename: fileRow.file_name, 
            fileData, 
            tabName: fileRow.tab_name 
        });

    } catch (error) {
        console.error("❌ Fetch error:", error);
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
        const tabName = formData.get("tab_name") as string; 

        if (!file || !tabName) {
            console.error("❌ Missing file or tab name in request.");
            return NextResponse.json({ success: false, error: "File and tab name are required" }, { status: 400 });
        }

        console.log("📥 Received file upload request:", file.name, "Tab:", tabName);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("🔄 Converted file to Buffer, size:", buffer.length, "bytes");

        connection = await pool.getConnection();
        
        const [result] = await connection.execute(
            "INSERT INTO uploaded_files (file_name, file_data, tab_name) VALUES (?, ?, ?)",
            [file.name, buffer, tabName]
        );

        console.log("✅ File successfully stored in database, Insert ID:", result.insertId);

        connection.release();

        return NextResponse.json({ success: true, message: "File uploaded successfully" });

    } catch (error) {
        console.error("❌ Upload error:", error);
        return NextResponse.json({ success: false, error: "File upload failed" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}