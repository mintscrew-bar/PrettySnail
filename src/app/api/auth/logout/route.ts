import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/cookies';
import { logger } from '@/lib/logger';
import { ErrorCode } from '@/lib/errorCodes';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: 'Logout successful',
    });

    clearAuthCookie(response);

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
