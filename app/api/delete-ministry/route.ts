import { deleteMinistryByID } from '@/app/lib/data';
import { userMinistry, userStuff } from '@/app/lib/userstuff';
import { NextResponse } from 'next/server';
import { deleteMinistrySchema } from '@/app/utils/zodSchema'; 

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        console.log("Delete Ministry Request Body:", body); // Log the request body for debugging

        const validateData = deleteMinistrySchema.safeParse(body);
        if (!validateData.success) {
            console.error("Validation error:", validateData.error); // Log validation errors
            return new Response(JSON.stringify({ error: 'Invalid data' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const id = validateData.data.id;
        const auth0ID = validateData.data.auth0ID;

        if (!id || !auth0ID) {
            return new Response(JSON.stringify({ error: 'Ministry ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
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
        console.log('Ministry ID:', ministries); // Log the ministry ID for debugging
        const hasMatchingMinistry = ministries.some((ministry: { ministry_id: number }) => ministry.ministry_id === id);
        if (!hasMatchingMinistry) {
            return new Response(JSON.stringify({ error: 'You are not authorized to delete this ministry' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        } 

        const success = await deleteMinistryByID(id);
        if (success) {
            return new Response(JSON.stringify({ message: 'Ministry deleted successfully' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Ministry not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error deleting ministry:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}