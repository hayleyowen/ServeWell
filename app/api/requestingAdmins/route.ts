import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log('ChurchID & Auth0ID:', data.churchID, data.auth0ID);
        const client = await pool.getConnection();
        const query = `INSERT INTO requestingAdmins (churchID, auth0ID) VALUES (?, ?)`;
        const [result] = await client.query(query, [data.churchID, data.auth0ID]);
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
        const data = await req.json();
        console.log('Auth0ID:', data.auth0ID);
        const client = await pool.getConnection();
        const query = `SELECT * FROM requestingAdmins WHERE auth0ID = ?`;
        const [requestingAdmins] = await client.query(query, [data.auth0ID]);
        client.release();

        return NextResponse.json({ requestingAdmins });
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