import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'
import  userStuff from '@/app/lib/userstuff'

export async function middleware(req: NextRequest) {
  // try {
  const res = NextResponse.next()

  // retrieve the user 
  const session = await getSession(req, res)
  // console.log('User's Auth0 ID:', session?.user.sub)

  let auth_ID = session?.user.sub

  // retrieve the role id for the superadmin from the database
  let SuperRole_ID = 2

  // send post function here to retrieve role id
  const result = await userStuff(auth_ID);
  console.log('Result:', result[0].Role_ID)
  const role = result[0].Role_ID
  
  // do a check to make sure that the user is a superadmin
  if (SuperRole_ID === role) {
    return NextResponse.next()
  } else {
    return NextResponse.redirect(new URL('/', req.url))
  }
  // } catch (error) {
  //   console.error('Error:', error)
  // }
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
}

export const config = {
  matcher: ['/super-homepage', '/admin-assign', '/super-homepage'],
}
