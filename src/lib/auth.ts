import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';
import { ErrorCode, createErrorResponse } from './errorCodes';
import { logger } from './logger';
import { getAuthToken } from './cookies';
import { verifyCsrfToken } from './csrf';

/**
 * Middleware to protect API routes with JWT authentication
 */
export function withAuth<T = any>(
  handler: (
    request: NextRequest,
    context: { user: JWTPayload; params?: T }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: { params?: T }) => {
    // Verify CSRF token for state-changing requests
    if (!verifyCsrfToken(request)) {
      logger.warn('CSRF token verification failed', {
        method: request.method,
        endpoint: request.url,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });

      return NextResponse.json(
        {
          error: 'CSRF token verification failed',
          errorCode: ErrorCode.AUTH005,
        },
        { status: 403 }
      );
    }

    // Try to get token from cookie first (preferred method)
    let token = getAuthToken(request);

    // Fallback to Authorization header for backwards compatibility
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    if (!token) {
      logger.warn('Authentication failed: No token found in cookie or header', {
        endpoint: request.url,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });

      return NextResponse.json(
        createErrorResponse(ErrorCode.AUTH001),
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user) {
      logger.error(
        'Authentication failed: Invalid or expired token',
        ErrorCode.AUTH003,
        undefined,
        {
          endpoint: request.url,
          ip: request.headers.get('x-forwarded-for') || 'unknown',
        }
      );

      return NextResponse.json(
        createErrorResponse(ErrorCode.AUTH003),
        { status: 401 }
      );
    }

    // Pass user info to handler
    return handler(request, { user, params: context?.params });
  };
}
