import { neon } from "@neondatabase/serverless";
import { Church, Admin } from './defintions';

const sql = neon(process.env.DATABASE_URL!);

export async function getChurches() {
  try {
    const churches = await sql<Church>`SELECT * FROM church`;
    console.log(churches);
    return churches;
  } catch (err) {
    console.error('Database Error', err);
    throw new Error('Failed to fetch church data');
  }
}

export async function getUnAssignedAdmins() {
  try {
    const admins = await sql<Admin>`SELECT cm.* 
      FROM churchmember 
      cm JOIN admin a ON cm.member_id = a.member_id 
      WHERE a.admin_id = admin_id`;
    console.log(admins);
    return admins;
  } catch (err) {
    console.error('Database Error', err);
    throw new Error('Failed to fetch admin data');
  }
}