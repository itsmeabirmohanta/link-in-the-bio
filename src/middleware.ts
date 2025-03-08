import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Define public paths that don't require authentication
const publicPaths = [
  '/_next',
  '/api/auth',
  '/',
  '/auth/signin',
  '/auth/error',
  '/favicon.ico'
]

export default async function middleware(req: NextRequest) {
  try {
    // Check if the path is public
    const isPublicPath = publicPaths.some(path => 
      req.nextUrl.pathname.startsWith(path)
    )

    if (isPublicPath) {
      return NextResponse.next()
    }

    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET
    })
    
    console.log({
      path: req.nextUrl.pathname,
      hasToken: !!token,
      env: {
        hasSecret: !!process.env.NEXTAUTH_SECRET,
        hasGithubId: !!process.env.GITHUB_ID,
        hasGithubSecret: !!process.env.GITHUB_SECRET,
        hasAllowedEmail: !!process.env.NEXT_PUBLIC_ALLOWED_EMAIL
      }
    })

    // Redirect to signin if no token
    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to error page
    return NextResponse.redirect(new URL('/auth/error', req.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 