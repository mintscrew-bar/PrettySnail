/**
 * CSRF(Cross-Site Request Forgery) 방어 유틸리티
 * - 더블 서브밋 쿠키 패턴 사용
 * - 토큰 생성, 검증, 쿠키 설정 함수 제공
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { isProd } from './env';

export const CSRF_COOKIE_NAME = 'csrf_token';
export const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * CSRF 토큰 생성 함수
 * @returns 랜덤 문자열 토큰
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * CSRF 토큰을 쿠키에 저장
 * @param response NextResponse 객체
 * @param token CSRF 토큰
 */
export function setCsrfCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: false, // JS에서 읽을 수 있어야 함
    secure: isProd,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24시간
    path: '/',
  });
  return response;
}

/**
 * CSRF 토큰 검증 함수
 * - 쿠키와 헤더의 토큰이 모두 존재하고 일치해야 함
 * - 안전한 메서드(GET, HEAD, OPTIONS)는 검증 생략
 */
export function verifyCsrfToken(request: NextRequest): boolean {
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  // 개발 환경에서는 디버그 로그 출력
  if (process.env.NODE_ENV === 'development') {
    console.log('[verifyCsrfToken] Cookie token:', cookieToken?.substring(0, 10) + '...');
    console.log('[verifyCsrfToken] Header token:', headerToken?.substring(0, 10) + '...');
  }
  if (!cookieToken || !headerToken) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[verifyCsrfToken] Missing token - Cookie:', !!cookieToken, 'Header:', !!headerToken);
    }
    return false;
  }
  // 타이밍 어택 방지용 비교
  const isValid = timingSafeEqual(cookieToken, headerToken);
  if (process.env.NODE_ENV === 'development' && !isValid) {
    console.log('[verifyCsrfToken] Token mismatch!');
  }
  return isValid;
}

/**
 * 문자열을 타이밍 어택 방지 방식으로 비교
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * 요청에서 CSRF 토큰을 쿠키에서 추출
 */
export function getCsrfToken(request: NextRequest): string | undefined {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value;
}
