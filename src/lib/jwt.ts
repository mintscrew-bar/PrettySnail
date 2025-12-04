import { SignJWT, jwtVerify } from 'jose';
import { getEnv } from './env';

const SECRET_KEY = new TextEncoder().encode(getEnv('JWT_SECRET'));

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
}

/**
 * Generate a JWT token
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
