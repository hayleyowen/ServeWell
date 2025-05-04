import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { getAllAdmins, showRequestingAdmins } from "@/app/lib/data";
import { RowDataPacket } from "mysql2/promise";
import { requestAdminSchema } from "@/app/utils/zodSchema"; // Assuming you have a Zod schema for validation
import { userStuff } from "@/app/lib/userstuff";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Requesting admins Body:", body); // Log the request body for debugging

    // Server-side validation using Zod
    const validateData = requestAdminSchema?.safeParse(body);
    if (!validateData.success) {
      console.error("Validation error:", validateData.error); // Log validation errors
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }
    const auth0ID = validateData.data.auth0ID;

    // Verify the auth0ID is a super admin
    const userRole = await userStuff(auth0ID);
    if (userRole.error) {
      console.log("Error fetching user role:", userRole.error);
      return NextResponse.json({ error: "Failed to fetch user role" }, { status: 500 });
    }
    const role = userRole[0]?.rID;
    if (role !== 2) {
      return NextResponse.json({ error: "You are not authorized to perform this action" }, { status: 403 });
    }

    // now that we know this superadmin is from this church, we can get the requesting admins

    const client = await pool.getConnection();

   // Get both requesting admins AND regular admins with proper type casting
   const requestingAdmins = await showRequestingAdmins(auth0ID) as RowDataPacket[];
   const regularAdmins = await getAllAdmins(auth0ID) as RowDataPacket[];
   console.log('Requesting admins:', requestingAdmins);
   console.log('Regular admins:', regularAdmins);
   
   // Combine the results, preferring regularAdmins if there's overlap
   // This is to ensure we don't lose anyone from either list
   const combinedAdmins = [...requestingAdmins];
   
   // Add regularAdmins, avoiding duplicates by member_id
   const existingMemberIds = new Set(combinedAdmins.map(admin => admin.member_id));
   for (const admin of regularAdmins) {
     if (!existingMemberIds.has(admin.member_id)) {
       combinedAdmins.push(admin);
     }
   }
   
   console.log('Combined admins count:', combinedAdmins.length);
   client.release();

   return NextResponse.json(combinedAdmins);
 } catch (error) {
   console.error("Error fetching admins:", error);
   return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
 }
}