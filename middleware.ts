import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'
import { userStuff, newUser, userMinistryID } from '@/app/lib/userstuff'

export async function middleware(req: NextRequest) {

  try {

    // Step 1: Make sure the User is logged in thru Auth0 by checking for a valid session
    const appSession = !!req.cookies.get('appSession')?.value;
    if (appSession == false) {
      console.log('No appSession cookie, redirecting to login page...');
      return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }

    // Step 2: Retrieve the user's session data
    const session = await getSession(req, NextResponse.next());
    console.log('Users Auth0ID from Session Data:', session?.user.sub);
    if (!session) {
      console.log('No session found, redirecting to login page...');
      return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }

    const authid = session.user.sub;

    // Step 3: Fetch the user's role from the db
    const userRole = await userStuff(authid);
    const role = userRole[0]?.rID;
    console.log('User Role:', role);

    // Step 4: RBAC - Role Based Access Control

    // rID 2 = Super Admin - access to all routes
    if (role === 2) {
      console.log('User is a super admin, allowing access...');
      return NextResponse.next();
    }
    // rID 0 = Base User - can only see homepage and can create a church
    if (role === 0) {
      console.log('User is a base user, checking access...');
      const baseUserRoutes = ['/', '/church-creation'];
      if (baseUserRoutes.includes(req.nextUrl.pathname)) {
        console.log('Base user trying to access allowed route...');
        return NextResponse.next();
      } else {
        console.log('Base user trying to access restricted route, redirecting...');
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    // else if (role === 1) {
    //   console.log('User is a ministry admin, checking access...');
    //   if (req.nextUrl.pathname.startsWith('/ministry')) {
    //     console.log('Ministry admin trying to access ministry route...');
    //     const ministryId = req.nextUrl.pathname.split('/')[2];
    //   }
    //   const ministryId = req.nextUrl.pathname.split('/')[2];
    //   console.log('Ministry ID from URL:', ministryId);
    //   const userMinistry = await userMinistryID(authid);

    //   if (
    //     req.nextUrl.pathname.startsWith(`/ministry/${ministryId}`) &&
    //     ministryId === userMinistry[0]?.ministryID?.toString()
    //   ) {
    //     return NextResponse.next();
    //   } else {
    //     console.log('Ministry admin trying to access restricted route, redirecting...');
    //     return NextResponse.redirect(new URL('/', req.url));
    //   }
    // }
    
    // const ministryID = await userMinistryID(authid);
    // const userMinistry = ministryID[0]?.ministryID?.toString();
    // console.log('User Ministry ID:', userMinistry);


  } catch (error) {
    console.error('Error in middleware:', error);



    // if there's an error, maybe I should direct to a generic error page
    // however, we currently don't have one
    return NextResponse.redirect(new URL('/', req.url));
  }
  // If there is no appSession cookie, redirect to the login page
  // try {
  //   // Early escape for Auth0 and static assets
  //   if (
  //     req.nextUrl.pathname.startsWith('pages/api/auth') ||
  //     req.nextUrl.pathname.startsWith('/_next') ||
  //     req.nextUrl.pathname.startsWith('/favicon.ico')
  //   ) {
  //     return NextResponse.next();
  //   }

  //   // Retrieve the user's session data
  //   const session = await getSession(req, NextResponse.next());
  //   if (!session) {
  //     return NextResponse.redirect(new URL('pages/api/auth/login', req.url));
  //   }

  //   const auth_ID = session.user.sub;
  //   console.log('Auth ID:', auth_ID);
  //   const existingUserFlag = await newUser(auth_ID);

  //   if (!existingUserFlag) {
  //     return NextResponse.redirect(new URL('/', req.url));
  //   }

  //   const result = await userStuff(auth_ID);
  //   const role = result[0]?.rID;

  //   if (role === 2) {
  //     return NextResponse.next();
  //   }

  //   const baseUserRoutes = ['/', '/church-creation'];
  //   if (role === 0) {
  //     if (baseUserRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
  //       return NextResponse.next();
  //     } else {
  //       return NextResponse.redirect(new URL('/', req.url));
  //     }
  //   }

  //   const ministryId = req.nextUrl.pathname.split('/')[2];
  //   console.log('Ministry ID from URL:', ministryId);
  //   const userMinistry = await userMinistryID(auth_ID);

  //   if (
  //     req.nextUrl.pathname.startsWith(`/ministry/${ministryId}`) &&
  //     ministryId === userMinistry[0]?.ministryID?.toString()
  //   ) {
  //     return NextResponse.next();
  //   } else {
  //     return NextResponse.redirect(new URL('/', req.url));
  //   }
  // } catch (error) {
  //   console.error('Error in middleware:', error);
  //   return NextResponse.redirect(new URL('/', req.url));
  // }
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|pages/|api/auth/).*)' 
  ],
};