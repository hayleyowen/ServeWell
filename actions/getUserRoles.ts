"use server";

import { getSession } from "@auth0/nextjs-auth0";

export async function getUserEmail() {
    const session = await getSession();
    const user = session?.user;
    if (!user) {
        throw new Error("User not authenticated");
    }
    return user.email;
}