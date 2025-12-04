import { NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken, setCsrfCookie, getCsrfToken } from '@/lib/csrf';

/**
 * GET /api/auth/csrf
 * Returns a CSRF token for the client to use in subsequent requests
 */
export async function GET(request: NextRequest) {
  // Get existing token or generate new one
  let token = getCsrfToken(request);

  if (!token) {
    token = generateCsrfToken();
  }

  const response = NextResponse.json({
    csrfToken: token,
  });

  // Set CSRF token in cookie
  setCsrfCookie(response, token);

  return response;
}
