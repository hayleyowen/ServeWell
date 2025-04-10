import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import { getSession } from '@auth0/nextjs-auth0/edge'
import { userStuff, newUser, userMinistryID } from '@/app/lib/userstuff'

export async function middleware(req: NextRequest) {
  // early escape to avoid infinite redirect loop on Auth0 and static assets
  if (
    req.nextUrl.pathname.startsWith('/api/auth') ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  // Check for the Auth0 session cookie (typically called `appSession`)
  const sessionCookie = req.cookies.get('appSession')?.value

  // If no session cookie, send to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/api/auth/login', req.url))
  }

  try {

    // retrieve the user's session data 
    const session = await getSession(req, res)
    console.log('Session:', session)

    if (!session) {
      console.log('No session found, redirecting to login')
      return NextResponse.redirect(new URL('/api/auth/login', req.url))
    }

    // extract their auth0ID
    let auth_ID = session?.user.sub

    // use that to make sure that the user even has an account, and
    // if they don't, we send them to the login page
    const existingUserFlag = await newUser(auth_ID)
    console.log('Does user exist?', existingUserFlag)

    if (!existingUserFlag) {
      console.log('Redirecting to login,', auth_ID)
      return NextResponse.redirect(new URL('/', req.url))
    }

  // now we retrieve the user's role from the database
  const result = await userStuff(auth_ID)
  const role = result[0]?.rID

  // for superadmins, we don't need to do anything, they can access everything
  if (role === 2) {
    return NextResponse.next()
  }

  // for base users, we need to redirect them to the homepage if they try to access any other page than the church creation page
  const baseUserRoutes = ['/', '/church-creation']
  if (role === 0) {
    if (baseUserRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // for ministry admins, they can only access their ministry's pages (finance, member tracking, and calendar)
  else {
    // we need to get the ministry id from the url
    const ministryId = req.nextUrl.pathname.split('/')[2]

    // now we need to check if the user is assigned to that ministry
    const userMinistry = await userMinistryID(auth_ID)

    if (
      req.nextUrl.pathname.startsWith(`/ministry/${ministryId}`) &&
      ministryId === userMinistry[0]?.ministryID?.toString()
    ) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  } catch (error) {
    console.error('Error in middleware:', error)
    return NextResponse.redirect(new URL('/', req.url))
  }
}

export const config = {
  matcher: [
    '/((?!api/auth|_next|static|favicon.ico).*)',
  ],
}

