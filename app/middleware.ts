import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0'

export async function middleware(req: NextRequest) {
  // const protectedRoutes = ['/admin-assign', '/super-homepage', '/ministry-creation']
  // const publicRoutes = ['/', '/ministry', '/user-homepage', '/church-creation']

  // const path = req.nextUrl.pathname
  // const isProtected = protectedRoutes.some(route => path.startsWith(route))
  // const isPublic = publicRoutes.some(route => path.startsWith(route))

  // // Fetch user session using Auth0 (server-side)
  // const session = await getSession(req, NextResponse.next())
  // console.log('Session:', session)

  // if (!session || !session.user) {
  //   return NextResponse.redirect(new URL('/api/auth/login', req.url))
  // }

  // // Check if user is an admin (Modify based on your actual admin logic)
  // const isSuper = session.user.role === '2' // Ensure role is being sent in the session

  // if (isProtected && !isSuper) {
  //   return NextResponse.redirect(new URL('/', req.url))
  // }

  return NextResponse.redirect(new URL('/', req.url))
}

export const config = {
  matcher: '/super-homepage',
}
