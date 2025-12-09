import { SignJWT, jwtVerify } from 'jose';
import { getEnv, isProd } from './env';

const SECRET_KEY = new TextEncoder().encode(getEnv('JWT_SECRET'));

// 개발 환경: 30일, 프로덕션: 7일
const TOKEN_EXPIRATION = isProd ? '7d' : '30d';

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
}

/**
 * Generate a JWT token
 * @param payload - User information to encode
 * @param rememberMe - Optional: if true, extends token to 90 days
 */
export async function generateToken(
  payload: JWTPayload,
  rememberMe = false
): Promise<string> {
  // Use extended expiration for "remember me"
  const expiration = rememberMe ? '90d' : TOKEN_EXPIRATION;

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(SECRET_KEY);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    // Validate that the payload has required fields
    if (
      typeof payload.userId === 'string' &&
      typeof payload.username === 'string' &&
      typeof payload.role === 'string'
    ) {
      return payload as unknown as JWTPayload;
    }

    return null;
  } catch {
    return null;
  }
}
