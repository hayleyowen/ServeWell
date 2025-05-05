import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/database';
import { deleteMediaSchema } from '@/app/utils/zodSchema';
import { apiSuperAdminVerification } from '@/app/lib/apiauth';

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const body = await request.json();
  console.log('Media Delete Request body:', body);

  const validateData = deleteMediaSchema.safeParse(body);
  if (!validateData.success) {
    console.error('Validation error:', validateData.error);
    return NextResponse.json(
      { error: 'Invalid data' },
      { status: 400 }
    );
  }
  const id = validateData.data.id;
  const auth0ID = validateData.data.auth0ID;

  if (!id || !auth0ID) {
    return NextResponse.json({ error: 'No ID or Auth0ID provided' }, { status: 400 });
  }

  // Check if the user is a super admin
  const superAdminChurchID = await apiSuperAdminVerification(auth0ID);

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