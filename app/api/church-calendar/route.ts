import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

// 🔧 Resolve slug to numeric church_id
async function getMinistryIdBySlug(connection: any, slug: string): Promise<number | null> {
    if (!isNaN(Number(slug))) {
        return Number(slug); // directly use numeric ID
    }

    const [rows] = await connection.execute(
        "SELECT church_id FROM church WHERE url_path = ?",
        [slug]
    );
    return rows.length > 0 ? rows[0].church_id : null;
}


// 📅 GET: Fetch events by church slug
export async function GET(req: Request) {
    let connection;
    try {
        const { searchParams } = new URL(req.url);
        const churchSlug = searchParams.get("churchId");

        if (!churchSlug) {
            return NextResponse.json({ success: false, error: "Church slug is required" }, { status: 400 });
        }

        connection = await pool.getConnection();
        const churchId = await getMinistryIdBySlug(connection, churchSlug);

        if (!churchId) {
            return NextResponse.json({ success: false, error: "Church not found" }, { status: 404 });
        }

        const [rows] = await connection.execute(
            "SELECT id, title, start, church_id, description FROM calendar_events WHERE church_id = ? ORDER BY start ASC",
            [churchId]
        );

        return NextResponse.json({ success: true, events: rows });

    } catch (error) {
        console.error("❌ Fetch error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

// 📅 POST: Create new event by church slug
export async function POST(req: Request) {
    let connection;
    try {
        const { title, start, church, description } = await req.json();

        if (!title || !start || !church) {
            return NextResponse.json({ success: false, error: "Title, start time, and church slug are required" }, { status: 400 });
        }

        const formattedStart = new Date(start).toISOString().slice(0, 19).replace("T", " ");

        connection = await pool.getConnection();
        const churchId = await getMinistryIdBySlug(connection, church);

        if (!churchId) {
            return NextResponse.json({ success: false, error: "Ministry not found" }, { status: 404 });
        }

        await connection.execute(
            "INSERT INTO calendar_events (title, start, church_id, description) VALUES (?, ?, ?, ?)",
            [title, formattedStart, churchId, description || ""]
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
        const { id, title, start, church, description } = await req.json();

        if (!id || !title || !start || !church) {
            return NextResponse.json({ success: false, error: "ID, title, start time, and church slug are required" }, { status: 400 });
        }

        const formattedStart = new Date(start).toISOString().slice(0, 19).replace("T", " ");

        connection = await pool.getConnection();
        const churchId = await getMinistryIdBySlug(connection, church);

        if (!churchId) {
            return NextResponse.json({ success: false, error: "Ministry not found" }, { status: 404 });
        }

        await connection.execute(
            "UPDATE calendar_events SET title = ?, start = ?, church_id = ?, description = ? WHERE id = ?",
            [title, formattedStart, churchId, description || "", id]
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
