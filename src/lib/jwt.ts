/**
 * JWT 인증 및 토큰 발급/검증 유틸리티
 * - JWT(JSON Web Token)를 사용하여 사용자 인증 정보를 안전하게 관리합니다.
 * - 토큰 생성 및 검증 함수 제공
 * - SECRET_KEY는 환경변수에서 불러옴
 */
import { SignJWT, jwtVerify } from 'jose';
import { getEnv } from './env';

// JWT 서명에 사용할 비밀키 (환경변수에서 불러옴)
const SECRET_KEY = new TextEncoder().encode(getEnv('JWT_SECRET'));

/**
 * JWT 페이로드 타입 정의
 * - userId: 사용자 고유 ID
 * - username: 사용자 이름
 * - role: 권한(관리자 등)
 */
export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
}

/**
 * JWT 토큰 생성 함수
 * @param payload JWTPayload 타입의 사용자 정보
 * @returns JWT 문자열 (7일간 유효)
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7일 유효
    .sign(SECRET_KEY);
  return token;
}

/**
 * JWT 토큰 검증 및 페이로드 반환 함수
 * @param token JWT 문자열
 * @returns JWTPayload 또는 null (검증 실패 시)
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    // 페이로드 필드 검증
    if (
      typeof payload.userId === 'string' &&
      typeof payload.username === 'string' &&
      typeof payload.role === 'string'
    ) {
      return payload as unknown as JWTPayload;
    }
    return null;
  } catch {
    // 토큰 만료/변조 등 검증 실패
    return null;
  }
}
