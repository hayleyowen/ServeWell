import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { userMinistrySchema } from "@/app/utils/zodSchema";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("UserMinistry Body:", body);

        const validateData = userMinistrySchema.safeParse(body);
        if (!validateData.success) {
            console.error("Validation error:", validateData.error.format());
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const auth0ID = validateData.data.auth0ID;
        
        if (!auth0ID) {
            return NextResponse.json({ error: "Auth0 ID is required" }, { status: 400 });
        }

        // Fetch user ministry information
        const connection = await pool.getConnection();
        const query = `SELECT ministry_id from ministry where church_id = (Select churchID FROM users WHERE auth0ID = ?)`;
        const [result] = await connection.execute(query, [auth0ID]);
        console.log("User Ministry Data:", result);
        connection.release();

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching user ministries:", error);
        return NextResponse.json(
            { error: "Failed to fetch user ministry" }, 
            { status: 500 }
        );
    }
}