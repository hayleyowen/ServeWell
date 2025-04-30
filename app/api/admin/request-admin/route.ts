import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { getAllAdmins, showRequestingAdmins } from "@/app/lib/data";
import { RowDataPacket } from "mysql2/promise";

export async function POST(req: Request) {
  const { auth0ID } = await req.json();
  try {
    const client = await pool.getConnection();

   // Get both requesting admins AND regular admins with proper type casting
   const requestingAdmins = await showRequestingAdmins(auth0ID) as RowDataPacket[];
   const regularAdmins = await getAllAdmins(auth0ID) as RowDataPacket[];
   
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