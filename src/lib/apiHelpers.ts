import { NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from './logger';
import { ErrorCode } from './errorCodes';

/**
 * API 에러 응답 생성
 * @param error - 에러 객체
 * @param operation - 작업 설명 (예: "fetch products", "create banner")
 * @param status - HTTP 상태 코드 (기본값: 500)
 * @param errorCode - 에러 코드 (옵션)
 * @returns NextResponse with error details
 */
export function handleApiError(
  error: unknown,
  operation: string,
  status = 500,
  errorCode?: string
) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';

  // 로깅
  logger.error(
    `Failed to ${operation}`,
    (errorCode || ErrorCode.API001) as ErrorCode,
    { error: errorMessage, operation }
  );

  return NextResponse.json(
    {
      error: `Failed to ${operation}`,
      errorCode: errorCode || ErrorCode.API001,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Validation 에러 응답 생성
 * @param validation - Zod validation 결과
 * @returns NextResponse with validation errors
 */
export function createValidationErrorResponse(validation: { success: false; error: z.ZodError }) {
  const details = validation.error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  logger.warn('Validation failed', {
    errorCode: ErrorCode.VALID001,
    details,
  });

  return NextResponse.json(
    {
      error: 'Validation failed',
      errorCode: ErrorCode.VALID001,
      details,
      timestamp: new Date().toISOString(),
    },
    { status: 400 }
  );
}

/**
 * 성공 응답 생성
 * @param data - 응답 데이터
 * @param message - 성공 메시지 (옵션)
 * @param status - HTTP 상태 코드 (기본값: 200)
 * @returns NextResponse with success data
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Not Found 응답 생성
 * @param resource - 리소스 이름 (예: "Product", "Banner")
 * @param id - 리소스 ID
 * @returns NextResponse with 404 error
 */
export function createNotFoundResponse(resource: string, id: string) {
  logger.warn(`${resource} not found`, {
    errorCode: ErrorCode.API002,
    resourceId: id,
  });

  return NextResponse.json(
    {
      error: `${resource} not found`,
      errorCode: ErrorCode.API002,
      resourceId: id,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}

/**
 * Unauthorized 응답 생성
 * @param message - 에러 메시지 (옵션)
 * @returns NextResponse with 401 error
 */
export function createUnauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    {
      error: message,
      errorCode: ErrorCode.AUTH001,
      timestamp: new Date().toISOString(),
    },
    { status: 401 }
  );
}

/**
 * Method Not Allowed 응답 생성
 * @param allowedMethods - 허용된 HTTP 메서드 목록
 * @returns NextResponse with 405 error
 */
export function createMethodNotAllowedResponse(allowedMethods: string[]) {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      errorCode: ErrorCode.API003,
      allowedMethods,
      timestamp: new Date().toISOString(),
    },
    {
      status: 405,
      headers: {
        'Allow': allowedMethods.join(', '),
      },
    }
  );
}
