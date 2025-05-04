import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { demoteAdminSchema } from "@/app/utils/zodSchema";
import { apiSuperAdminVerification } from "@/app/lib/apiauth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Demote admin request body:", body);

    // Server-side validation using zod
    const validateData = demoteAdminSchema.safeParse(body);
    if (!validateData.success) {
      console.error("Validation error:", validateData.error);
      return NextResponse.json({ message: "Invalid Data given" }, { status: 400 });
    }

    const userID = validateData.data?.userID;
    const auth0ID = validateData.data?.auth0ID;

    if (!userID || !auth0ID) {
      return NextResponse.json({ error: "UserID and Auth0ID are required" }, { status: 400 });
    }

    // Verify that the request is coming from a super admin
    const superAdminChurchID = await apiSuperAdminVerification(auth0ID);

    if (superAdminChurchID.error) {
      return NextResponse.json({ message: superAdminChurchID.error }, { status: 403 });
    }

    // Check for the churchID of the user being demoted
    const client = await pool.getConnection();
    const demoteUserChurchIDQuery = `SELECT churchID FROM users WHERE userID = ?`;
    const [demoteUserChurchIDResult] = await client.query(demoteUserChurchIDQuery, [userID]);
    const demoteUserChurchID = demoteUserChurchIDResult[0]?.churchID;
    if (!demoteUserChurchID) {
      return NextResponse.json({ error: "Demote user church ID not found" }, { status: 404 });
    }

    // Check if the super admin is from the same church as the user being demoted
    if (demoteUserChurchID !== superAdminChurchID) {
      return NextResponse.json({ error: "You are not authorized to demote this user" }, { status: 403 });
    }

    // Change user's rID to 0 (regular user) and minID to NULL
    const updateQuery = `
      UPDATE users 
      SET rID = 0, minID = NULL, churchID = NULL 
      WHERE userID = ?
    `;
    
    await client.execute(updateQuery, [userID]);

    // Remove from requestingAdmins table
    const deleteQuery = `
      DELETE FROM requestingAdmins 
      WHERE auth0ID = (
        SELECT auth0ID 
        FROM users 
        WHERE userID = ?
      )
    `;
    
    await client.execute(deleteQuery, [userID]);

    client.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error demoting admin:", error);
    return NextResponse.json({ error: "Failed to demote admin" }, { status: 500 });
  }
} 