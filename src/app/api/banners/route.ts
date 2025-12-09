/**
 * 배너 API 라우트
 * - GET: 모든 배너 데이터 반환
 * - POST: 새로운 배너 생성 (인증 필요)
 */

import { NextRequest } from 'next/server';
import { getBanners, addBanner } from '@/lib/db';
import { BannerSchema } from '@/lib/validation';
import { withAuth } from '@/lib/auth';
import {
  handleApiError,
  createValidationErrorResponse,
  createSuccessResponse,
} from '@/lib/apiHelpers';
import { ErrorCode } from '@/lib/errorCodes';

/**
 * GET /api/banners
 * 모든 배너 데이터 반환
 */
export async function GET() {
  try {
    const banners = await getBanners();
    return createSuccessResponse(banners);
  } catch (error) {
    return handleApiError(error, 'fetch banners', 500, ErrorCode.BANNER001);
  }
}

/**
 * POST /api/banners
 * 새로운 배너 생성 (인증 필요)
 */
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate request body
    const validation = BannerSchema.safeParse(body);
    if (!validation.success) {
      return createValidationErrorResponse(validation);
    }

    const newBanner = await addBanner(validation.data);
    return createSuccessResponse(newBanner, 'Banner created successfully', 201);
  } catch (error) {
    return handleApiError(error, 'create banner', 500, ErrorCode.BANNER002);
  }
});
