/**
 * Validation Constants
 * 유효성 검사에 사용되는 상수들
 */

export const VALIDATION = {
  // Product
  PRODUCT_NAME_MIN_LENGTH: 1,
  PRODUCT_NAME_MAX_LENGTH: 100,
  PRODUCT_DESCRIPTION_MIN_LENGTH: 1,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 1000,
  PRODUCT_CATEGORY_MAX_LENGTH: 50,
  PRODUCT_BADGE_MAX_LENGTH: 20,

  // Tag
  TAG_MIN_LENGTH: 1,
  TAG_MAX_LENGTH: 50,
  MAX_TAGS_PER_PRODUCT: 10,

  // Banner
  BANNER_TITLE_MAX_LENGTH: 100,
  BANNER_DESCRIPTION_MAX_LENGTH: 500,
  BANNER_BUTTON_TEXT_MAX_LENGTH: 50,

  // Image
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  MAX_THUMBNAILS: 5,
  MAX_DETAIL_IMAGES: 10,

  // URL
  URL_MAX_LENGTH: 500,

  // Password
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,

  // Username
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
} as const;

/**
 * Regex Patterns
 */
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  PHONE_KR: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  REQUIRED: '필수 입력 항목입니다',
  INVALID_EMAIL: '올바른 이메일 형식이 아닙니다',
  INVALID_URL: '올바른 URL 형식이 아닙니다',
  INVALID_COLOR: '올바른 색상 코드가 아닙니다 (예: #FF0000)',
  INVALID_PHONE: '올바른 전화번호 형식이 아닙니다',
  TOO_SHORT: (min: number) => `최소 ${min}자 이상 입력해주세요`,
  TOO_LONG: (max: number) => `최대 ${max}자까지 입력 가능합니다`,
  FILE_TOO_LARGE: (maxMB: number) => `파일 크기는 ${maxMB}MB 이하여야 합니다`,
  INVALID_FILE_TYPE: (types: string[]) => `허용된 파일 형식: ${types.join(', ')}`,
  PASSWORD_TOO_WEAK: '비밀번호는 최소 8자 이상이어야 합니다',
} as const;
