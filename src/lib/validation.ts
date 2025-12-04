import { z } from 'zod';

// Product Validation Schema
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

// Banner Validation Schema
export const BannerSchema = z.object({
  type: z.enum(['main', 'promotion']),
  title: z.union([z.string().max(100), z.literal(''), z.undefined()]).optional(),
  description: z.union([z.string().max(500), z.literal(''), z.undefined()]).optional(),
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
  descriptionColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  imageUrl: z.string().min(1, 'Image URL is required'), // 상대 경로 허용
  imagePosition: z.string().max(50).optional(),
  imageX: z.number().min(0).max(100).optional(),
  imageY: z.number().min(0).max(100).optional(),
  imageScale: z.number().min(0.5).max(3).optional(),
  linkUrl: z.union([z.string().url('Invalid link URL'), z.literal(''), z.undefined()]).optional(),
  buttonText: z.union([z.string().max(50), z.literal(''), z.undefined()]).optional(),
  buttonUrl: z.union([z.string().url('Invalid button URL'), z.literal(''), z.undefined()]).optional(),
  showButton: z.boolean().optional(),
  position: z.number().int().min(0),
  isActive: z.boolean().default(true),
});

export type BannerInput = z.infer<typeof BannerSchema>;

// Admin Login Validation Schema
export const LoginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// Password Strength Validation
const passwordStrengthSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

// Change Password Validation Schema
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
 * Validate request body against a Zod schema
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
