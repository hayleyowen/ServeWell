import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { userChurchSchema } from "@/app/utils/zodSchema";

export async function POST(req: Request) {
    const client = await pool.getConnection();
    try {
        const body = await req.json();
        console.log("UserChurch Body:", body);

        const validateData = userChurchSchema.safeParse(body);
        if (!validateData.success) {
            console.error("Validation error:", validateData.error.format());
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const auth0ID = validateData.data.auth0ID;
        
        if (!auth0ID) {
            return NextResponse.json({ error: "Auth0 ID is required" }, { status: 400 });
        }

        // this is used in middleware so do not authorize here

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
  