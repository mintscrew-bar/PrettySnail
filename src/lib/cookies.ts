/**
 * Cookie management utilities for secure authentication
 * Uses httpOnly cookies to prevent XSS attacks
 */

import { NextRequest, NextResponse } from 'next/server';
import { isProd } from './env';

export const AUTH_COOKIE_NAME = 'auth_token';
// 개발 환경: 30일, 프로덕션: 7일
export const COOKIE_MAX_AGE = isProd ? 7 * 24 * 60 * 60 : 30 * 24 * 60 * 60;

/**
 * Set authentication cookie in response
 * @param response - NextResponse object
 * @param token - JWT token
 * @param rememberMe - Optional: if true, extends session to 90 days
 */
export function setAuthCookie(
  response: NextResponse,
  token: string,
  rememberMe = false
): NextResponse {
  // Calculate maxAge based on rememberMe option
  const maxAge = rememberMe
    ? 90 * 24 * 60 * 60 // 90 days for "remember me"
    : COOKIE_MAX_AGE; // Default: 30 days (dev) / 7 days (prod)

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: isProd, // HTTPS only in production
    sameSite: 'lax', // CSRF protection
    maxAge,
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
