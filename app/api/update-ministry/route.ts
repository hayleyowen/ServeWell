import { NextResponse } from 'next/server';
import { updateMinistry } from '@/app/lib/data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ministryName, description } = body;

    // Validate the input
    if (!ministryName || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Call the updateMinistry function from data.ts
    const result = await updateMinistry({
      ministryName,
      description,
    });

    // Return the result
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/update-ministry:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}