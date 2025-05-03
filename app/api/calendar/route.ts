import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

// 🔧 Resolve slug to numeric ministry_id
async function getMinistryIdBySlug(connection: any, slug: string): Promise<number | null> {
    if (!isNaN(Number(slug))) {
        return Number(slug); // directly use numeric ID
    }

    const [rows] = await connection.execute(
        "SELECT ministry_id FROM ministry WHERE url_path = ?",
        [slug]
    );
    return rows.length > 0 ? rows[0].ministry_id : null;
}


// 📅 GET: Fetch events by ministry slug
export async function GET(req: Request) {
    let connection;
    try {
        const { searchParams } = new URL(req.url);
        const ministrySlug = searchParams.get("ministryId");

        if (!ministrySlug) {
            return NextResponse.json({ success: false, error: "Ministry slug is required" }, { status: 400 });
        }

        connection = await pool.getConnection();
        const ministryId = await getMinistryIdBySlug(connection, ministrySlug);

        if (!ministryId) {
            return NextResponse.json({ success: false, error: "Ministry not found" }, { status: 404 });
        }

        const [rows] = await connection.execute(
            "SELECT id, title, start, ministry_id, description FROM calendar_events WHERE ministry_id = ? ORDER BY start ASC",
            [ministryId]
        );

        return NextResponse.json({ success: true, events: rows });

    } catch (error) {
        console.error("❌ Fetch error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

// 📅 POST: Create new event by ministry slug
export async function POST(req: Request) {
    let connection;
    try {
        const { title, start, ministry, description } = await req.json();

        if (!title || !start || !ministry) {
            return NextResponse.json({ success: false, error: "Title, start time, and ministry slug are required" }, { status: 400 });
        }

        const formattedStart = new Date(start).toISOString().slice(0, 19).replace("T", " ");

        connection = await pool.getConnection();
        const ministryId = await getMinistryIdBySlug(connection, ministry);

        if (!ministryId) {
            return NextResponse.json({ success: false, error: "Ministry not found" }, { status: 404 });
        }

        await connection.execute(
            "INSERT INTO calendar_events (title, start, ministry_id, description) VALUES (?, ?, ?, ?)",
            [title, formattedStart, ministryId, description || ""]
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Create error:", error.message);
        return NextResponse.json({ success: false, error: error.message || "Failed to create event" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

// ✏️ PUT: Update event
export async function PUT(req: Request) {
    let connection;
    try {
        const { id, title, start, ministry, description } = await req.json();

        if (!id || !title || !start || !ministry) {
            return NextResponse.json({ success: false, error: "ID, title, start time, and ministry slug are required" }, { status: 400 });
        }

        const formattedStart = new Date(start).toISOString().slice(0, 19).replace("T", " ");

        connection = await pool.getConnection();
        const ministryId = await getMinistryIdBySlug(connection, ministry);

        if (!ministryId) {
            return NextResponse.json({ success: false, error: "Ministry not found" }, { status: 404 });
        }

        await connection.execute(
            "UPDATE calendar_events SET title = ?, start = ?, ministry_id = ?, description = ? WHERE id = ?",
            [title, formattedStart, ministryId, description || "", id]
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Update error:", error.message);
        return NextResponse.json({ success: false, error: error.message || "Failed to update event" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

// ❌ DELETE: Remove event by ID
export async function DELETE(req: Request) {
    let connection;
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, error: "Event ID is required" }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.execute("DELETE FROM calendar_events WHERE id = ?", [id]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Delete error:", error);
        return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
