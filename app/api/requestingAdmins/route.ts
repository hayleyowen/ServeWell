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
    } catch (error) {
        console.error('Detailed error:', error);
        return NextResponse.json(
            {
                error: 'Failed to create requesting admin',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const auth0ID = searchParams.get('auth0ID');

        if (!auth0ID) {
            return NextResponse.json(
                { error: 'Missing auth0ID' },
                { status: 400 }
            );
        }

        console.log('Auth0ID:', auth0ID);
        const client = await pool.getConnection();
        const query = `SELECT c.church_id, c.churchname FROM requestingAdmins ra
                       INNER JOIN church c ON ra.churchID = c.church_id
                       WHERE ra.auth0ID = ? LIMIT 1`;
        const [rows] = await client.query(query, [auth0ID]);
        client.release();

        if (rows.length === 0) {
            return NextResponse.json({ church: null });
        }

        return NextResponse.json({ church: rows[0] });
    } catch (error) {
        console.error('Detailed error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch requesting admins',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        console.log('Deleting request for ChurchID & Auth0ID:', data.churchID, data.auth0ID);

        if (!data.churchID || !data.auth0ID) {
            return NextResponse.json(
                { error: 'Missing churchID or auth0ID' },
                { status: 400 }
            );
        }

        const client = await pool.getConnection();
        const query = `DELETE FROM requestingAdmins WHERE churchID = ? AND auth0ID = ?`;
        const [result] = await client.query(query, [data.churchID, data.auth0ID]);
        client.release();

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'No matching request found to delete' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Request deleted successfully',
        });
    } catch (error) {
        console.error('Detailed error:', error);
        return NextResponse.json(
            {
                error: 'Failed to delete request',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}