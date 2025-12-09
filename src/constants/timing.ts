/**
 * Timing Constants
 * 타임아웃, 딜레이 등 모든 타이밍 관련 상수
 */

export const TIMING = {
  // UI Delays
  SUGGESTION_HIDE_DELAY: 200, // 자동완성 숨김 딜레이 (ms)
  TOOLTIP_SHOW_DELAY: 300,
  TOOLTIP_HIDE_DELAY: 100,
  DEBOUNCE_SEARCH: 300, // 검색 디바운스 (ms)
  DEBOUNCE_INPUT: 500, // 일반 입력 디바운스 (ms)

  // Transitions
  TRANSITION_FAST: 150, // 빠른 트랜지션 (ms)
  TRANSITION_NORMAL: 300, // 일반 트랜지션 (ms)
  TRANSITION_SLOW: 500, // 느린 트랜지션 (ms)

  // Carousel & Slideshow
  CAROUSEL_INTERVAL: 5000, // 자동 슬라이드 간격 (ms)
  CAROUSEL_TRANSITION: 500, // 슬라이드 전환 시간 (ms)
  IMAGE_ROTATION_INTERVAL: 3000, // 이미지 자동 회전 간격 (ms)

  // API & Network
  API_TIMEOUT: 10000, // API 타임아웃 (ms)
  RETRY_DELAY: 500, // 재시도 기본 딜레이 (ms)
  MAX_RETRIES: 2, // 최대 재시도 횟수

  // Toast & Notifications
  TOAST_DURATION: 3000, // Toast 표시 시간 (ms)
  SUCCESS_MESSAGE_DURATION: 2000,
  ERROR_MESSAGE_DURATION: 4000,

  // Scroll
  SCROLL_DEBOUNCE: 100, // 스크롤 이벤트 디바운스 (ms)
  SMOOTH_SCROLL_DURATION: 500,
} as const;

/**
 * Convert to seconds
 */
export const TIMING_SECONDS = {
  CAROUSEL_INTERVAL: TIMING.CAROUSEL_INTERVAL / 1000,
  API_TIMEOUT: TIMING.API_TIMEOUT / 1000,
} as const;
