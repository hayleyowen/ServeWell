import { NextResponse } from "next/server";
import pool from "@/app/lib/database";
import { showRequestingAdmins } from "@/app/lib/data";
import { updateAdminSchema } from "@/app/utils/zodSchema";
import { apiSuperAdminVerification } from "@/app/lib/apiauth";

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
    console.log("Request Body: ", body);
    
    const validateData = updateAdminSchema.safeParse(body);
    if (!validateData.success) {
      return NextResponse.json({ message: "Invalid Data given" }, { status: 400 });
    }

    const userID = validateData.data.userID;
    const minID = validateData.data.minID;
    const auth0ID = validateData.data.auth0ID;

    if (!userID || !minID || !auth0ID) {
      return NextResponse.json({ message: "A parameter is missing" }, { status: 400 });
    }

    // now we need to verify that this request is coming from an superadmin
    const superAdminChurchID = await apiSuperAdminVerification(auth0ID);
    if (superAdminChurchID.error) {
      return NextResponse.json({ message: superAdminChurchID.error }, { status: 403 });
    }

    // now we need to verify that the ministryID passed in is from the same church as the superadmin
    const client = await pool.getConnection();

    // get the church asssociated with the ministryID we have
    const churchIDQuery = `SELECT church_id FROM ministry WHERE ministry_id = ?;`;
    const values1 = [minID];
    const [result1] = await client.execute(churchIDQuery, values1);
    const church_id = result1[0].church_id;

    // check if the superadmin is from the same church as the ministry passed in
    if (church_id !== superAdminChurchID) {
      return NextResponse.json({ message: "You are not authorized to interact with this church" }, { status: 403 });
    }

    // now that the superadmin is verified, we can update the user
    const userUpdate = `Update users Set minID = ?, rID=1, churchID = ? WHERE userID = ?;`;
    const values3 = [minID, church_id, userID];
    const [result3] = await client.execute(userUpdate, values3);
    
    // handle error if the update fails
    if (result3.affectedRows === 0) {
      return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
    }
    client.release();
    

    return NextResponse.json({ success: true, affectedRows: result3.affectedRows });
  } catch (error) {
    console.error("Error updating admin ministry:", error);
    return NextResponse.json({ error: "Failed to update ministry" }, { status: 500 });
  }
}