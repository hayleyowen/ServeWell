import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'
import { userStuff, newUser, userMinistryID } from '@/app/lib/userstuff'

export async function middleware(req: NextRequest) {
  // We need to assign the routes that each user can access based on their role

  // for superadmins, we don't need to do anything, they can access everything

  // for base users, we need to redirect them to the homepage if they try to access any other page than the church creation page
  const baseUserRoutes = ['/', '/church-creation']

  try {
    const res = NextResponse.next()

    // retrieve the user's session data 
    const session = await getSession(req, res)
    console.log('Session:', session)

    // extract their auth0ID
    let auth_ID = session?.user.sub

    // use that to make sure that the user even has an account, and
    // if they don't, we send them to the login page
    const existingUserFlag = await newUser(auth_ID)
    console.log('Does user exist?', existingUserFlag)

    if (!existingUserFlag) {
      return NextResponse.redirect(new URL('/api/auth/login', req.url))
    }

    // now we retrieve the user's role from the database
    const result = await userStuff(auth_ID)
    const role = result[0]?.rID

    // if a user is a superadmin, they can access any and all pages and api's
    if (role === 2) {
      return NextResponse.next()
    }

    // if the user is a BaseUser, they can only access the homepage and create a new church
    else if (role === 0) {
      // check if the user is trying to access any of their allowed pages
      if (baseUserRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        return NextResponse.next()
      }
      // if not, we redirect them to the homepage
      else {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // in the else case, the user is a ministry admin, and we need to check if they are trying to access their ministry's page
    else if (role === 1) {
      // we need to get the ministry id from the url
      const ministryId = req.nextUrl.pathname.split('/')[2]

      // now we need to check if the user is assigned to that ministry
      const userMinistryId = await userMinistryID(auth_ID)
      console.log('User Ministry ID:', userMinistryId)

      // check if the user is trying to access any of their allowed pages
      if (
        req.nextUrl.pathname.startsWith(`/ministry/${ministryId}`) &&
        ministryId === userMinistryId[0]?.ministryID.toString()
      ) {
        return NextResponse.next()
      }
      // if not, we redirect them to the homepage
      else {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // if the user has an unknown role, redirect to homepage as a fallback
    else {
      return NextResponse.redirect(new URL('/', req.url))
    }
  } catch (error) {
    console.error('Middleware error:', error)
    // optional: redirect to a dedicated error page
    return NextResponse.redirect(new URL('/error', req.url))
  }
}

// we want to run this middleware for all pages and api's
// but we don't want to run it for the auth0 login and callback pages
// so we exclude them from the matcher
export const config = {
  matcher: [
    '/((?!api/auth|_next|favicon.ico).*)',
  ],
}
