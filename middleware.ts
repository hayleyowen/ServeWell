import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'
import { userStuff, newUser, userMinistryID } from '@/app/lib/userstuff'

export async function middleware(req: NextRequest) {

  try {

    const referrer = req.headers.get('referer');
    console.log('Referrer:', referrer);
    // Step 0: Make sure the appSession cookie is cleared out
    const appSessionCleared = req.cookies.get('appSessionCleared')?.value;
  
    console.log('appSessionCleared:', appSessionCleared);

    if (!appSessionCleared) {
      console.log('Clearing appSession cookie on first page load...');
      const response = NextResponse.next();

      // Clear the appSession cookie
      response.cookies.set('appSession', '', { maxAge: 0 });

      // Set a flag to indicate the appSession cookie has been cleared
      response.cookies.set('appSessionCleared', 'true');

      return response;
    }

    // Step 1: Make sure the User is logged in thru Auth0 by checking for a valid session
    const appSession = !!req.cookies.get('appSession')?.value;
    if (appSession == false) {
      console.log('No appSession cookie, redirecting to login page...');
      return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }

    // Step 2: Retrieve the user's session data
    const session = await getSession(req, NextResponse.next());
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
      const baseUserRoutes = ['/', '/church-creation', '/user-homepage'];
      if (baseUserRoutes.includes(req.nextUrl.pathname)) {
        console.log('Base user trying to access allowed route...');
        return NextResponse.next();
      } else {
        console.log('Base user trying to access restricted route, redirecting...');
        if (referrer) {
          console.log('Referrer:', referrer);
          return NextResponse.redirect(referrer);
        } else {
          console.log('No referrer found, redirecting to homepage...');
          return NextResponse.redirect(new URL('/', req.url));
        }
      }
    }

    // rID 1 = Ministry Admin - can only see their ministry's routes and the user-homepage
    if (role === 1) {
      console.log('User is a ministry admin, checking access...');

      // if they are trying to access the user homepage, allow access
      if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/user-homepage') {
        console.log('Ministry admin trying to access user homepage...');
        return NextResponse.next();
      }

      // get the specific minID for the signed-in user
      const userMinistry = await userMinistryID(authid);
      const ministryID = userMinistry[0]?.minID;

      // if they are trying to access their ministry's routes, allow access
      if (req.nextUrl.pathname.startsWith('/ministry')) {
        console.log('Ministry admin trying to access ministry route...');

        // this would retrieve the ID of the ministry that is trying to be accessed
        const ministryId = req.nextUrl.pathname.split('/')[2];
        console.log('Ministry ID from URL:', ministryId);

        // now do a check to see if the ministryId matches the user's ministry ID
        if (
          req.nextUrl.pathname.startsWith(`/ministry/${ministryId}`) &&
          ministryId === ministryID.toString()
        ) {
          return NextResponse.next();
        } else {
          console.log('Ministry admin trying to access an unauthorized ministry, redirecting...');
          if (referrer) {
            console.log('Referrer:', referrer);
            return NextResponse.redirect(referrer);
          } else {
            console.log('No referrer found, redirecting to homepage...');
            return NextResponse.redirect(new URL('/', req.url));
          }
        }
      }
      // if they are trying to access any other route, redirect them to the homepage
      else {
        if (referrer) {
          console.log('Referrer:', referrer);
          return NextResponse.redirect(referrer);
        } else {
          console.log('No referrer found, redirecting to homepage...');
          return NextResponse.redirect(new URL('/', req.url));
        }
      }
    }
    // // the else case is for when the user has a role that is not within our defined roles
    // else {
    //   console.log('User role not recognized, redirecting to homepage...');
    //   return NextResponse.redirect(new URL('/', req.url));
    // }

  } catch (error) {
    console.error('Error in middleware:', error);

    // if there's an error, maybe I should direct to a generic error page
    // however, we currently don't have one
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|pages/|api/auth/).*)' 
  ],
};