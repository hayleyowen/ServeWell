import { NextResponse } from 'next/server';
import { updateMinistry } from '@/app/lib/data';
import { userStuff, userMinistry } from '@/app/lib/userstuff';
import { updateMinistrySchema } from '@/app/utils/zodSchema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Update Ministry Request body:', body); // Log the request body for debugging

    const validateData = await updateMinistrySchema.safeParse(body);
    if (!validateData.success) {
      console.error('Validation error:', validateData.error.format());
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    const ministryName = validateData.data.ministryName;
    const description = validateData.data.Description;
    const auth0ID = validateData.data.auth0ID;

    // Validate the input
    if (!ministryName || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if the user is a super admin
    const userRole = await userStuff(auth0ID);
    if (userRole.error) {
        console.log("Error fetching user role:", userRole.error);
    }
    const role = userRole[0]?.rID;
    if (role !== 2) {
        return NextResponse.json({ error: "You are not authorized to perform this action" }, { status: 403 });
    }

    // Check if the ministry ID belongs to the user's church
    const ministries = await userMinistry(auth0ID);


    // IF TIME PERMITS, GET THE MINISTRY ID FROM A DATABASE CALL SOMEHOW
    // console.log('Ministry ID:', ministries); // Log the ministry ID for debugging
    // const hasMatchingMinistry = ministries.some((ministry: { ministry_id: number }) => ministry.ministry_id === id);
    // if (!hasMatchingMinistry) {
    //     return new Response(JSON.stringify({ error: 'You are not authorized to delete this ministry' }), {
    //         status: 403,
    //         headers: { 'Content-Type': 'application/json' },
    //     });
    // } 

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