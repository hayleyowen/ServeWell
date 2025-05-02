import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/database';

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
  }

  try {
    const [result] = await pool.query(
      'DELETE FROM media WHERE id = ?', 
      [id]
    );
    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
} 