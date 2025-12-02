/**
 * Cookie management utilities for secure authentication
 * Uses httpOnly cookies to prevent XSS attacks
 */

import { NextRequest, NextResponse } from 'next/server';
import { isProd } from './env';

export const AUTH_COOKIE_NAME = 'auth_token';
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Set authentication cookie in response
 */
export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: isProd, // HTTPS only in production
    sameSite: 'lax', // CSRF protection
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  return response;
}

/**
 * Get authentication token from request cookies
 */
export function getAuthToken(request: NextRequest): string | undefined {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value;
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
