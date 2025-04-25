import { NextResponse } from 'next/server';
import pool from '@/app/lib/database'; 
import { createMinistry } from '@/app/lib/data';

export async function POST(request: Request) {

  // the POST request will create a new ministry in the database
  try {
    const data = await request.json();
    console.log('Received Ministry registration data:', data);

    const result = await createMinistry({
      MinistryName: data.MinistryName,
      Description: data.Description,
      Church_ID: data.Church_ID,
    });

    console.log('Created ministry:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'Ministry created successfully',
      ministryId: result.insertedId, // Returning the new ministry's ID
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

export async function GET(request: Request) {
  try {
    // Get auth0ID from query parameters
    const { searchParams } = new URL(request.url);
    const auth0ID = searchParams.get('auth0ID');

    if (!auth0ID) {
      return NextResponse.json({ error: 'Missing auth0ID parameter' }, { status: 400 });
    }

    const client = await pool.getConnection();

    // Find the user's church_id based on auth0ID by joining users and churchmember tables
    const [userRows]: any[] = await client.execute(
      `SELECT cm.church_id 
       FROM users u
       JOIN churchmember cm ON u.memID = cm.member_id
       WHERE u.auth0ID = ? 
       LIMIT 1`,
      [auth0ID]
    );

    let churchId;
    if (userRows.length > 0) {
      churchId = userRows[0].church_id;
    } else {
      // Optional: Handle case where user not found or has no church_id
      // For now, let's assume the user is always found and has a church_id
      // If not, maybe return empty list or error?
      console.warn(`User not found or no church_id for auth0ID: ${auth0ID}`);
      // Returning empty list if user or church not found
      client.release();
      return NextResponse.json([]); 
    }

    if (!churchId) {
         console.warn(`No church ID found for user ${auth0ID}`);
         client.release();
         return NextResponse.json([]); // Return empty list if no church ID
    }

    // Fetch ministries filtered by the user's church_id
    // Assuming ministry table has church_id column
    const [ministries] = await client.query(
      'SELECT * FROM ministry WHERE church_id = ?',
      [churchId]
    );

    client.release();

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
