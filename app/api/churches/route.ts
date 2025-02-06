import { NextResponse } from 'next/server';
import { createChurch } from '../../lib/data';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log('Received church data:', data);

        const result = await createChurch({
            churchName: data.churchName,
            denomination: data.denomination,
            email: data.email,
            phone: data.phone,
            address: data.address,
            postalCode: data.postalCode,
            city: data.city
        });
        
        console.log('Church creation result:', result);
        return NextResponse.json(result);

    } catch (error) {
        console.error('Detailed Error:', error);
        return NextResponse.json(
            { error: 'Failed to register church', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 