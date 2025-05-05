import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { userStuff, newUser, userMinistry, userMinistryID, userChurchID } from '@/app/lib/userstuff';
import { MinistryDetailsButton } from './app/components/buttons/MinistryDetailsButton';

export async function middleware(req: NextRequest) {
  try {
    const currentUrl = req.nextUrl.pathname;
    const previousUrl = req.cookies.get('prevUrl')?.value;

    console.log('Current URL:', currentUrl);
    console.log('Previous URL (cookie):', previousUrl);

    // Step 1: Check for appSession
    const appSession = !!req.cookies.get('appSession')?.value;
    if (!appSession) {
      console.log('No appSession cookie, redirecting to login...');
      const response = NextResponse.redirect(new URL('/', req.url));
      response.cookies.set('prevUrl', currentUrl); // track before redirect
      return response;
    }

    // Step 2: Get session
    const session = await getSession(req, NextResponse.next());

    const currTime = Date.now() / 1000; // Convert to seconds
    const sessionExpiration1hr = session?.accessTokenExpiresAt - 82800; // Adjust for timezone offset
    //const sessionExpiration1min = sessionExpiration1hr - 3540;
    const timeRemaining = Math.floor((sessionExpiration1hr - currTime) / 60); // Convert to minutes
    const secondsRemaining = Math.floor((sessionExpiration1hr - currTime) % 60); // Remaining seconds
    console.log('Time Remaining:', timeRemaining, "minutes and", secondsRemaining, "seconds"); 


    if (!session || sessionExpiration1hr < currTime) {
      req.cookies.delete('appSession');
      console.log('No session found, redirecting to login...');
      const response = NextResponse.redirect(new URL('/', req.url));
      response.cookies.set('prevUrl', currentUrl);
      return response;
    }

    const auth0ID = session.user.sub;

    // Step 3: Get user role & churchID
    const userChurch = await userChurchID(auth0ID);
    const churchID = userChurch[0]?.church_id;
    console.log('User Church ID:', churchID);
    const userRole = await userStuff(auth0ID);
    const role = userRole[0]?.rID;
    console.log('User Role:', role);

    // Step 4: RBAC
    if (role === 2) {
      if (currentUrl.includes('/ministry')){
        const ministryId = currentUrl.split('/')[2];
        console.log('Ministry ID:', ministryId);
        const userMinistries = await userMinistry(auth0ID);
        const hasMatchingMinistry = userMinistries.some((ministry: { ministry_id: number }) => ministry.ministry_id.toString() === ministryId);
        if (hasMatchingMinistry) {
          console.log('Super admin accessing authorized ministry route');
          const response = NextResponse.next();
          response.cookies.set('prevUrl', currentUrl);
          return response;
        }
        console.log('Super admin trying access ministry route not in their church');
        const redirectUrl = new URL(previousUrl || '/', req.url);
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('prevUrl', currentUrl);  
        return response;
      }
      else if (currentUrl.includes('/church')) {
        const churchId = currentUrl.split('/')[3];
        console.log('Church ID:', churchId);
        const userChurches = await userChurchID(auth0ID);
        const churchID = userChurches[0]?.church_id;
        console.log('Churches associated with user church:', churchID);
        if (churchId === churchID.toString()) {
          console.log('Super admin accessing authorized church route');
          const response = NextResponse.next();
          response.cookies.set('prevUrl', currentUrl);
          return response;
        } else {
          console.log('Super admin trying access church route not their church');
          const redirectUrl = new URL(previousUrl || '/', req.url);
          const response = NextResponse.redirect(redirectUrl);
          response.cookies.set('prevUrl', currentUrl);  
          return response;
        }

      }
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
      const userMinistry = await userMinistryID(auth0ID);
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
  matcher: ['/((?!$|api|_next|public|favicon.ico|pages/|api/auth/).*)'],
};
