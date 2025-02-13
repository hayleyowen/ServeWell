import { NextResponse } from 'next/server';
import pool from '@/app/lib/database'; // Ensure this is the correct path to your MySQL pool

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received data:', body);

    const { MinistryName, Church_ID, Budget, description } = body;

    // Insert into the database
    const [result] = await pool.query(
      `INSERT INTO ministries (MinistryName, Church_ID, Budget, description) VALUES (?, ?, ?, ?)`,
      [MinistryName, Church_ID, Budget, description]
    );

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
    // Fetch ministries from the database
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
