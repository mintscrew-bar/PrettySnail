/**
 * 배너 상세 API 라우트
 * - GET: 특정 배너 조회
 * - PUT: 배너 업데이트 (인증 필요)
 * - DELETE: 배너 삭제 (인증 필요)
 */

import { NextRequest } from 'next/server';
import { updateBanner, deleteBanner, getBanners } from '@/lib/db';
import { BannerSchema } from '@/lib/validation';
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
    const banners = await getBanners();
    const banner = banners.find(b => b.id === id);

    if (!banner) {
      return createNotFoundResponse('Banner', id);
    }

    return createSuccessResponse(banner);
  } catch (error) {
    return handleApiError(error, 'fetch banner', 500, ErrorCode.BANNER001);
  }
}

export const PUT = withAuth(async (request: NextRequest, context: AuthContext) => {
  const params = await context.params!;
  try {
    const body = await request.json();

    // Validate partial update (all fields optional)
    const validation = BannerSchema.partial().safeParse(body);

    if (!validation.success) {
      return createValidationErrorResponse(validation);
    }

    const updatedBanner = await updateBanner(params.id, validation.data);

    if (!updatedBanner) {
      return createNotFoundResponse('Banner', params.id);
    }

    return createSuccessResponse(updatedBanner, 'Banner updated successfully');
  } catch (error) {
    return handleApiError(error, 'update banner', 500, ErrorCode.BANNER003);
  }
});

export const DELETE = withAuth(async (request: NextRequest, context: AuthContext) => {
  const params = await context.params!;
  try {
    const success = await deleteBanner(params.id);

    if (!success) {
      return createNotFoundResponse('Banner', params.id);
    }

    return createSuccessResponse({ id: params.id }, 'Banner deleted successfully');
  } catch (error) {
    return handleApiError(error, 'delete banner', 500, ErrorCode.BANNER004);
  }
});
