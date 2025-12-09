/**
 * Toast 알림 유틸리티
 * react-hot-toast 래퍼 함수들
 */

import toast from 'react-hot-toast';
import { TIMING } from '@/constants/timing';

/**
 * 성공 메시지 표시
 */
export function showSuccess(message: string) {
  return toast.success(message, {
    duration: TIMING.SUCCESS_MESSAGE_DURATION,
  });
}

/**
 * 에러 메시지 표시
 */
export function showError(message: string) {
  return toast.error(message, {
    duration: TIMING.ERROR_MESSAGE_DURATION,
  });
}

/**
 * 정보 메시지 표시
 */
export function showInfo(message: string) {
  return toast(message, {
    icon: 'ℹ️',
    duration: TIMING.TOAST_DURATION,
  });
}

/**
 * 경고 메시지 표시
 */
export function showWarning(message: string) {
  return toast(message, {
    icon: '⚠️',
    duration: TIMING.TOAST_DURATION,
    style: {
      background: '#fffbeb',
      color: '#92400e',
      border: '1px solid #fcd34d',
    },
  });
}

/**
 * 로딩 메시지 표시
 * @returns 토스트 ID (나중에 제거할 때 사용)
 */
export function showLoading(message: string) {
  return toast.loading(message);
}

/**
 * 특정 토스트 제거
 */
export function dismissToast(toastId: string) {
  toast.dismiss(toastId);
}

/**
 * 모든 토스트 제거
 */
export function dismissAllToasts() {
  toast.dismiss();
}

/**
 * Promise 기반 작업용 토스트
 * @param promise - 실행할 Promise
 * @param messages - 로딩/성공/에러 메시지
 */
export function showPromiseToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) {
  return toast.promise(promise, messages, {
    loading: {
      duration: Infinity,
    },
    success: {
      duration: TIMING.SUCCESS_MESSAGE_DURATION,
    },
    error: {
      duration: TIMING.ERROR_MESSAGE_DURATION,
    },
  });
}

/**
 * 확인 메시지 (Promise 반환)
 * @param message - 확인 메시지
 * @returns Promise<boolean> - 사용자가 확인하면 true
 */
export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const confirmed = confirm(message);
    resolve(confirmed);
  });
}

// 타입 export
export type { Toast } from 'react-hot-toast';
