import { userChurchID, userStuff } from "./userstuff";
import pool from "@/app/lib/database"; // Assuming you have a database connection pool set up

export async function apiSuperAdminVerification(auth0ID: string) {
    try {
      const userRole = await userStuff(auth0ID);
      if (userRole.error) {
        console.log("Error fetching user role:", userRole.error);
      }
      const role = userRole[0]?.rID;
      if (role !== 2) {
        return { error: "You are not authorized to perform this action" };
      }

      // now we need to verify that this superadmin is from this church
      const churchID = await userChurchID(auth0ID);
      if (churchID.error) {
        console.log("Error fetching user church ID:", churchID.error);
      }

      const superAdminChurchID = churchID[0]?.church_id;
        if (!superAdminChurchID) {
            return { error: "Superadmin church ID not found" };
        }
    
      return superAdminChurchID;
    } catch (error) {
      console.error("Error in apiSuperAdminVerification:", error);
    }
}

export async function checkMatchingChurches(userID: number, superAdminChurchID: number) {
    // Check for the churchID of the user being demoted
    const client = await pool.getConnection();
    try {
        const userChurchIDQuery = `SELECT churchID FROM users WHERE userID = ?`;
        const [userChurchIDResult] = await client.query(userChurchIDQuery, [userID]);
        const userChurchID = userChurchIDResult[0]?.churchID;
        if (!userChurchID) {
            console.error("User church ID not found");
            return false;
        }
        if (userChurchID !== superAdminChurchID) {
            return false;
        }
        else {return true;}
    } catch (error) {
        console.error("Error checking matching churches:", error);
        return false;
    }
}