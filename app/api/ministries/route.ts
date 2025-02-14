import { NextResponse } from 'next/server';
import pool from '@/app/lib/database'; 
import { createMinistry } from '@/app/lib/data';

export async function POST(request: Request) {

  // the POST request will create a new ministry in the database
  try {
    const data = await request.json();
    console.log('Received Ministry registration data:', data);

    const result = await createMinistry({
      MinistryName: data.ministryName,
      Description: data.Description,
      Church_ID: data.Church_ID,
      Budget: data.Budget,
    });

    console.log('Created ministry:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'Ministry created successfully',
      ministryId: result.insertId, // Returning the new ministry's ID
    });

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create ministry',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // The GET request will fetch all ministries from the database
    const [ministries] = await pool.query('SELECT * FROM ministries');

    return NextResponse.json(ministries);
  } catch (error) {
    console.error('Error fetching ministries:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch ministries',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
