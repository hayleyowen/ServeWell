import { NextResponse } from 'next/server';
import pool from '@/app/lib/database'; 
import { createChurch } from '@/app/lib/data';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // console.log('Received data:', data.postalCode);

    const result = await createChurch({
      churchName: data.churchName,
      denomination: data.denomination,
      email: data.email,
      phone: data.phone,
      address: data.address,
      postalcode: data.postalCode,
      city: data.city,
    })

    console.log('Created church:', result.insertedId);

    return NextResponse.json({ 
      success: true, 
      message: 'Church created successfully',
      churchId: result.insertedId,
    });

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create church',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
      // Fetch churches from the database
      const [churches] = await pool.query('SELECT * FROM church');
  
      return NextResponse.json(churches);
    } catch (error) {
      console.error('Error fetching churches:', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch churches',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  }