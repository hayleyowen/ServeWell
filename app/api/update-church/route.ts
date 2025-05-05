import { NextResponse } from 'next/server';
import { updateChurch } from '@/app/lib/data';
import { updateChurchSchema } from '@/app/utils/zodSchema';
import { userStuff } from '@/app/lib/userstuff';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received data for church update:', body);

     const validateData = updateChurchSchema.safeParse(body);
    if (!validateData.success) {
      console.error('Validation errors:', validateData.error.errors);
      return NextResponse.json(
        { error: 'Invalid data', details: validateData.error.errors },
        { status: 400 }
      );
    }
    
    const churchID = validateData.data.churchID;
    const churchName = validateData.data.churchName;
    const denomination = validateData.data.denomination;
    const email = validateData.data.email;
    const phone = validateData.data.phone;
    const address = validateData.data.address;
    const postalcode = validateData.data.postalcode;
    const city = validateData.data.city;
    const auth0ID = validateData.data.auth0ID;

    // Validate the input
    if (!churchID || !churchName || !denomination || !email || !phone || !address || !postalcode || !city || !auth0ID) {
      return NextResponse.json({ error: 'All fields are required, including churchID' }, { status: 400 });
    }

    // check if auth0ID is a superadmin for that church
    const userRole = await userStuff(auth0ID);
    if (userRole.error) {
      console.log("Error fetching user role:", userRole.error);
    }
    const role = userRole[0]?.rID;
    if (role !== 2) {
      return { error: "You are not authorized to perform this action" };
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