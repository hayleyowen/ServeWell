import { NextResponse } from 'next/server';
import { sql } from '@/lib/data';
import { Church } from '@/lib/defintions';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const church = await sql<Church>`
      INSERT INTO church (
        churchname,
        churchphone,
        streetaddress,
        postalcode,
        city
      ) VALUES (
        ${data.churchName},
        ${data.phone},
        ${data.address},
        ${data.postalCode},
        ${data.city}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, church: church[0] });
  } catch (error) {
    console.error('Failed to create church:', error);
    return NextResponse.json(
      { error: 'Failed to create church' },
      { status: 500 }
    );
  }
} 