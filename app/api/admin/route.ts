import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { getSession } from "@auth0/nextjs-auth0";
import { showRequestingAdmins } from "@/app/lib/data";
import { updateAdminSchema } from "@/app/utils/zodSchema";
import { userStuff } from "@/app/lib/userstuff";

export async function GET(req: Request) {
  const { auth0ID } = await req.json();
  try {
    const client = await pool.getConnection();

    const ra = await showRequestingAdmins(auth0ID);
    console.log(ra);
    client.release();

    return NextResponse.json(ra);
  } catch (error) {
    console.error("Error fetching unassigned admins:", error);
    return NextResponse.json({ error: "Failed to fetch unassigned admins" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // use zod to validate the request body
    const validateData = updateAdminSchema.safeParse(body);
    if (!validateData.success) {
      return NextResponse.json({ message: "Invalid Data given" }, { status: 400 });
    }

    // destructure the body to get the userID and minID
    const userID = validateData.data.userID;
    const minID = validateData.data.minID;
    const auth0ID = validateData.data.auth0ID;

    // now we need to verify that this request is coming from an superadmin
    const userRole = await userStuff(auth0ID);
    if (userRole.error) {
      return NextResponse.json({ message: "Error fetching user role" }, { status: 500 });
    }
    const role = userRole[0]?.rID
    if (role !== 2) {
      return NextResponse.json({ message: "You are not authorized to perform this action" }, { status: 403 });
    }

    // now we need to verify that this superadmin is from this church
    

    const client = await pool.getConnection();

    // get the church asssociated with the ministryID we have
    const churchIDQuery = `SELECT church_id FROM ministry WHERE ministry_id = ?;`;
    const values1 = [minID];
    const [result1] = await client.execute(churchIDQuery, values1);
    const church_id = result1[0].church_id;

    const memberUpdate = `UPDATE users SET churchID = ? WHERE userID = ?;`;
    const values2 = [church_id, userID];
    const [result2] = await client.execute(memberUpdate, values2);

    const usersUpdate = `Update users Set minID = ?, rID=1 WHERE userID = ?;`;
    const values3 = [minID, userID];
    const [result3] = await client.execute(usersUpdate, values3);
    client.release();

    return NextResponse.json({ success: true, affectedRows: result3.affectedRows });
  } catch (error) {
    console.error("Error updating admin ministry:", error);
    return NextResponse.json({ error: "Failed to update ministry" }, { status: 500 });
  }
}