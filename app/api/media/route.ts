import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';

export async function POST(request: Request) {
  try {
    const { title, type, youtubeId, date, description } = await request.json();
    
    const [result] = await pool.query(
      `INSERT INTO media (title, type, youtube_id, date, description, church_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, type, youtubeId, date, description, 1] // temporarily hardcoding church_id as 1
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Media added successfully',
      mediaId: result.insertId
    });
  } catch (error) {
    console.error('Error adding media:', error);
    return NextResponse.json(
      { 
        error: 'Failed to add media',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM media ORDER BY date DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
} 