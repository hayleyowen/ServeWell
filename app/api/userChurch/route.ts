import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

export async function POST(req: Request) {
    const client = await pool.getConnection();
    try {
        const { auth0ID } = await req.json();
        
        if (!auth0ID) {
            return NextResponse.json({ error: "Auth0 ID is required" }, { status: 400 });
        }

        // Fetch user church information
        await client.beginTransaction(); // Start transaction
        const query = `SELECT church_id, churchname from church where church_id = (Select churchID FROM users WHERE auth0ID = ?)`;
        const [result] = await client.execute(query, [auth0ID]);
        console.log("User Church Data:", result);
        client.commit(); // Commit transaction

        return NextResponse.json(result);
    } catch (error) {
        client.rollback(); // Rollback transaction in case of error
        console.error("Error fetching user churches:", error);
        return NextResponse.json(
            { error: "Failed to fetch user church" }, 
            { status: 500 }
        );
    } finally { 
        client.release(); // Ensure the connection is released
    }
}
  