import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';
import { requestingAdminSchema } from '@/app/utils/zodSchema';
import { apiSuperAdminVerification } from '@/app/lib/apiauth';


export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log('Requesting Admin Body:', data);

        // Validate the incoming data using your schema (if applicable)
        const validateData = requestingAdminSchema.safeParse(data);
        if (!validateData.success) {
            return NextResponse.json({ error: validateData.error }, { status: 400 });
        }

        const churchID = validateData.data.churchID;
        const auth0ID = validateData.data.auth0ID;

        // this route is public, so no need to verify the user's permissions

        // If the validation passes, proceed with the database operation
        const client = await pool.getConnection();
        const query = `INSERT IGNORE INTO requestingAdmins (churchID, auth0ID) VALUES (?, ?)`;
        const [result] = await client.query(query, [churchID, auth0ID]);
        client.release();

        return NextResponse.json({
            success: true,
            message: 'Requesting admin created successfully',
            requestingAdminId: result.insertId,
        });
    }
    catch (error) {
        console.error('Detailed error:', error);
        return NextResponse.json(
            {
                error: 'Failed to create requesting admin',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const data = await req.json();
        console.log('Auth0ID:', data.auth0ID);
        const client = await pool.getConnection();
        const query = `SELECT * FROM requestingAdmins WHERE auth0ID = ?`;
        const [requestingAdmins] = await client.query(query, [data.auth0ID]);
        client.release();

        return NextResponse.json({requestingAdmins});
    }
    catch (error) {
        console.error('Detailed error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch requesting admins',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}