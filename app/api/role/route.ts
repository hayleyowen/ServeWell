import { getRoles } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // The GET request will fetch all roles from the database
        const [ roles ] = await getRoles();

        return NextResponse.json(roles);
    } catch (error) {
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