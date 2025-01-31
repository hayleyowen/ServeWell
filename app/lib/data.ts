import { sql } from '@vercel/postgres';
import { Church } from './defintions';

export async function getChurches() {
  try {
    const data = await sql<Church>`SELECT * FROM church`;
    return data.rows;
  } catch (err) {
    console.error('Database Error', err);
    throw new Error('Failed to fetch church data');
  }
}

export async function createMinistry({ MinistryName, description, Church_ID, Budget }: {
  MinistryName: string;
  description: string;
  Church_ID: number;
  Budget: number;
}) {
  try {
    console.log('Creating ministry with data:', { MinistryName, description, Church_ID, Budget });

    // Convert the parameter names to match database column names
    const data = await sql`
      INSERT INTO ministry (ministryname, church_id, budget, description)
      VALUES (${MinistryName}, ${Church_ID}, ${Budget}, ${description})
      RETURNING *
    `;
    
    console.log('Insert result:', data.rows[0]);
    return data.rows[0];
  } catch (err) {
    console.error('Detailed Database Error:', err);
    throw new Error(`Failed to create ministry: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

export async function getMinistries() {
  try {
    const data = await sql`SELECT * FROM Ministry`;
    console.log('Fetched ministries:', data.rows);
    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch ministry data');
  }
} 