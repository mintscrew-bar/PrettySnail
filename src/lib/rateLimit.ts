/**
 * API 요청 제한(Rate Limiting) 유틸리티
 * - 단일 인스턴스 환경에서는 메모리 기반으로 동작
 * - 다중 인스턴스 환경에서는 Redis 등 외부 저장소 사용 권장
 * - 브루트포스 공격 방지 목적
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// 메모리 기반 요청 제한 저장소
const rateLimitStore = new Map<string, RateLimitEntry>();

// 5분마다 오래된 엔트리 정리
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * 허용 요청 최대 횟수
   */
  limit: number;
  /**
   * 제한 시간(초)
   */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * 요청 제한 체크 함수
 * @param identifier 요청자 식별자(IP, userId 등)
 * @param config 제한 설정
 * @returns 제한 결과
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const entry = rateLimitStore.get(identifier);
  if (!entry || entry.resetTime < now) {
    // 새 엔트리 생성
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, newEntry);
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetTime: newEntry.resetTime,
    };
  }
  // 기존 엔트리 유효
  if (entry.count >= config.limit) {
    // 제한 초과
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }
  // 카운트 증가
  entry.count++;
  rateLimitStore.set(identifier, entry);
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * 요청에서 클라이언트 IP 추출
 */
export function getClientIp(request: Request): string {
  // 다양한 헤더에서 IP 추출
  const headers = request.headers;
  // Vercel/Cloudflare
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  // Cloudflare
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  // 기타 프록시
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  // 기본값
  return 'unknown';
}

/**
 * 특정 식별자의 요청 제한 초기화 (테스트/수동 조치용)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}
