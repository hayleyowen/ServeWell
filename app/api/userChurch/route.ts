import { NextResponse } from "next/server";
import { getUserChurch } from "@/app/lib/data";

export async function POST(req: Request) {
    try {
        const { auth0_id } = await req.json();
        
        if (!auth0_id) {
            return NextResponse.json({ error: "Auth0 ID is required" }, { status: 400 });
        }

        const result = await getUserChurch(auth0_id);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching user churches:", error);
        return NextResponse.json(
            { error: "Failed to fetch user church" }, 
            { status: 500 }
        );
    }
}
  