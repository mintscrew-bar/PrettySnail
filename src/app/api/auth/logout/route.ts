import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/cookies';
import { CSRF_COOKIE_NAME } from '@/lib/csrf';
import { logger } from '@/lib/logger';
import { ErrorCode } from '@/lib/errorCodes';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: 'Logout successful',
    });

    // Clear auth cookie
    clearAuthCookie(response);

    // Clear CSRF token cookie
    response.cookies.set({
      name: CSRF_COOKIE_NAME,
      value: '',
      httpOnly: false,
      maxAge: 0,
      path: '/',
    });

    logger.info('User logged out', {
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return response;
  } catch (error) {
    logger.error(
      'Logout error',
      ErrorCode.AUTH001,
      { error: error instanceof Error ? error.message : 'Unknown error' },
      {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        endpoint: '/api/auth/logout',
      }
    );

    return NextResponse.json(
      {
        error: 'Logout failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
