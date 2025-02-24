import { NextRequest, NextResponse } from 'next/server'
import { useUser } from '@auth0/nextjs-auth0/client'
 
// This function can be marked `async` if using `await` inside
export default async function middleware(req: NextRequest) {
  const protectedRoutes = ['/admin/assign', 'super-homepage', 'ministry-creation']
  const publicRoutes = ['/', 'ministry', 'user-homepage']

  const path = req.nextUrl.pathname
  const isProtected = protectedRoutes.includes(path)
  const isPublic = publicRoutes.includes(path)


}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml).*)",
  ]
};