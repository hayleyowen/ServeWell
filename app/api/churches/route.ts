import { NextResponse } from 'next/server';
import pool from '@/app/lib/database'; 
import { createChurch } from '@/app/lib/data';
import { createChurchSchema } from '@/app/utils/zodSchema';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received Church Info at the API:', data);

    const validateData = createChurchSchema.safeParse(data);
    if (!validateData.success) {
      const errMessage = validateData.error.errors[0].message;
      console.error('Validation error:', errMessage); // Log validation errors
      return NextResponse.json({ message: errMessage }, { status: 400 });
    }

    if (!validateData.data.churchName || !validateData.data.denomination || !validateData.data.email || !validateData.data.phone || !validateData.data.address || !validateData.data.postalCode || !validateData.data.city) {
      console.error('Missing required fields:', validateData.data); // Log missing fields
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    
    // No need to authorize here, as this is a public endpoint
    const result = await createChurch({
      churchName: validateData.data.churchName,
      denomination: validateData.data.denomination,
      email: validateData.data.email,
      phone: validateData.data.phone,
      address: validateData.data.address,
      postalcode: validateData.data.postalCode,
      city: validateData.data.city,
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