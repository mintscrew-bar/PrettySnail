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
 * Compress image on client side if it exceeds Vercel's 4.5MB limit
 * Uses browser-native Canvas API for compression
 */
async function compressImageIfNeeded(file: File): Promise<File> {
  const VERCEL_LIMIT = 4.5 * 1024 * 1024; // 4.5MB

  // If file is under limit, return as-is
  if (file.size <= VERCEL_LIMIT) {
    return file;
  }

  // Only compress images
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // Don't compress GIFs (might be animated)
  if (file.type === 'image/gif') {
    console.warn('GIF file exceeds 4.5MB limit but cannot be compressed (animation preservation)');
    return file;
  }

  try {
    console.log(`Compressing image: ${(file.size / 1024 / 1024).toFixed(2)}MB → target: <4.5MB`);

    // Create image element
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    // Resize if too large (max 2000px width)
    const MAX_WIDTH = 2000;
    let width = img.width;
    let height = img.height;

    if (width > MAX_WIDTH) {
      height = (height * MAX_WIDTH) / width;
      width = MAX_WIDTH;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Clean up
    URL.revokeObjectURL(imageUrl);

    // Try different quality levels until under limit
    const qualities = [0.8, 0.7, 0.6, 0.5];

    for (const quality of qualities) {
      const blob = await new Promise<Blob | null>(resolve => {
        canvas.toBlob(resolve, 'image/jpeg', quality);
      });

      if (!blob) continue;

      if (blob.size <= VERCEL_LIMIT) {
        const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
          type: 'image/jpeg',
        });

        console.log(
          `Compression successful: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB (quality: ${quality * 100}%)`
        );

        return compressedFile;
      }
    }

    // If still too large, return original and let server handle it
    console.warn('Client-side compression failed, sending to server for processing');
    return file;
  } catch (error) {
    console.error('Image compression error:', error);
    return file;
  }
}

/**
 * Upload file with authentication and CSRF protection
 * Automatically compresses images over 4.5MB on client side
 */
export async function uploadFile(file: File): Promise<{ url: string }> {
  // Compress if needed
  const processedFile = await compressImageIfNeeded(file);

  const formData = new FormData();
  formData.append('file', processedFile);

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
    throw new Error(data.error || '파일 저장 중 오류가 발생했습니다');
  }

  return data;
}
