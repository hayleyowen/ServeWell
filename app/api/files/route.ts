import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

export async function GET(req: Request) {
    let connection;
    try {
        const { searchParams } = new URL(req.url);
        const ministry = searchParams.get("ministry");
        const pageType = searchParams.get("page_type");

        console.log("🛠️ Ministry Parameter Received:", ministry); // ✅ Debugging
        console.log("🛠️ Page Type Parameter Received:", pageType); // ✅ Debugging

        if (!ministry || !pageType) {
            return NextResponse.json({ success: false, error: "Ministry and page type are required" }, { status: 400 });
        }

        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            "SELECT file_name, file_data, tab_name FROM uploaded_files WHERE LOWER(ministry) = LOWER(?) AND LOWER(page_type) = LOWER(?) ORDER BY created_at DESC LIMIT 1",
            [ministry, pageType]
        );
        

        console.log("📋 Database Query Result:", rows); // ✅ Debugging query results

        connection.release();

        if (!rows || rows.length === 0) {
            return NextResponse.json({ success: false, message: "No file found" });
        }

        const fileRow = rows[0];
        const fileData = Buffer.from(fileRow.file_data).toString("base64");

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
        const ministry = formData.get("ministry") as string;
        const pageType = formData.get("page_type") as string;

        if (!file || !tabName || !ministry || !pageType) {
            console.error("❌ Missing required fields.");
            return NextResponse.json({ success: false, error: "File, tab name, ministry, and page type are required" }, { status: 400 });
        }

        console.log("📥 Received file upload:", file.name, "Ministry:", ministry, "Page Type:", pageType);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        connection = await pool.getConnection();
        
        const [result] = await connection.execute(
            "INSERT INTO uploaded_files (file_name, file_data, tab_name, ministry, page_type) VALUES (?, ?, ?, ?, ?)",
            [file.name, buffer, tabName, ministry, pageType]
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
