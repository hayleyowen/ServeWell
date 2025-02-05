"use server";
import { getUserEmail } from "./getUserRoles";

export async function isUserSuperAdmin() {

    // check in the superadmin table if the user is a superadmin
    
    // in order to do this, we need to get the logged in user's 
    // member_id based on their email address associated with the session
    

    // get the logged in user's email address
    try {
        const email = await getUserEmail();
        console.log('user email', email);
    } catch (err) {
        console.error('Error checking superadmin status:', err);
        return false;
    }

    // then query the database to see if the user is a superadmin
    // WITH member_info AS (
    //     SELECT member_id 
    //     FROM churchmember 
    //     WHERE email = ''
    //   )
    //   SELECT 
    //     CASE 
    //       WHEN EXISTS (
    //         SELECT 1 
    //         FROM superadmin 
    //         WHERE member_id = (SELECT member_id FROM member_info)
    //       ) THEN true 
    //       ELSE false 
    //     END AS is_superadmin;

    

}    