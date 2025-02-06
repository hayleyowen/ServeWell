import { NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const session = await getSession(request, res);

  const restrictedPaths = ['/admin-assign'];
  const { pathname } = request.nextUrl;

  if (restrictedPaths.includes(pathname) && !session) {
    return NextResponse.redirect(new URL('/api/auth/login', request.url))
  }
  return res;
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin-assign'],
};