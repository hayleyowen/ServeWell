// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

export async function getUnAssignedAdmins() {
    const sql = neon(process.env.DATABASE_URL!);
    try {
        const admins = await sql`SELECT cm.* FROM churchmember  cm JOIN admin a ON cm.member_id = a.member_id WHERE a.admin_id = admin_id`;
        console.log(admins);
        return admins;
    } catch (err) {
        console.error('Database Error', err);
        throw new Error('Failed to fetch admin data');
    }
}

export async function adminAssign(memberId: number, ministryId: number) {
    const sql = neon(process.env.DATABASE_URL!);
    try {
        const result = await sql`INSERT INTO admin (adminusername, adminpassword, date_started, ministry_id, member_id) VALUES ('newadmin', 'temppassword', CURRENT_DATE, ${ministryId}, ${memberId})`;
        console.log(result);
        return result;
    } catch (err) {
        console.error('Database Error', err);
        throw new Error('Failed to assign admin');
    }
}

export async function checksuperadmin(memberId: number) {
    const sql = neon(process.env.DATABASE_URL!);
    try {
        const result = await sql`SELECT * FROM superadmin WHERE member_id = ${memberId}`;
        console.log(result);
        return result;
    } catch (err) {
        console.error('Database Error', err);
        throw new Error('Failed to check superadmin');
    }
}