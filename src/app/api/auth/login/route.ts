import { NextRequest, NextResponse } from 'next/server';
import { findAdminUser, initializeDefaultAdmin } from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import { LoginSchema } from '@/lib/validation';
import { setAuthCookie } from '@/lib/cookies';
import { logger } from '@/lib/logger';
import { ErrorCode } from '@/lib/errorCodes';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  try {
    // Rate limiting: 5 attempts per 15 minutes per IP
    const rateLimit = checkRateLimit(clientIp, {
      limit: 5,
      windowSeconds: 15 * 60, // 15 minutes
    });

    if (!rateLimit.success) {
      const resetDate = new Date(rateLimit.resetTime);
      logger.warn('Login rate limit exceeded', {
        ip: clientIp,
        resetTime: resetDate.toISOString(),
      });

      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          errorCode: ErrorCode.AUTH006,
          resetTime: rateLimit.resetTime,
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      );
    }

    // Initialize default admin if needed
    await initializeDefaultAdmin();

    // Parse and validate request body
    const body = await request.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      logger.warn('Login validation failed', {
        errors: validation.error.issues,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });

      return NextResponse.json(
        {
          error: 'Validation failed',
          errorCode: ErrorCode.VALID001,
          details: validation.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;

    // Find and authenticate user
    const user = await findAdminUser(username, password);

    if (!user) {
      logger.warn('Login failed: Invalid credentials', {
        username,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });

      return NextResponse.json(
        { error: 'Invalid credentials', errorCode: ErrorCode.AUTH002 },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    // Return user info (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    // Set httpOnly cookie with JWT token
    const response = NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful',
    });

    setAuthCookie(response, token);

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', rateLimit.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());

    logger.info('User logged in successfully', {
      userId: user.id,
      username: user.username,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return response;
  } catch (error) {
    logger.error(
      'Login error',
      ErrorCode.AUTH001,
      { error: error instanceof Error ? error.message : 'Unknown error' },
      {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        endpoint: '/api/auth/login',
      }
    );

    return NextResponse.json(
      {
        error: 'Login failed',
        errorCode: ErrorCode.AUTH001,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
