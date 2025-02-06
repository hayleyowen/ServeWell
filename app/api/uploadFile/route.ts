import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const client = await pool.connect();
        await client.query(
            "INSERT INTO uploaded_files (file_name, file_data) VALUES ($1, $2)",
            [file.name, buffer]
        );
        client.release();
            

        return NextResponse.json({ success: true, message: "File uploaded successfully" });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, error: "File upload failed" }, { status: 500 });
    }
}
