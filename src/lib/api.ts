/**
 * API client utilities for authenticated requests
 * Automatically includes credentials (cookies) and CSRF tokens in all requests
 */

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

// Cache CSRF token in memory
let csrfToken: string | null = null;

/**
 * Get CSRF token from cookie if available
 */
function getCsrfTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrf_token') {
      return value;
    }
  }
  return null;
}

/**
 * Get CSRF token from API
 */
async function getCsrfToken(): Promise<string> {
  try {
    // First check if we have a cached token
    if (csrfToken) {
      return csrfToken;
    }

    // Try to get token from cookie
    const cookieToken = getCsrfTokenFromCookie();
    if (cookieToken) {
      csrfToken = cookieToken;
      return cookieToken;
    }

    // If no token in cookie, fetch from API
    const response = await fetch('/api/auth/csrf', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    csrfToken = data.csrfToken;

    if (!csrfToken) {
      throw new Error('CSRF token not found in response');
    }

    // Wait a brief moment for cookie to be set by browser
    await new Promise(resolve => setTimeout(resolve, 50));

    return csrfToken;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    throw new Error(
      `Failed to get CSRF token: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Authenticated fetch wrapper
 * Automatically includes credentials, CSRF tokens, and handles JSON serialization
 */
export async function apiFetch(url: string, options: FetchOptions = {}) {
  const { body, headers = {}, ...restOptions } = options;

  // Get CSRF token for state-changing requests
  const needsCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(
    (options.method || 'GET').toUpperCase()
  );

  let csrfHeader: Record<string, string> = {};
  if (needsCsrf) {
    const token = await getCsrfToken();
    csrfHeader = { 'x-csrf-token': token };

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[apiFetch] CSRF token:', token.substring(0, 10) + '...');
      console.log('[apiFetch] Cookie token:', getCsrfTokenFromCookie()?.substring(0, 10) + '...');
    }
  }

  const fetchOptions: RequestInit = {
    ...restOptions,
    credentials: 'include', // Always include cookies
    headers: {
      'Content-Type': 'application/json',
      ...csrfHeader,
      ...(headers as Record<string, string>),
    },
  };

  // Only add body if it exists
  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  // Parse JSON response
  const data = await response.json();

  // Throw error if response is not ok
  if (!response.ok) {
    const error = new Error(data.error || 'API request failed') as Error & {
      response: Response;
      data: unknown;
    };
    error.response = response;
    error.data = data;
    throw error;
  }

  return { response, data };
}

/**
 * Initialize CSRF token
 * Call this when the app loads to ensure CSRF token is ready
 */
export async function initializeCsrfToken(): Promise<void> {
  await getCsrfToken();
}

/**
 * Upload file with authentication and CSRF protection
 */
export async function uploadFile(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  // Get CSRF token
  const token = await getCsrfToken();

  const response = await fetch('/api/upload', {
    method: 'POST',
    credentials: 'include', // Include auth cookie
    headers: {
      'x-csrf-token': token,
    },
    body: formData,
    // Don't set Content-Type header - browser will set it with boundary
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'File upload failed');
  }

  return data;
}
