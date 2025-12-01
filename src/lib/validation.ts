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
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
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
  buttonText: z.string().max(50).optional(),
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
