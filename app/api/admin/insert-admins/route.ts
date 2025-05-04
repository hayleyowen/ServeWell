import {insertUser, verifyAdmin} from '@/app/lib/data';
import { NextResponse } from 'next/server';
import { insertUserSchema } from '@/app/utils/zodSchema';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Insert admin request body:', body);

        const validateData = insertUserSchema.safeParse(body);
        if (!validateData.success) {
            console.error('Validation error:', validateData.error);
            return NextResponse.json({ message: 'Invalid Data given' }, { status: 400 });
        }

        const nickname = validateData.data?.nickname;
        const auth0_id = validateData.data?.auth0_id;
        const email = validateData.data?.email;

        if (!nickname || !auth0_id || !email) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // there is no need to authenticate the user here
        // because the user is a new user with no role or privileges yet

        // console.log('User:', nickname, auth0_id, email);
        const result = await insertUser(nickname, auth0_id, email);
        return NextResponse.json({ success: true });
    } catch(error) {
        console.error('Detailed error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const {auth0_id} = await req.json();
        const admins = await verifyAdmin(auth0_id);
        return NextResponse.json(admins);
    } catch(error) {
        console.error('Detailed error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}