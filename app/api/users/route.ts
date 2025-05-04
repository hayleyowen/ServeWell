import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { newUserSchema } from "@/app/utils/zodSchema";

export async function POST(req: Request) {
    const body = await req.json();

    // use zod to validate the request body
    const validateData = newUserSchema.safeParse(body);
    if (!validateData.success) {
        return NextResponse.json({ message: "Invalid Data given" }, { status: 400 });
    }

    const authid = validateData.data?.authid;
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