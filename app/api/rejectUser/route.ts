import { NextResponse } from 'next/server';
import pool from '@/app/lib/database'; 


export async function POST(request: Request) {
    try {
        const { userID } = await request.json();
        console.log('Received Member ID:', userID);

        const client = await pool.getConnection();
        const query = `DELETE FROM requestingAdmins WHERE auth0ID = (Select auth0ID from users where userID = ?);`;
        const values = [userID];
        const [result] = await client.execute(query, values);
        client.release();

        return NextResponse.json({ success: true, affectedRows: result.affectedRows });    
    }  catch (error) {
        console.error('Error rejecting user:', error);
        return NextResponse.json({ error: 'Failed to reject user' }, { status: 500 });
    } 
}