import { NextRequest, NextResponse } from 'next/server';
import { updateBanner, deleteBanner, getBanners } from '@/lib/db';
import { BannerSchema } from '@/lib/validation';
import { withAuth, AuthContext } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const banners = await getBanners();
    const banner = banners.find(b => b.id === id);

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Failed to fetch banner:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch banner',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(async (request: NextRequest, context: AuthContext) => {
  const params = await context.params!;
  try {
    const body = await request.json();

    // Validate partial update (all fields optional)
    const validation = BannerSchema.partial().safeParse(body);

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

    const updatedBanner = await updateBanner(params.id, validation.data);

    if (!updatedBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error('Failed to update banner:', error);
    return NextResponse.json(
      {
        error: 'Failed to update banner',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (request: NextRequest, context: AuthContext) => {
  const params = await context.params!;
  try {
    const success = await deleteBanner(params.id);

    if (!success) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Failed to delete banner:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete banner',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
});
