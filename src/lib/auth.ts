import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';
import { ErrorCode, createErrorResponse } from './errorCodes';
import { logger } from './logger';

/**
 * Middleware to protect API routes with JWT authentication
 */
export function withAuth(
  handler: (
    request: NextRequest,
    context: { user: JWTPayload; params?: Promise<Record<string, string>> }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: { params?: Promise<Record<string, string>> }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Authentication failed: Missing or invalid authorization header', {
        endpoint: request.url,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });

      return NextResponse.json(
        createErrorResponse(ErrorCode.AUTH001),
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
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
