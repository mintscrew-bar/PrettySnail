/**
 * API Route Constants
 * 모든 API 엔드포인트를 중앙에서 관리
 */

export const API_ROUTES = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    CSRF: '/api/auth/csrf',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },

  // Products
  PRODUCTS: {
    BASE: '/api/products',
    BY_ID: (id: string) => `/api/products/${id}`,
  },

  // Banners
  BANNERS: {
    BASE: '/api/banners',
    BY_ID: (id: string) => `/api/banners/${id}`,
  },

  // Upload
  UPLOAD: '/api/upload',

  // Logs
  LOGS: '/api/logs',
} as const;

/**
 * Client-side page routes
 */
export const PAGE_ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  STORY: '/story',
  QUALITY: '/quality',
  CONTACT: '/contact',

  // Admin
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    BANNERS: '/admin/banners',
    LOGS: '/admin/logs',
    SETTINGS: '/admin/settings',
  },
} as const;
