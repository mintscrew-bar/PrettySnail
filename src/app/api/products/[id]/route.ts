import { NextRequest, NextResponse } from 'next/server';
import { updateProduct, deleteProduct, getProducts } from '@/lib/db';
import { ProductSchema } from '@/lib/validation';
import { withAuth } from '@/lib/auth';
import type { JWTPayload } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(async (request: NextRequest, context: { user: JWTPayload; params?: Promise<Record<string, string>> }) => {
  const params = await context.params!;
  try {
    const body = await request.json();

    // Validate partial update (all fields optional)
    const validation = ProductSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const updatedProduct = await updateProduct(params.id, validation.data);

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      {
        error: 'Failed to update product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (request: NextRequest, context: { user: JWTPayload; params?: Promise<Record<string, string>> }) => {
  const params = await context.params!;
  try {
    const success = await deleteProduct(params.id);

    if (!success) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
});
