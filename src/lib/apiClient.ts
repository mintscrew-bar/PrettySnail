/**
 * API Client with retry logic and error handling
 */

import { ApiError, isApiError } from './typeGuards';

export interface FetchOptions extends RequestInit {
  retries?: number;
  backoff?: number;
  timeout?: number;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Fetch with retry logic
 * @param url - API endpoint URL
 * @param options - Fetch options with retry configuration
 * @returns Parsed JSON response
 */
export async function fetchWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    retries = 2,
    backoff = 500,
    timeout = 10000,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiClientError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      // Parse and return successful response
      const data = await response.json();
      return data as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Don't retry on certain errors
      if (error instanceof ApiClientError) {
        // Don't retry 4xx errors (client errors)
        if (error.status && error.status >= 400 && error.status < 500) {
          throw error;
        }
      }

      // Don't retry if this was the last attempt
      if (attempt === retries) {
        break;
      }

      // Wait before retrying (exponential backoff)
      const delay = backoff * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // All retries failed
  throw lastError || new Error('Request failed after retries');
}

/**
 * GET request with retry
 */
export async function get<T>(url: string, options?: FetchOptions): Promise<T> {
  return fetchWithRetry<T>(url, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST request with retry
 */
export async function post<T>(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> {
  return fetchWithRetry<T>(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request with retry
 */
export async function put<T>(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> {
  return fetchWithRetry<T>(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request with retry
 */
export async function del<T>(url: string, options?: FetchOptions): Promise<T> {
  return fetchWithRetry<T>(url, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * Extract error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (isApiError(error)) {
    return error.data.error || error.data.message || 'An error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
}

/**
 * Get validation errors from API error
 */
export function getValidationErrors(
  error: unknown
): Array<{ field: string; message: string }> | null {
  if (isApiError(error) && error.data.details) {
    return error.data.details;
  }

  if (error instanceof ApiClientError && error.data) {
    const data = error.data as ApiError['data'];
    return data.details || null;
  }

  return null;
}
