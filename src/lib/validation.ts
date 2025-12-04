/**
 * 유효성 검증 스키마 모음 (Zod 사용)
 * - API 라우트에서 수신하는 요청 바디를 검증하기 위한 스키마들을 정의합니다.
 * - Product / Banner / Login / ChangePassword 등 주요 입력에 대한 규칙을 중앙에서 관리합니다.
 */
import { z } from 'zod';

// 제품(Product) 유효성 검사 스키마
// - 카테고리, 이름, 설명 등 필수 필드를 검증
// - thumbnails, detailImages는 상대경로(또는 URL) 허용
export const ProductSchema = z.object({
  category: z.string().min(1, 'Category is required').max(50),
  name: z.string().min(1, 'Name is required').max(100),
  tags: z.array(z.string()).default([]),
  description: z.string().min(1, 'Description is required').max(2000),
  badge: z.string().max(20).optional(),
  thumbnails: z.array(z.string().min(1)).optional(), // 상대 경로 허용
  detailImages: z.array(z.string().min(1)).optional(), // 상대 경로 허용
  imageUrl: z.string().optional(),
  storeUrl: z.union([z.string().url('Invalid URL'), z.literal(''), z.undefined()]).optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof ProductSchema>;

// 배너(Banner) 유효성 검사 스키마
// - 메인 히어로('main')와 프로모션('promotion') 배너를 구분
// - 색상은 6자리 HEX 형식만 허용(예: #ffffff)
// - 이미지 위치/크기(imageX, imageY, imageScale) 검증
export const BannerSchema = z.object({
  type: z.enum(['main', 'promotion']),
  title: z.union([z.string().max(100), z.literal(''), z.null()]).optional().nullable(),
  description: z.union([z.string().max(500), z.literal(''), z.null()]).optional().nullable(),
  contentPosition: z
    .enum([
      'top-left',
      'top-center',
      'top-right',
      'middle-left',
      'middle-center',
      'middle-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ])
    .optional(),
  titleColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  titleFontSize: z.string().max(20).optional(), // h1~h6 or pt value
  descriptionColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  descriptionFontSize: z.string().max(20).optional(), // h1~h6 or pt value
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  imageUrl: z.string().min(1, 'Image URL is required'), // 상대 경로 허용
  imagePosition: z.string().max(50).optional(),
  imageX: z.number().min(0).max(100).optional(),
  imageY: z.number().min(0).max(100).optional(),
  imageScale: z.number().min(0.5).max(3).optional(),
  linkUrl: z.union([z.string().url('Invalid link URL'), z.literal(''), z.null()]).optional().nullable(),
  buttonText: z.union([z.string().max(50), z.literal(''), z.null()]).optional().nullable(),
  buttonUrl: z.union([z.string().url('Invalid button URL'), z.literal(''), z.null()]).optional().nullable(),
  showButton: z.boolean().optional(),
  position: z.number().int().min(0),
  isActive: z.boolean().default(true),
});

export type BannerInput = z.infer<typeof BannerSchema>;

// 관리자 로그인 입력 검증 스키마
// - username/password 길이 제한으로 기본적인 공격을 방지
export const LoginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// 비밀번호 강도 검증 스키마
// - 최소 길이 및 소문자/대문자/숫자/특수문자 포함 요구
const passwordStrengthSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

// 비밀번호 변경 폼 검증 스키마
// - currentPassword: 현재 비밀번호
// - newPassword: 강도 규칙 적용
// - confirmPassword: newPassword와 동일해야 함 (refine로 체크)
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordStrengthSchema,
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

/**
 * 요청 본문을 Zod 스키마로 검증하는 유틸 함수
 * @param schema Zod 스키마
 * @param data 검증 대상 데이터(보통 request.body)
 * @returns 검증 성공 여부, 검증된 데이터 또는 ZodError
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}
