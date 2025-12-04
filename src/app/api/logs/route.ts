import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { ErrorCode, createErrorResponse } from '@/lib/errorCodes';

/**
 * GET /api/logs?type=error&limit=100
 * 로그 조회 API (관리자 전용)
 */
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const logType = (searchParams.get('type') || 'error') as 'error' | 'access' | 'debug';
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    // 로그 타입 검증
    const validTypes = ['error', 'access', 'debug'];
    if (!validTypes.includes(logType)) {
      return NextResponse.json(
        createErrorResponse(ErrorCode.VALID002, '유효한 로그 타입: error, access, debug'),
        { status: 400 }
      );
    }

    // limit 검증
    if (limit < 1 || limit > 1000) {
      return NextResponse.json(
        createErrorResponse(ErrorCode.VALID002, 'limit은 1-1000 사이여야 합니다'),
        { status: 400 }
      );
    }

    const logs = logger.readLogs(logType, limit);

    return NextResponse.json(
      {
        success: true,
        logType,
        count: logs.length,
        logs,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(
      'Failed to read logs',
      ErrorCode.API002,
      error instanceof Error ? { message: error.message, stack: error.stack } : error
    );

    return NextResponse.json(createErrorResponse(ErrorCode.API002), { status: 500 });
  }
});

/**
 * DELETE /api/logs?days=30
 * 오래된 로그 정리 API (관리자 전용)
 */
export const DELETE = withAuth(async (request: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const daysToKeep = parseInt(searchParams.get('days') || '30', 10);

    if (daysToKeep < 1 || daysToKeep > 365) {
      return NextResponse.json(
        createErrorResponse(ErrorCode.VALID002, 'days는 1-365 사이여야 합니다'),
        { status: 400 }
      );
    }

    logger.cleanOldLogs(daysToKeep);
    logger.info('Old logs cleaned by admin', {
      userId: user.userId,
      daysToKeep,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${daysToKeep}일 이전 로그를 정리했습니다`,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(
      'Failed to clean logs',
      ErrorCode.API002,
      error instanceof Error ? { message: error.message, stack: error.stack } : error,
      { userId: user.userId }
    );

    return NextResponse.json(createErrorResponse(ErrorCode.API002), { status: 500 });
  }
});
