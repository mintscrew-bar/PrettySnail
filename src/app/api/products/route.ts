/**
 * 상품 API 라우트
 * - GET: 모든 상품 데이터 반환
 * - POST: 새로운 상품 생성 (인증 필요)
 */

import { NextRequest } from 'next/server';
import { getProducts, addProduct } from '@/lib/db';
import { ProductSchema } from '@/lib/validation';
import { withAuth } from '@/lib/auth';
import {
  handleApiError,
  createValidationErrorResponse,
  createSuccessResponse,
} from '@/lib/apiHelpers';
import { ErrorCode } from '@/lib/errorCodes';

/**
 * GET /api/products
 * 모든 상품 데이터 반환
 */
export async function GET() {
  try {
    const products = await getProducts();
    return createSuccessResponse(products);
  } catch (error) {
    return handleApiError(error, 'fetch products', 500, ErrorCode.PROD001);
  }
}

/**
 * POST /api/products
 * 새로운 상품 생성 (인증 필요)
 */
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate request body
    const validation = ProductSchema.safeParse(body);
    if (!validation.success) {
      return createValidationErrorResponse(validation);
    }

    const newProduct = await addProduct(validation.data);
    return createSuccessResponse(newProduct, 'Product created successfully', 201);
  } catch (error) {
    return handleApiError(error, 'create product', 500, ErrorCode.PROD002);
  }
});
