import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

<<<<<<< Updated upstream
export async function GET() {
    let connection;
    try {
=======
// GET: Fetch uploaded files by ministry_id and page_type
export async function GET(req: Request) {
    let connection;
    try {
        const { searchParams } = new URL(req.url);
        const ministryID = searchParams.get("ministry_id");
        const pageType = searchParams.get("page_type");

        if (!ministryID || !pageType) {
            return NextResponse.json({ success: false, error: "Ministry ID and page type are required" }, { status: 400 });
        }

>>>>>>> Stashed changes
        connection = await pool.getConnection();

        // Fetch the latest uploaded file
        const [rows] = await connection.execute(
<<<<<<< Updated upstream
            "SELECT file_name, file_data, tab_name FROM uploaded_files ORDER BY created_at DESC LIMIT 1"
=======
            "SELECT file_name, file_data, tab_name FROM uploaded_files WHERE ministry_id = ? AND LOWER(page_type) = LOWER(?) ORDER BY created_at DESC",
            [ministryID, pageType]
>>>>>>> Stashed changes
        );

        if (!rows || rows.length === 0) {
            console.error("❌ No files found in the database.");
            return NextResponse.json({ success: false, message: "No file found" });
        }

<<<<<<< Updated upstream
        const fileRow = rows[0];
=======
        const files = rows.map((fileRow: any) => ({
            filename: fileRow.file_name,
            fileData: Buffer.from(fileRow.file_data).toString("base64"),
            tabName: fileRow.tab_name,
        }));
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
=======
// POST: Upload new file
>>>>>>> Stashed changes
export async function POST(req: Request) {
    let connection;
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
<<<<<<< Updated upstream
        const tabName = formData.get("tab_name") as string; 

        if (!file || !tabName) {
            console.error("❌ Missing file or tab name in request.");
            return NextResponse.json({ success: false, error: "File and tab name are required" }, { status: 400 });
=======
        const tabName = formData.get("tab_name") as string;
        const ministryID = formData.get("ministry_id") as string;
        const pageType = formData.get("page_type") as string;

        if (!file || !tabName || !ministryID || !pageType) {
            return NextResponse.json({ success: false, error: "File, tab name, ministry ID, and page type are required" }, { status: 400 });
>>>>>>> Stashed changes
        }

        console.log("📥 Received file upload request:", file.name, "Tab:", tabName);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("🔄 Converted file to Buffer, size:", buffer.length, "bytes");

        connection = await pool.getConnection();
        
        const [result] = await connection.execute(
<<<<<<< Updated upstream
            "INSERT INTO uploaded_files (file_name, file_data, tab_name) VALUES (?, ?, ?)",
            [file.name, buffer, tabName]
        );

        console.log("✅ File successfully stored in database, Insert ID:", result.insertId);

        connection.release();

        return NextResponse.json({ success: true, message: "File uploaded successfully" });
=======
            "INSERT INTO uploaded_files (file_name, file_data, tab_name, ministry_id, page_type) VALUES (?, ?, ?, ?, ?)",
            [file.name, buffer, tabName, parseInt(ministryID), pageType]
        );

        return NextResponse.json({ success: true, id: result.insertId });
>>>>>>> Stashed changes

    } catch (error) {
        console.error("❌ Upload error:", error);
        return NextResponse.json({ success: false, error: "File upload failed" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
<<<<<<< Updated upstream
}
=======
}

// DELETE: Delete file by tab name and ministry_id
export async function DELETE(req: Request) {
    let connection;
    try {
        const { tab_name, ministry_id, page_type } = await req.json();

        if (!tab_name || !ministry_id || !page_type) {
            return NextResponse.json({ success: false, error: "Tab name, ministry ID, and page type are required" }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.execute(
            "DELETE FROM uploaded_files WHERE LOWER(tab_name) = LOWER(?) AND ministry_id = ? AND LOWER(page_type) = LOWER(?)",
            [tab_name, parseInt(ministry_id), page_type]
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Delete error:", error);
        return NextResponse.json({ success: false, error: "Failed to delete file" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
>>>>>>> Stashed changes
