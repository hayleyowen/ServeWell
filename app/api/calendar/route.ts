import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

export async function GET(req: Request) {
    let connection;
    try {
        const { searchParams } = new URL(req.url);
        // GET handler
        const ministryId = searchParams.get("ministryId");

        if (!ministryId) {
            return NextResponse.json({ success: false, error: "Ministry ID is required" }, { status: 400 });
        }

        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            "SELECT id, title, start, ministry, description FROM calendar_events WHERE ministry = ?",
            [ministryId]
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

export async function POST(req: Request) {
    let connection;
    try {
        const { title, start, ministry, description } = await req.json();

        // POST and PUT: check ministry is number
        if (!title || !start || ministry === undefined) {
            return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
        }


        console.log("🛠️ Received Event:", { title, start, ministry, description });

        // Convert start time to MySQL format with correct timezone handling
        const eventTime = new Date(start);
        const localTime = new Date(eventTime.getTime() - eventTime.getTimezoneOffset() * 60000);
        const formattedStart = localTime.toISOString().slice(0, 19).replace("T", " "); // "YYYY-MM-DD HH:MM:SS"

        console.log("📅 Corrected Start Time:", formattedStart);

        connection = await pool.getConnection();
        await connection.execute(
            "INSERT INTO calendar_events (title, start, ministry, description) VALUES (?, ?, ?, ?)",
            [title, formattedStart, ministry, description || ""]
        );
        

        console.log("✅ Insert Success");
        connection.release();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Create error:", error.message);
        return NextResponse.json({ success: false, error: error.message || "Failed to create event" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

export async function PUT(req: Request) {
    let connection;
    try {
        const { id, title, start, ministry, description } = await req.json();

        if (!id || !title || !start || !ministry) {
            return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
        }

        console.log("🛠️ Updating Event:", { id, title, start, ministry, description });

        const eventTime = new Date(start);
        const localTime = new Date(eventTime.getTime() - eventTime.getTimezoneOffset() * 60000);
        const formattedStart = localTime.toISOString().slice(0, 19).replace("T", " ");

        connection = await pool.getConnection();
        const [result] = await connection.execute(
            "UPDATE calendar_events SET title = ?, start = ?, ministry = ?, description = ? WHERE id = ?",
            [title, formattedStart, ministry, description || "", id]
        );

        console.log("✅ Update Success:", result);
        connection.release();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Update error:", error.message);
        return NextResponse.json({ success: false, error: error.message || "Failed to update event" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}


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
