import pool from '@/app/lib/database';
import { userMinistryIDSchema } from '@/app/utils/zodSchema';
import { NextResponse } from 'next/server';

export async function POST( req: Request ){
    try {
        const body = await req.json();
        console.log('UserMinistryID Request body:', body); // Log the request body for debugging

        const validateData = await userMinistryIDSchema.safeParse(body);
        if (!validateData.success) {
            console.error('Validation error:', validateData.error.format());
            return NextResponse.json(
                { 
                error: 'Invalid input data',
                details: validateData.error.format()
                },
                { status: 400 }
            );
        }
        if (!validateData.data.authid) {
            return NextResponse.json(
                { 
                error: 'Auth0ID is required',
                details: 'Auth0ID is required'
                },
                { status: 400 }
            );
        }

        const authid = validateData.data.authid;

        // used in middleware to check user's ministry so no need to authorize
        const client = await pool.getConnection();
        const query = `SELECT minID FROM users WHERE auth0ID = ?;`;
        const [result] = await client.execute(query, [authid]);
        client.release();

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching user MinID:', error);
        return NextResponse.json(
            { 
            error: 'Failed to fetch user MinID',
            details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}