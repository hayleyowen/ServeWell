import { NextResponse } from 'next/server';
import { updateChurch } from '@/app/lib/data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { churchID, churchName, denomination, email, phone, address, postalcode, city } = body;

    // Validate the input
    if (!churchID || !churchName || !denomination || !email || !phone || !address || !postalcode || !city) {
      return NextResponse.json({ error: 'All fields are required, including churchID' }, { status: 400 });
    }

    // Call the updateChurch function
    const result = await updateChurch({
      churchID, // Pass churchID to the function
      churchName,
      denomination,
      email,
      phone,
      address,
      postalcode,
      city,
    });

    // Return the result
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/update-church:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}