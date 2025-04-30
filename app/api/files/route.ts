import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

// GET: Fetch uploaded files by ministry_url and page_type
export async function GET(req: Request) {
    let connection;
    try {
        const { searchParams } = new URL(req.url);
        const ministrySlug = searchParams.get("ministry_id"); // actually the url_path
        const pageType = searchParams.get("page_type");

        if (!ministrySlug || !pageType) {
            return NextResponse.json(
                { success: false, error: "Ministry URL and page type are required" },
                { status: 400 }
            );
        }

        connection = await pool.getConnection();

        // 🔍 Get numeric ministry_id based on url_path
        const [ministryRows] = await connection.execute(
            "SELECT ministry_id FROM ministry WHERE url_path = ?",
            [ministrySlug]
        );

        if (!ministryRows || ministryRows.length === 0) {
            return NextResponse.json({ success: false, message: "Ministry not found" });
        }

        const ministryID = ministryRows[0].ministry_id;

        // 📥 Get the uploaded files
        const [rows] = await connection.execute(
            "SELECT file_name, file_data, tab_name FROM uploaded_files WHERE ministry_id = ? AND LOWER(page_type) = LOWER(?) ORDER BY created_at DESC",
            [ministryID, pageType]
        );

        if (!rows || rows.length === 0) {
            return NextResponse.json({ success: false, message: "No file found" });
        }

        const files = rows.map((fileRow: any) => ({
            filename: fileRow.file_name,
            fileData: Buffer.from(fileRow.file_data).toString("base64"),
            tabName: fileRow.tab_name,
        }));

        return NextResponse.json({ success: true, files });

    } catch (error) {
        console.error("❌ Fetch error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch file" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}


// POST: Upload new file
export async function POST(req: Request) {
    let connection;
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const tabName = formData.get("tab_name") as string;
        const ministrySlug = formData.get("ministry_id") as string;  // This is actually the URL slug
        const pageType = formData.get("page_type") as string;

        if (!file || !tabName || !ministrySlug || !pageType) {
            return NextResponse.json({ success: false, error: "File, tab name, ministry ID (slug), and page type are required" }, { status: 400 });
        }

        connection = await pool.getConnection();

        // 🔍 Look up the numeric ministry_id from the slug
        const [ministryRows] = await connection.execute(
            "SELECT ministry_id FROM ministry WHERE url_path = ?",
            [ministrySlug]
        );

        if (!ministryRows || ministryRows.length === 0) {
            return NextResponse.json({ success: false, error: "Ministry not found" }, { status: 404 });
        }

        const ministryID = ministryRows[0].ministry_id;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("📥 Uploading:", file.name, "-> Ministry ID:", ministryID);

        const [result] = await connection.execute(
            "INSERT INTO uploaded_files (file_name, file_data, tab_name, ministry_id, page_type) VALUES (?, ?, ?, ?, ?)",
            [file.name, buffer, tabName, ministryID, pageType]
        );

        return NextResponse.json({ success: true, id: result.insertId });

    } catch (error) {
        console.error("❌ Upload error:", error);
        return NextResponse.json({ success: false, error: "File upload failed" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}


// DELETE: Delete file by tab name and ministry slug
export async function DELETE(req: Request) {
    let connection;
    try {
        const { tab_name, ministry_id, page_type } = await req.json();

        if (!tab_name || !ministry_id || !page_type) {
            return NextResponse.json({
                success: false,
                error: "Tab name, ministry ID (slug), and page type are required"
            }, { status: 400 });
        }

        connection = await pool.getConnection();

        // 🔍 Get the numeric ministry_id from the URL slug
        const [ministryRows] = await connection.execute(
            "SELECT ministry_id FROM ministry WHERE url_path = ?",
            [ministry_id]
        );

        if (!ministryRows || ministryRows.length === 0) {
            return NextResponse.json({
                success: false,
                error: "Ministry not found"
            }, { status: 404 });
        }

        const numericMinistryId = ministryRows[0].ministry_id;

        // 🗑️ Delete the file
        const [result] = await connection.execute(
            "DELETE FROM uploaded_files WHERE LOWER(tab_name) = LOWER(?) AND ministry_id = ? AND LOWER(page_type) = LOWER(?)",
            [tab_name, numericMinistryId, page_type]
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Delete error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to delete file"
        }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
