/**
 * 체계적인 에러 코드 시스템
 * 형식: [CATEGORY][NUMBER] - [설명]
 */

export enum ErrorCode {
  // 인증 에러 (AUTH)
  AUTH001 = 'AUTH001', // 인증 헤더 누락
  AUTH002 = 'AUTH002', // 잘못된 토큰 형식
  AUTH003 = 'AUTH003', // 토큰 만료
  AUTH004 = 'AUTH004', // 잘못된 사용자 정보
  AUTH005 = 'AUTH005', // 로그인 실패 - 사용자 없음
  AUTH006 = 'AUTH006', // 로그인 실패 - 비밀번호 불일치

  // 파일 업로드 에러 (FILE)
  FILE001 = 'FILE001', // 파일 없음
  FILE002 = 'FILE002', // 지원하지 않는 파일 형식
  FILE003 = 'FILE003', // 파일 크기 초과
  FILE004 = 'FILE004', // 파일 시그니처 불일치
  FILE005 = 'FILE005', // 파일 저장 실패

  // 유효성 검사 에러 (VALID)
  VALID001 = 'VALID001', // 요청 데이터 누락
  VALID002 = 'VALID002', // 잘못된 데이터 형식
  VALID003 = 'VALID003', // 필수 필드 누락

  // 데이터베이스 에러 (DB)
  DB001 = 'DB001', // 데이터 조회 실패
  DB002 = 'DB002', // 데이터 생성 실패
  DB003 = 'DB003', // 데이터 수정 실패
  DB004 = 'DB004', // 데이터 삭제 실패
  DB005 = 'DB005', // 데이터 없음

  // API 에러 (API)
  API001 = 'API001', // 잘못된 요청 메서드
  API002 = 'API002', // 내부 서버 오류
  API003 = 'API003', // 서비스 사용 불가

  // 제품 관련 에러 (PROD)
  PROD001 = 'PROD001', // 제품을 찾을 수 없음
  PROD002 = 'PROD002', // 제품 생성 실패
  PROD003 = 'PROD003', // 제품 수정 실패
  PROD004 = 'PROD004', // 제품 삭제 실패

  // 배너 관련 에러 (BANNER)
  BANNER001 = 'BANNER001', // 배너를 찾을 수 없음
  BANNER002 = 'BANNER002', // 배너 생성 실패
  BANNER003 = 'BANNER003', // 배너 수정 실패
  BANNER004 = 'BANNER004', // 배너 삭제 실패
}

export const ErrorMessages: Record<ErrorCode, string> = {
  // 인증
  [ErrorCode.AUTH001]: '인증 헤더가 누락되었습니다',
  [ErrorCode.AUTH002]: '잘못된 토큰 형식입니다',
  [ErrorCode.AUTH003]: '토큰이 만료되었습니다',
  [ErrorCode.AUTH004]: '잘못된 사용자 정보입니다',
  [ErrorCode.AUTH005]: '사용자를 찾을 수 없습니다',
  [ErrorCode.AUTH006]: '비밀번호가 일치하지 않습니다',

  // 파일 업로드
  [ErrorCode.FILE001]: '파일이 없습니다',
  [ErrorCode.FILE002]: '지원하지 않는 파일 형식입니다',
  [ErrorCode.FILE003]: '파일 크기가 너무 큽니다 (최대 20MB)',
  [ErrorCode.FILE004]: '파일 내용이 확장자와 일치하지 않습니다',
  [ErrorCode.FILE005]: '파일 저장 중 오류가 발생했습니다',

  // 유효성 검사
  [ErrorCode.VALID001]: '요청 데이터가 누락되었습니다',
  [ErrorCode.VALID002]: '데이터 형식이 올바르지 않습니다',
  [ErrorCode.VALID003]: '필수 필드가 누락되었습니다',

  // 데이터베이스
  [ErrorCode.DB001]: '데이터 조회 중 오류가 발생했습니다',
  [ErrorCode.DB002]: '데이터 생성 중 오류가 발생했습니다',
  [ErrorCode.DB003]: '데이터 수정 중 오류가 발생했습니다',
  [ErrorCode.DB004]: '데이터 삭제 중 오류가 발생했습니다',
  [ErrorCode.DB005]: '데이터를 찾을 수 없습니다',

  // API
  [ErrorCode.API001]: '잘못된 요청 메서드입니다',
  [ErrorCode.API002]: '내부 서버 오류가 발생했습니다',
  [ErrorCode.API003]: '서비스를 사용할 수 없습니다',

  // 제품
  [ErrorCode.PROD001]: '제품을 찾을 수 없습니다',
  [ErrorCode.PROD002]: '제품 생성 중 오류가 발생했습니다',
  [ErrorCode.PROD003]: '제품 수정 중 오류가 발생했습니다',
  [ErrorCode.PROD004]: '제품 삭제 중 오류가 발생했습니다',

  // 배너
  [ErrorCode.BANNER001]: '배너를 찾을 수 없습니다',
  [ErrorCode.BANNER002]: '배너 생성 중 오류가 발생했습니다',
  [ErrorCode.BANNER003]: '배너 수정 중 오류가 발생했습니다',
  [ErrorCode.BANNER004]: '배너 삭제 중 오류가 발생했습니다',
};

/**
 * API 에러 응답 인터페이스
 */
export interface ApiErrorResponse {
  error: string;
  errorCode: ErrorCode;
  message?: string;
  details?: unknown;
  timestamp: string;
}

/**
 * API 에러 응답 생성 헬퍼 함수
 */
export function createErrorResponse(
  errorCode: ErrorCode,
  additionalMessage?: string,
  details?: unknown
): ApiErrorResponse {
  return {
    error: ErrorMessages[errorCode],
    errorCode,
    message: additionalMessage,
    details,
    timestamp: new Date().toISOString(),
  };
}
