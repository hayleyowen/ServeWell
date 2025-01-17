import { sql } from '@vercel/postgres';
import { Church } from './defintions';

export async function getChurches() {
  try {
    const data = await sql<Church>`SELECT * FROM "Church"`;
    return data.rows;
  } catch (err) {
    console.error('Database Error', err);
    throw new Error('Failed to fetch church data');
  }
} 