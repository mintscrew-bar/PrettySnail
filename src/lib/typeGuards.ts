import { Product, ProductTag, Banner } from '@/types';

/**
 * API 에러 타입 정의
 */
export interface ApiError {
  data: {
    details?: Array<{ field: string; message: string }>;
    error?: string;
    errorCode?: string;
    message?: string;
  };
  response?: Response;
}

/**
 * API 에러인지 확인하는 타입 가드
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as ApiError).data === 'object'
  );
}

/**
 * Error 객체인지 확인하는 타입 가드
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * ProductTag 객체인지 확인하는 타입 가드
 */
export function isProductTag(tag: unknown): tag is ProductTag {
  return (
    typeof tag === 'object' &&
    tag !== null &&
    'name' in tag &&
    'color' in tag &&
    typeof (tag as ProductTag).name === 'string' &&
    typeof (tag as ProductTag).color === 'string'
  );
}

/**
 * Product 객체인지 확인하는 타입 가드
 */
export function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) return false;

  const product = value as Partial<Product>;

  return (
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.category === 'string' &&
    typeof product.description === 'string' &&
    typeof product.isActive === 'boolean'
  );
}

/**
 * Banner 객체인지 확인하는 타입 가드
 */
export function isBanner(value: unknown): value is Banner {
  if (typeof value !== 'object' || value === null) return false;

  const banner = value as Partial<Banner>;

  return (
    typeof banner.id === 'string' &&
    (banner.type === 'main' || banner.type === 'promotion') &&
    typeof banner.imageUrl === 'string' &&
    typeof banner.position === 'number' &&
    typeof banner.isActive === 'boolean'
  );
}

/**
 * 문자열 배열인지 확인하는 타입 가드
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * 숫자인지 확인하는 타입 가드
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 유효한 이메일인지 확인하는 타입 가드
 */
export function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * 유효한 URL인지 확인하는 타입 가드
 */
export function isValidUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * 유효한 hex 색상 코드인지 확인하는 타입 가드
 */
export function isValidHexColor(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(value);
}

/**
 * Record<string, any> 타입인지 확인하는 타입 가드
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * null이 아닌지 확인하는 타입 가드
 */
export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

/**
 * undefined가 아닌지 확인하는 타입 가드
 */
export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

/**
 * null도 undefined도 아닌지 확인하는 타입 가드
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
