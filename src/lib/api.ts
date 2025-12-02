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
 * Get CSRF token from API
 */
async function getCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  const response = await fetch('/api/auth/csrf', {
    credentials: 'include',
  });

  const data = await response.json();
  csrfToken = data.csrfToken;

  if (!csrfToken) {
    throw new Error('Failed to get CSRF token');
  }

  return csrfToken;
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

  const csrfHeader: Record<string, string> = needsCsrf ? { 'x-csrf-token': await getCsrfToken() } : {};

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
