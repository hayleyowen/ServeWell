import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

// GET: Fetch uploaded files by church_id and page_type
export async function GET(req: Request) {
    let connection;
    try {
        const { searchParams } = new URL(req.url);
        const churchId = searchParams.get("church_id");
        const pageType = searchParams.get("page_type");

        if (!churchId || !pageType) {
            return NextResponse.json(
                { success: false, error: "Ministry ID and page type are required" },
                { status: 400 }
            );
        }

        connection = await pool.getConnection();

        const [churchRows] = await connection.execute(
            "SELECT church_id FROM church WHERE church_id = ?",
            [parseInt(churchId, 10)]
        );

        if (!churchRows || churchRows.length === 0) {
            return NextResponse.json({ success: false, message: "Ministry not found" });
        }

        const [rows] = await connection.execute(
            "SELECT file_name, file_data, tab_name FROM uploaded_files WHERE church_id = ? AND LOWER(page_type) = LOWER(?) ORDER BY created_at DESC",
            [parseInt(churchId, 10), pageType]
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
        return NextResponse.json({ success: false, error: "Failed to fetch files" }, { status: 500 });
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
        const churchId = formData.get("church_id") as string;
        const pageType = formData.get("page_type") as string;

        if (!file || !tabName || !churchId || !pageType) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        connection = await pool.getConnection();

        const [churchRows] = await connection.execute(
            "SELECT church_id FROM church WHERE church_id = ?",
            [parseInt(churchId, 10)]
        );

        if (!churchRows || churchRows.length === 0) {
            return NextResponse.json({ success: false, error: "Ministry not found" }, { status: 404 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const [result] = await connection.execute(
            "INSERT INTO uploaded_files (file_name, file_data, tab_name, church_id, page_type) VALUES (?, ?, ?, ?, ?)",
            [file.name, buffer, tabName, parseInt(churchId, 10), pageType]
        );

        return NextResponse.json({ success: true, id: result.insertId });

    } catch (error) {
        console.error("❌ Upload error:", error);
        return NextResponse.json({ success: false, error: "File upload failed" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

// DELETE: Delete file by tab name and church_id
export async function DELETE(req: Request) {
    let connection;
    try {
        const { tab_name, church_id, page_type } = await req.json();

        if (!tab_name || !church_id || !page_type) {
            return NextResponse.json({
                success: false,
                error: "Tab name, church ID, and page type are required"
            }, { status: 400 });
        }

        connection = await pool.getConnection();

        const [churchRows] = await connection.execute(
            "SELECT church_id FROM church WHERE church_id = ?",
            [parseInt(church_id, 10)]
        );

        if (!churchRows || churchRows.length === 0) {
            return NextResponse.json({
                success: false,
                error: "Ministry not found"
            }, { status: 404 });
        }

        const [result] = await connection.execute(
            "DELETE FROM uploaded_files WHERE LOWER(tab_name) = LOWER(?) AND church_id = ? AND LOWER(page_type) = LOWER(?)",
            [tab_name, parseInt(church_id, 10), page_type]
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
