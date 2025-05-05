import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { superAdminSchema } from "@/app/utils/zodSchema";
import { userStuff } from "@/app/lib/userstuff"; // Assuming you have a function to get user role


export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Get super admins request body:", body);

    const validateData = superAdminSchema.safeParse(body);
    if (!validateData.success) {
      console.error("Validation error:", validateData.error);
      return NextResponse.json({ message: "Invalid Data given" }, { status: 400 });
    }
    
    const auth0ID = validateData.data?.auth0ID;
    if (!auth0ID) {
      return NextResponse.json({ error: "Auth0ID is required" }, { status: 400 });
    }

    // Verify that the request is coming from a super admin
    console.log("Auth0ID to verify:", auth0ID);
    const userRole = await userStuff(auth0ID);
    if (userRole.error) {
      return NextResponse.json({ error: "Failed to fetch user role" }, { status: 500 });
    }
    console.log("User role fetched:", userRole);
    const role = userRole[0]?.rID;
    if (role !== 2) {
      return NextResponse.json({ error: "You are not authorized to perform this action" }, { status: 403 });
    }
    
    // Now execute queries
    const client = await pool.getConnection();

    // Get all super admins (rID = 2) from the same church as the requesting user
    const query = `
      SELECT rID, userID, fname, email
      FROM users
      WHERE rID = 2
      AND churchID = (
        SELECT churchID 
        FROM users
        WHERE auth0ID = ?
      )
    `;
    const [superAdmins] = await client.execute(query, [auth0ID]);
    
    console.log("Super admins fetched:", superAdmins);
    client.release();
    return NextResponse.json(superAdmins);
  } catch (error) {
    console.error("Error fetching super admins:", error);
    return NextResponse.json({ error: "Failed to fetch super admins" }, { status: 500 });
  }
} 