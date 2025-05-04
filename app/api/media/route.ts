import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';
import { ResultSetHeader } from 'mysql2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const churchId = searchParams.get('churchId');

    if (!churchId) {
      return NextResponse.json(
        { error: 'Church ID is required' },
        { status: 400 }
      );
    }

    const [media] = await pool.query(
      `SELECT * FROM media WHERE church_id = ? ORDER BY date DESC`,
      [churchId]
    );

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, type, youtubeId, date, description, churchId } = await request.json();
    
    if (!churchId) {
      return NextResponse.json(
        { error: 'Church ID is required' },
        { status: 400 }
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO media (title, type, youtube_id, date, description, church_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, type, youtubeId, date, description, churchId]
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