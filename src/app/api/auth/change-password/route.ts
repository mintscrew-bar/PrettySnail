import { NextResponse } from 'next/server';
import { changeAdminPassword } from '@/lib/db';
import { ChangePasswordSchema } from '@/lib/validation';
import { withAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { ErrorCode } from '@/lib/errorCodes';

/**
 * POST /api/auth/change-password
 * Change admin user password
 * Requires authentication
 */
export const POST = withAuth(async (request, context) => {
  try {
    const body = await request.json();
    const validation = ChangePasswordSchema.safeParse(body);

    if (!validation.success) {
      logger.warn('Password change validation failed', {
        errors: validation.error.issues,
        userId: context.user.userId,
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

    const { currentPassword, newPassword } = validation.data;

    // Change password
    const result = await changeAdminPassword(
      context.user.userId,
      currentPassword,
      newPassword
    );

    if (!result.success) {
      logger.warn('Password change failed', {
        userId: context.user.userId,
        username: context.user.username,
        error: result.error,
      });

      return NextResponse.json(
        {
          error: result.error || 'Failed to change password',
          errorCode: ErrorCode.AUTH002,
        },
        { status: 400 }
      );
    }

    logger.info('Password changed successfully', {
      userId: context.user.userId,
      username: context.user.username,
    });

    return NextResponse.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error(
      'Password change error',
      ErrorCode.AUTH001,
      { error: error instanceof Error ? error.message : 'Unknown error' },
      {
        userId: context.user.userId,
        endpoint: '/api/auth/change-password',
      }
    );

    return NextResponse.json(
      {
        error: 'Failed to change password',
        errorCode: ErrorCode.AUTH001,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
});
