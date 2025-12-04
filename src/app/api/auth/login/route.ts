// /api/auth/login/route.ts
// 관리자 로그인 API 엔드포인트
// - JWT 기반 인증, httpOnly 쿠키 발급
// - 레이트 리밋(15분 5회), 유효성 검사, 에러/로그 처리
// - 성공 시 사용자 정보 반환

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
    // 레이트 리밋: 15분당 5회 제한(IP 기준)
    const rateLimit = checkRateLimit(clientIp, {
      limit: 5,
      windowSeconds: 15 * 60, // 15분
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

    // 최초 실행 시 기본 관리자 계정 생성
    await initializeDefaultAdmin();

    // 요청 바디 파싱 및 유효성 검사
    const body = await request.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      logger.warn('Login validation failed', {
        errors: validation.error.issues,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });
      // 유효성 검사 실패 응답

      return NextResponse.json(
        {
          error: 'Validation failed',
          errorCode: ErrorCode.VALID001,
          details: validation.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
          // 메시지: '입력한 정보를 다시 확인해주세요.',
        },
        { status: 400 }
      );
    } // 유효성 검사 통과

    const { username, password } = validation.data;

    // 관리자 인증
    const user = await findAdminUser(username, password);

    if (!user) {
      logger.warn('Login failed: Invalid credentials', {
        username,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });
      // 인증 실패 응답

      return NextResponse.json(
        { error: 'Invalid credentials', errorCode: ErrorCode.AUTH002 },
        { status: 401 }
      );
    } // 인증 성공

    // JWT 토큰 생성
    const token = await generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });
    // 토큰 생성 실패
    // 비밀번호 제외 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user;

    // httpOnly 쿠키에 JWT 저장
    const response = NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful',
    });
    // 쿠키 설정
    setAuthCookie(response, token);

    // 레이트 리밋 헤더 추가
    response.headers.set('X-RateLimit-Limit', rateLimit.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());

    logger.info('User logged in successfully', {
      userId: user.id,
      username: user.username,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });
    // 성공 응답 반환
    return response;
  } catch (error) {
    logger.error(
      'Login error',
      ErrorCode.AUTH001,
      { error: error instanceof Error ? error.message : 'Unknown error' },
      {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        endpoint: '/api/auth/login',
      } // 추가 컨텍스트
    );

    return NextResponse.json(
      {
        error: 'Login failed',
        errorCode: ErrorCode.AUTH001,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }  // 에러 처리
}// POST handler 끝
