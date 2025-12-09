/**
 * 비밀번호 변경 API 라우트
 * - POST: 관리자 비밀번호 변경 (인증 필요)
 */

import { NextResponse } from 'next/server';
import { changeAdminPassword } from '@/lib/db';
import { ChangePasswordSchema } from '@/lib/validation';
import { withAuth, AuthContext } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { ErrorCode } from '@/lib/errorCodes';
import {
  handleApiError,
  createValidationErrorResponse,
  createSuccessResponse,
} from '@/lib/apiHelpers';

/**
 * POST /api/auth/change-password
 * 관리자 비밀번호 변경 (인증 필요)
 */
export const POST = withAuth(async (request, context: AuthContext) => {
  try {
    const body = await request.json();
    const validation = ChangePasswordSchema.safeParse(body);

    if (!validation.success) {
      logger.warn('Password change validation failed', {
        errors: validation.error.issues,
        userId: context.user.userId,
      });
      return createValidationErrorResponse(validation);
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
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    logger.info('Password changed successfully', {
      userId: context.user.userId,
      username: context.user.username,
    });

    return createSuccessResponse({ success: true }, 'Password changed successfully');
  } catch (error) {
    return handleApiError(error, 'change password', 500, ErrorCode.AUTH001);
  }
});
