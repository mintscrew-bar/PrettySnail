import { NextRequest, NextResponse } from 'next/server';
import { getBanners, addBanner } from '@/lib/db';
import { BannerSchema } from '@/lib/validation';
import { withAuth } from '@/lib/auth';

export async function GET() {
  try {
    const banners = getBanners();
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Failed to fetch banners:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch banners',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate request body
    const validation = BannerSchema.safeParse(body);

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

    const newBanner = addBanner(validation.data);
    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error('Failed to create banner:', error);
    return NextResponse.json(
      {
        error: 'Failed to create banner',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
});
