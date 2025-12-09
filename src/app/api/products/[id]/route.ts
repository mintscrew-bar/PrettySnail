/**
 * 상품 상세 API 라우트
 * - GET: 특정 상품 조회
 * - PUT: 상품 업데이트 (인증 필요)
 * - DELETE: 상품 삭제 (인증 필요)
 */

import { NextRequest } from 'next/server';
import { updateProduct, deleteProduct, getProducts } from '@/lib/db';
import { ProductSchema } from '@/lib/validation';
import { withAuth, AuthContext } from '@/lib/auth';
import {
  handleApiError,
  createValidationErrorResponse,
  createSuccessResponse,
  createNotFoundResponse,
} from '@/lib/apiHelpers';
import { ErrorCode } from '@/lib/errorCodes';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
      return createNotFoundResponse('Product', id);
    }

    return createSuccessResponse(product);
  } catch (error) {
    return handleApiError(error, 'fetch product', 500, ErrorCode.PROD001);
  }
}

export const PUT = withAuth(async (request: NextRequest, context: AuthContext) => {
  const params = await context.params!;
  try {
    const body = await request.json();

    // Validate partial update (all fields optional)
    const validation = ProductSchema.partial().safeParse(body);

    if (!validation.success) {
      return createValidationErrorResponse(validation);
    }

    const updatedProduct = await updateProduct(params.id, validation.data);

    if (!updatedProduct) {
      return createNotFoundResponse('Product', params.id);
    }

    return createSuccessResponse(updatedProduct, 'Product updated successfully');
  } catch (error) {
    return handleApiError(error, 'update product', 500, ErrorCode.PROD003);
  }
});

export const DELETE = withAuth(async (request: NextRequest, context: AuthContext) => {
  const params = await context.params!;
  try {
    const success = await deleteProduct(params.id);

    if (!success) {
      return createNotFoundResponse('Product', params.id);
    }

    return createSuccessResponse({ id: params.id }, 'Product deleted successfully');
  } catch (error) {
    return handleApiError(error, 'delete product', 500, ErrorCode.PROD004);
  }
});
