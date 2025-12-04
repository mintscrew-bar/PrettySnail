// auth.ts
// API 인증 미들웨어 및 타입 정의
// - JWT 토큰 기반 인증, 쿠키/헤더 지원
// - CSRF 토큰 검증, 인증 실패/에러 처리
// - withAuth: API 라우트 보호용 미들웨어

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';
import { ErrorCode, createErrorResponse } from './errorCodes';
import { logger } from './logger';
import { getAuthToken } from './cookies';
import { verifyCsrfToken } from './csrf';

/**
 * 인증된 라우트 핸들러용 컨텍스트 타입
 * - user: JWT 페이로드
 * - params: 동적 라우트 파라미터(옵션)
 */
export interface AuthContext {
  user: JWTPayload;
  params?: Promise<Record<string, string>>;
}

/**
 * API 라우트를 JWT 인증으로 보호하는 미들웨어
 * - params 없는 경우(일반 라우트)
 */
export function withAuth(
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse>;

/**
 * API 라우트를 JWT 인증으로 보호하는 미들웨어
 * - params 있는 경우(동적 라우트)
 */
export function withAuth(
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
): (request: NextRequest, context: { params: Promise<Record<string, string>> }) => Promise<NextResponse>;

/**
 * 실제 미들웨어 구현
 * - 쿠키/헤더에서 토큰 추출
 * - CSRF 검증
 * - 인증 실패 시 401/403 반환
 * - 인증 성공 시 user 정보와 함께 핸들러 실행
 */
export function withAuth(
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    routeContext?: { params: Promise<Record<string, string>> }
  ) => {
    // 상태 변경 요청에 대해 CSRF 토큰 검증
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

    // 쿠키에서 토큰 추출(우선)
    let token = getAuthToken(request);
    // 없으면 Authorization 헤더에서 추출
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // 'Bearer ' 제거
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

    // 토큰 검증(JWT)
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

    // 인증 성공: user 정보와 함께 핸들러 실행
    return handler(request, { user, params: routeContext?.params });
  };
}
