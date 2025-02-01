import { sql } from '@vercel/postgres';
import { Church, Admin } from './defintions';

export async function getChurches() {
  try {
    const data = await sql<Church>`SELECT * FROM church`;
    return data.rows;
  } catch (err) {
    console.error('Database Error', err);
    throw new Error('Failed to fetch church data');
  }
}

export async function getUnAssignedAdmins() {
  try {
    const admins = await sql<Admin>`SELECT * FROM church`;
    console.log(admins.rows);
    return admins.rows;
  } catch (err) {
    console.error('Database Error', err);
    throw new Error('Failed to fetch admin data');
  }
}