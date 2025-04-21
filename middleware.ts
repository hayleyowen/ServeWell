import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { userStuff, newUser, userMinistryID } from '@/app/lib/userstuff';

export async function middleware(req: NextRequest) {
  try {
    const currentUrl = req.nextUrl.pathname;
    const previousUrl = req.cookies.get('prevUrl')?.value;
    const appSessionCleared = req.cookies.get('appSessionCleared')?.value;

    console.log('Current URL:', currentUrl);
    console.log('Previous URL (cookie):', previousUrl);

    // Step 0: Clear appSession on first page load
    if (!appSessionCleared) {
      console.log('Clearing appSession cookie on first page load...');
      const response = NextResponse.next();
      response.cookies.set('appSession', '', { maxAge: 0 });
      response.cookies.set('appSessionCleared', 'true');
      response.cookies.set('prevUrl', currentUrl); // track for next request
      return response;
    }

    // Step 1: Check for appSession
    const appSession = !!req.cookies.get('appSession')?.value;
    if (!appSession) {
      console.log('No appSession cookie, redirecting to login...');
      const response = NextResponse.redirect(new URL('/api/auth/login', req.url));
      response.cookies.set('prevUrl', currentUrl); // track before redirect
      return response;
    }

    // Step 2: Get session
    const session = await getSession(req, NextResponse.next());
    if (!session) {
      console.log('No session found, redirecting to login...');
      const response = NextResponse.redirect(new URL('/api/auth/login', req.url));
      response.cookies.set('prevUrl', currentUrl);
      return response;
    }

    const authid = session.user.sub;

    // Step 3: Get user role
    const userRole = await userStuff(authid);
    const role = userRole[0]?.rID;
    console.log('User Role:', role);

    // Step 4: RBAC
    if (role === 2) {
      console.log('Super Admin - allow');
      const response = NextResponse.next();
      response.cookies.set('prevUrl', currentUrl);
      return response;
    }

    if (role === 0) {
      const baseUserRoutes = ['/', '/church-creation', '/user-homepage'];
      if (baseUserRoutes.includes(currentUrl)) {
        console.log('Base user accessing allowed route');
        const response = NextResponse.next();
        response.cookies.set('prevUrl', currentUrl);
        return response;
      } else {
        console.log('Base user restricted');
        const redirectUrl = new URL(previousUrl || '/', req.url);
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('prevUrl', currentUrl);
        return response;
      }
    }

    if (role === 1) {
      const userMinistry = await userMinistryID(authid);
      const ministryID = userMinistry[0]?.minID;

      if (currentUrl === '/' || currentUrl === '/user-homepage') {
        console.log('Ministry admin accessing homepage');
        const response = NextResponse.next();
        response.cookies.set('prevUrl', currentUrl);
        return response;
      }

      if (currentUrl.startsWith('/ministry')) {
        const ministryId = currentUrl.split('/')[2];
        if (ministryId === ministryID.toString()) {
          console.log('Ministry admin accessing authorized ministry route');
          const response = NextResponse.next();
          response.cookies.set('prevUrl', currentUrl);
          return response;
        } else {
          console.log('Ministry admin unauthorized ministry access');
          const redirectUrl = new URL(previousUrl || '/', req.url);
          const response = NextResponse.redirect(redirectUrl);
          response.cookies.set('prevUrl', currentUrl);
          return response;
        }
      }

      console.log('Ministry admin accessing other restricted route');
      const redirectUrl = new URL(previousUrl || '/', req.url);
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set('prevUrl', currentUrl);
      return response;
    }

  } catch (error) {
    console.error('Middleware error:', error);
    const response = NextResponse.redirect(new URL('/', req.url));
    response.cookies.set('prevUrl', req.nextUrl.pathname);
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next|public|favicon.ico|pages/|api/auth/).*)'],
};
