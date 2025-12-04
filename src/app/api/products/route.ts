/**
 * 상품 API 라우트
 * - GET: 모든 상품 데이터 반환
 * - POST: 새로운 상품 생성 (인증 필요)
 * - 입력 데이터 유효성 검사 포함
 */


import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/db';
import { ProductSchema } from '@/lib/validation';
import { withAuth } from '@/lib/auth';

// GET /api/products
// 모든 상품 데이터 반환
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/products
// 새로운 상품 생성 (인증 필요)
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate request body
    const validation = ProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 } // 400 Bad Request
      );
    }

    const newProduct = await addProduct(validation.data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      {
        error: 'Failed to create product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 } // 500 Internal Server Error
    );
  }
});
