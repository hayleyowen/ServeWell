import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';

export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT ministry_id, ministryname FROM ministry');

        client.release();


        if (result.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'No ministries found' });
        }

        return NextResponse.json({ success: true, ministries: result.rows });

    } catch (err) {
        console.error('Database Error', err);
        throw new Error('Failed to fetch ministries');
    }
}