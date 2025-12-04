/**
 * CSRF (Cross-Site Request Forgery) protection utilities
 * Uses double-submit cookie pattern
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { isProd } from './env';

export const CSRF_COOKIE_NAME = 'csrf_token';
export const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generate a random CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Set CSRF token in cookie
 */
export function setCsrfCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: false, // Must be readable by JavaScript
    secure: isProd,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });

  return response;
}

/**
 * Verify CSRF token
 * Compares the token from the cookie with the token from the header
 */
export function verifyCsrfToken(request: NextRequest): boolean {
  // Skip CSRF check for safe methods (GET, HEAD, OPTIONS)
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[verifyCsrfToken] Cookie token:', cookieToken?.substring(0, 10) + '...');
    console.log('[verifyCsrfToken] Header token:', headerToken?.substring(0, 10) + '...');
  }

  // Both tokens must exist and match
  if (!cookieToken || !headerToken) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[verifyCsrfToken] Missing token - Cookie:', !!cookieToken, 'Header:', !!headerToken);
    }
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  const isValid = timingSafeEqual(cookieToken, headerToken);

  if (process.env.NODE_ENV === 'development' && !isValid) {
    console.log('[verifyCsrfToken] Token mismatch!');
  }

  return isValid;
}

/**
 * Timing-safe string comparison
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Get CSRF token from request cookie
 */
export function getCsrfToken(request: NextRequest): string | undefined {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value;
}
