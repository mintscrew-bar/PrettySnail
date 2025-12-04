/**
 * CSRF 토큰 발급 API
 * - 클라이언트가 안전하게 요청할 수 있도록 CSRF 토큰을 반환
 * - 토큰은 쿠키에도 저장됨
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken, setCsrfCookie, getCsrfToken } from '@/lib/csrf';

/**
 * GET /api/auth/csrf
 * CSRF 토큰 반환
 */
export async function GET(request: NextRequest) {
  // 기존 토큰이 있으면 사용, 없으면 새로 생성
  let token = getCsrfToken(request);
  if (!token) {
    token = generateCsrfToken();
  }
  const response = NextResponse.json({
    csrfToken: token,
  });
  // 쿠키에 CSRF 토큰 저장
  setCsrfCookie(response, token);
  return response;
}
