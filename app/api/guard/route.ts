import pool from '@/app/lib/database';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const {auth0ID} = await req.json();
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