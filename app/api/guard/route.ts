import pool from '@/app/lib/database';
import { NextResponse } from 'next/server';
import { guardSchema } from '@/app/utils/zodSchema';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Guard Request Body:", body); // Log the request body for debugging

        const validateData = guardSchema.safeParse(body);
        if (!validateData.success) {
            console.error("Validation error:", validateData.error); // Log validation errors
            return NextResponse.json(
                { 
                error: 'Invalid request data',
                details: validateData.error.errors.map(err => err.message).join(', ')
                },
                { status: 400 }
            );
        }
        const auth0ID = validateData.data.auth0ID;

        // this route only returns the role of the user, so we don't need authorization here
        const client = await pool.getConnection();
        const query = `select rID from users where auth0ID = ?;`;
        const [result] = await client.execute(query, [auth0ID]);
        client.release();

        return NextResponse.json(result);
    } catch (error){
        console.error('Error fetching roles:', error);
        return NextResponse.json(
            { 
            error: 'Failed to fetch roles',
            details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }    
}