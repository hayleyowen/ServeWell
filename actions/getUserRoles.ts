"use server";

import { getSession } from "@auth0/nextjs-auth0";


export async function getUserRoles() {
    const session = await getSession();
    const user = session?.user;
    if (!user) {
        throw new Error("User not authenticated");
    }
    console.log('user', user.sub);
    return user;
}