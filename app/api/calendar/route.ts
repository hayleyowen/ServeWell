import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

// Fetch events based on ministry
export async function GET(req: Request) {
    let connection;
    try {
        const { searchParams } = new URL(req.url);
        const ministry = searchParams.get("ministry");

        if (!ministry) {
            return NextResponse.json({ success: false, error: "Ministry is required" }, { status: 400 });
        }

        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            "SELECT id, title, start, ministry FROM calendar_events WHERE LOWER(ministry) = LOWER(?)",
            [ministry]
        );

        connection.release();

        return NextResponse.json({ success: true, events: rows });

    } catch (error) {
        console.error("❌ Fetch error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

// Update event
export async function PUT(req: Request) {
    let connection;
    try {
        const { id, title, start, ministry } = await req.json();

        if (!id || !title || !start || !ministry) {
            return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.execute(
            "UPDATE calendar_events SET title = ?, start = ?, ministry = ? WHERE id = ?",
            [title, start, ministry, id]
        );

        connection.release();
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Update error:", error);
        return NextResponse.json({ success: false, error: "Failed to update event" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}



// Delete event
export async function DELETE(req: Request) {
    let connection;
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, error: "Event ID is required" }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.execute("DELETE FROM calendar_events WHERE id = ?", [id]);

        connection.release();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Delete error:", error);
        return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
