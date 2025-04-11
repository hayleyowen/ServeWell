import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'
import { userStuff, newUser, userMinistryID } from '@/app/lib/userstuff'

export async function middleware(req: NextRequest) {
  try {
    // Early escape for Auth0 and static assets
    if (
      req.nextUrl.pathname.startsWith('pages/api/auth') ||
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.startsWith('/favicon.ico')
    ) {
      return NextResponse.next();
    }

    const sessionCookie = req.cookies.get('appSession')?.value;

    // Redirect to login if no session cookie
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('pages/api/auth/login', req.url));
    }

    // Retrieve the user's session data
    const session = await getSession(req, NextResponse.next());
    if (!session) {
      return NextResponse.redirect(new URL('pages/api/auth/login', req.url));
    }

    const auth_ID = session.user.sub;
    console.log('Auth ID:', auth_ID);
    const existingUserFlag = await newUser(auth_ID);

    if (!existingUserFlag) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const result = await userStuff(auth_ID);
    const role = result[0]?.rID;

    if (role === 2) {
      return NextResponse.next();
    }

    const baseUserRoutes = ['/', '/church-creation'];
    if (role === 0) {
      if (baseUserRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    const ministryId = req.nextUrl.pathname.split('/')[2];
    console.log('Ministry ID from URL:', ministryId);
    const userMinistry = await userMinistryID(auth_ID);

    if (
      req.nextUrl.pathname.startsWith(`/ministry/${ministryId}`) &&
      ministryId === userMinistry[0]?.ministryID?.toString()
    ) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}

