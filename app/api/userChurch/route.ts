import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

export async function POST(req: Request) {
    try {
        const { auth0ID } = await req.json();
        
        if (!auth0ID) {
            return NextResponse.json({ error: "Auth0 ID is required" }, { status: 400 });
        }

        // Fetch user church information
        const connection = await pool.getConnection();
        const query = `SELECT church_id, churchname from church where church_id = (Select churchID FROM users WHERE auth0ID = ?)`;
        const [result] = await connection.execute(query, [auth0ID]);
        console.log("User Church Data:", result);
        connection.release();

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching user churches:", error);
        return NextResponse.json(
            { error: "Failed to fetch user church" }, 
            { status: 500 }
        );
    }
}
  