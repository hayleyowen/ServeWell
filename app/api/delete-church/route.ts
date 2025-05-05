import { deleteChurchByID } from '@/app/lib/data';
import { apiSuperAdminVerification } from '@/app/lib/apiauth';
import { deleteChurchSchema } from '@/app/utils/zodSchema';

export async function DELETE(req: Request) {
    try {
        const body = await req.json();

        const validateData = deleteChurchSchema.safeParse(body);
        if (!validateData.success) {
            console.error('Validation error:', validateData.error); // Log validation errors
            return new Response(JSON.stringify({ error: 'Invalid request data' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const id = validateData.data.id;
        const auth0ID = validateData.data.auth0ID; // Extract the Auth0 ID from the request body

        if (!auth0ID || !id) {
            return new Response(JSON.stringify({ error: 'Auth0 ID and Church ID are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // need to check if the signed in user is a superadmin of this church
        const superAdminChurchID = await apiSuperAdminVerification(auth0ID);
        if (id !== superAdminChurchID) {
            return new Response(JSON.stringify({ error: 'You are not authorized to delete this church' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Proceed to delete the church
        const success = await deleteChurchByID(id);
        if (success) {
            return new Response(JSON.stringify({ message: 'Church deleted successfully' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Church not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error deleting church:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}