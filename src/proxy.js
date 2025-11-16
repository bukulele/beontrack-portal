/**
 * Next.js 16 Proxy - Route Protection
 *
 * Protects all routes from unauthorized access.
 * Redirects unauthenticated users to /login page.
 *
 * Note: In Next.js 16, this file is called proxy.js (formerly middleware.js)
 */

import { NextResponse } from 'next/server';
import { auth } from './lib/auth';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/portal',  // Portal sign-in page (public)
];

// API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  '/api/auth',    // Better Auth endpoints
  '/api/portal',  // Portal auth endpoints (send-otp, verify-otp)
];

/**
 * Proxy function - runs on every request (Next.js 16+)
 */
export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Allow public routes (exact match)
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public API routes (prefix match)
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Has file extension (images, fonts, etc.)
  ) {
    return NextResponse.next();
  }

  // Check for session cookie (lightweight check)
  const sessionCookie = request.cookies.get('better-auth.session_token');

  // Portal authenticated routes - check session for portal users
  if (pathname.startsWith('/portal/') && pathname !== '/portal') {
    // Portal application pages require authentication
    // Allow if session exists (will be validated in portal pages)
    if (sessionCookie) {
      return NextResponse.next();
    }
    // No session - redirect to portal sign-in
    const portalLoginUrl = new URL('/portal', request.url);
    return NextResponse.redirect(portalLoginUrl);
  }

  if (!sessionCookie) {
    // No session - redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session exists - allow access
  // Note: This is a fast cookie check. Actual authorization happens in API routes.
  return NextResponse.next();
}

/**
 * Configure which routes this middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
