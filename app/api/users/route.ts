import { NextResponse } from "next/server";
import pool from "@/app/lib/database";


export async function POST(req: Request) {
    const { authid } = await req.json();
    if (authid == undefined ) {
        return NextResponse.json({ error: "Auth0ID is required" }, { status: 400 });
    }
    try {
        const client = await pool.getConnection();
    
        const query = `SELECT * FROM users WHERE auth0ID = ?`;
        const [result] = await client.query(query, [authid]);

        client.release();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching unassigned admins:", error);
        return NextResponse.json({ error: "Failed to fetch unassigned admins" }, { status: 500 });
    }
}