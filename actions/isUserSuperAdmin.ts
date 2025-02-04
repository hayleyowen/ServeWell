"use server";
import { getUserRoles } from "./getUserRoles";

export async function isUserSuperAdmin() {
    try {
        const roles = await getUserRoles();
        console.log('roles', roles);
    } catch (err) {
        console.error('Error checking superadmin status:', err);
        return false;
    }
}    