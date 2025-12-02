/**
 * Environment variable validation
 * Ensures critical environment variables are set in production
 */

const isProduction = process.env.NODE_ENV === 'production';
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

interface EnvConfig {
  JWT_SECRET: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  NEXT_PUBLIC_BASE_URL: string;
}

/**
 * Validates that all required environment variables are set
 * Throws an error in production if any are missing
 */
function validateEnv(): EnvConfig {
  const errors: string[] = [];

  // Check JWT_SECRET
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    if (isProduction) {
      errors.push('JWT_SECRET is required in production');
    }
  } else if (jwtSecret === 'default-secret-key-change-in-production') {
    if (isProduction) {
      errors.push('JWT_SECRET must be changed from default value in production');
    }
  } else if (jwtSecret.length < 32) {
    errors.push('JWT_SECRET should be at least 32 characters long for security');
  }

  // Check ADMIN_USERNAME
  const adminUsername = process.env.ADMIN_USERNAME;
  if (!adminUsername) {
    if (isProduction) {
      errors.push('ADMIN_USERNAME is required in production');
    }
  } else if (adminUsername === 'admin' && isProduction) {
    console.warn('⚠️  Warning: Using default ADMIN_USERNAME "admin" in production is not recommended');
  }

  // Check ADMIN_PASSWORD
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    if (isProduction) {
      errors.push('ADMIN_PASSWORD is required in production');
    }
  } else if (adminPassword === 'admin123') {
    if (isProduction) {
      errors.push('ADMIN_PASSWORD must be changed from default value in production');
    } else {
      console.warn('⚠️  Warning: Using default ADMIN_PASSWORD. Change this before deploying to production!');
    }
  } else if (adminPassword.length < 8) {
    errors.push('ADMIN_PASSWORD should be at least 8 characters long');
  }

  // Check NEXT_PUBLIC_BASE_URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    if (isProduction) {
      errors.push('NEXT_PUBLIC_BASE_URL is required in production');
    }
  } else if (baseUrl.includes('localhost') && isProduction) {
    errors.push('NEXT_PUBLIC_BASE_URL cannot be localhost in production');
  }

  // Throw error if any validation failed in production (but not during build)
  if (errors.length > 0) {
    const errorMessage = `Environment validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`;

    if (isProduction && !isBuild) {
      // Only throw in production runtime, not during build
      throw new Error(errorMessage);
    } else if (isProduction && isBuild) {
      // During production build, just warn
      console.warn('⚠️  ' + errorMessage);
      console.warn('\n⚠️  Ensure proper environment variables are set before deployment!\n');
    } else {
      // Development: show errors but don't throw
      console.error('❌ ' + errorMessage);
      console.error('\n⚠️  These errors will prevent deployment to production. Please fix them.\n');
    }
  }

  return {
    JWT_SECRET: jwtSecret || 'default-secret-key-change-in-production',
    ADMIN_USERNAME: adminUsername || 'admin',
    ADMIN_PASSWORD: adminPassword || 'admin123',
    NEXT_PUBLIC_BASE_URL: baseUrl || 'http://localhost:3000',
  };
}

// Validate on module load
export const env = validateEnv();

/**
 * Helper to check if we're in production
 */
export const isProd = isProduction;

/**
 * Helper to get validated environment variable
 */
export function getEnv(key: keyof EnvConfig): string {
  return env[key];
}
