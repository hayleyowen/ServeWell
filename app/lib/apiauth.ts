import { userChurchID, userStuff } from "./userstuff";

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