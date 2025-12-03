import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from './lib/cookies';

/**
 * Middleware to protect admin routes
 * Ensures users must be authenticated to access admin pages (except login)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing admin pages (except login page)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Check for auth token in cookies
    const authToken = getAuthToken(request);

    if (!authToken) {
      // No auth token - redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // User is authenticated, allow access
    return NextResponse.next();
  }

  // Allow all other requests
  return NextResponse.next();
}

/**
 * Configure which routes this middleware should run on
 */
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
