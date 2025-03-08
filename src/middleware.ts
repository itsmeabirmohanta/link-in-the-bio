import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET
  })
  
  console.log('Current path:', req.nextUrl.pathname)
  console.log('Auth token:', token)

  // Allow public paths
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api/auth') ||
    req.nextUrl.pathname === '/' ||
    req.nextUrl.pathname === '/auth/signin' ||
    req.nextUrl.pathname === '/auth/error'
  ) {
    return NextResponse.next()
  }

  // Require authentication for other paths
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
} 