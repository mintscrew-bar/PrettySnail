import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';
import { ErrorCode, createErrorResponse } from './errorCodes';
import { logger } from './logger';
import { getAuthToken } from './cookies';
import { verifyCsrfToken } from './csrf';

/**
 * Context type for authenticated route handlers
 */
export interface AuthContext {
  user: JWTPayload;
  params?: Promise<Record<string, string>>;
}

/**
 * Middleware to protect API routes with JWT authentication
 * For routes without params
 */
export function withAuth(
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse>;

/**
 * Middleware to protect API routes with JWT authentication
 * For routes with params (dynamic routes like [id])
 */
export function withAuth(
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
): (request: NextRequest, context: { params: Promise<Record<string, string>> }) => Promise<NextResponse>;

/**
 * Implementation
 */
export function withAuth(
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    routeContext?: { params: Promise<Record<string, string>> }
  ) => {
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
    return handler(request, { user, params: routeContext?.params });
  };
}
