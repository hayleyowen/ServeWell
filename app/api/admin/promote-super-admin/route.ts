import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { promoteAdminSchema } from "@/app/utils/zodSchema";
import { apiSuperAdminVerification, checkMatchingChurches } from "@/app/lib/apiauth";

export async function POST(req: Request) {
  const client = await pool.getConnection();

  try {
    const body = await req.json();
    console.log("superadmin promote request Body:", body); // Log the request body for debugging

    // Server-side validation using Zod
    const validateData = promoteAdminSchema.safeParse(body);
    if (!validateData.success) {
      console.error("Validation error:", validateData.error); // Log validation errors
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const userID = validateData.data.userID;
    const auth0ID = validateData.data.auth0ID;

    // Check if the user making changes (auth0ID) is a super-admin and belongs to the same church as the user being promoted
    const superAdminChurchID = await apiSuperAdminVerification(auth0ID);
    console.log("superAdminChurchID:", superAdminChurchID);
    if (superAdminChurchID.error) {
      console.error("Superadmin verification error:", superAdminChurchID.error); // Log verification errors
      return NextResponse.json({ error: "You are not authorized to perform this action" }, { status: 403 });
    }

    const isSameChurch = await checkMatchingChurches(userID, superAdminChurchID);
    if (!isSameChurch) {
      console.error("Church IDs do not match"); // Log church ID mismatch
      return NextResponse.json({ error: "You are not authorized to perform this action" }, { status: 403 });
    }

    // signed-in user is a super-admin and belongs to the same church as the user being promoted
    // Proceed with the promotion to super-admin

    // Update user's role to super-admin (rID = 2)
    const updateQuery = `
      UPDATE users 
      SET rID = 2 , minID = NULL, churchID = ?
      WHERE userID = ?
    `;
    
    await client.execute(updateQuery, [superAdminChurchID, userID]);
    
    // Remove from requestingAdmins table since they're now a super-admin
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
    console.error("Error promoting to super-admin:", error);
    return NextResponse.json({ error: "Failed to promote to super-admin" }, { status: 500 });
  }
} 