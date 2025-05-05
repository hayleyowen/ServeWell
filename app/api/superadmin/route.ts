import { NextResponse } from 'next/server';
import { createSuperAdminSchema } from '@/app/utils/zodSchema';
import { createSuperAdmin } from '../../lib/data';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log('Received SuperAdmin registration data:', data);

        // Validate the data here if necessary
        const validateData = createSuperAdminSchema.safeParse(data);
        if (!validateData.success) {
            console.error('Validation errors:', validateData.error.errors);
            return NextResponse.json(
                { error: 'Invalid data', details: validateData.error.errors },
                { status: 400 }
            );
        }
        // Check for required fields
        if(!data.firstName || !data.email || !data.church_id || !data.auth0ID) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // this is a public endpoint, so we don't need to check for auth0ID

        const result = await createSuperAdmin({
            firstName: data.firstName,
            email: data.email,
            church_id: data.church_id,
            auth0ID: data.auth0ID
        });

        console.log('SuperAdmin creation result:', result);
        return NextResponse.json(result);

    } catch (error) {
        console.error('Detailed Error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to register SuperAdmin', 
                details: error instanceof Error ? error.message : 'Unknown error' 
            },
            { status: 500 }
        );
    }
} 