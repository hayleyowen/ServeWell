import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [result] = await pool.query(
      'DELETE FROM media WHERE id = ?', 
      [params.id]
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