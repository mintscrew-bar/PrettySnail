import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { withAuth } from '@/lib/auth';
import { ErrorCode, createErrorResponse } from '@/lib/errorCodes';
import { logger } from '@/lib/logger';
import sharp from 'sharp';

// Configure route segment for file uploads
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 최대 실행 시간 60초
// Body size limit은 vercel.json에서 설정 (25MB)

// File type verification using magic numbers (file signatures)
const ALLOWED_SIGNATURES: { [key: string]: number[][] } = {
  jpg: [[0xff, 0xd8, 0xff]],
  jpeg: [[0xff, 0xd8, 0xff]],
  png: [[0x89, 0x50, 0x4e, 0x47]],
  gif: [[0x47, 0x49, 0x46, 0x38]],
  webp: [[0x52, 0x49, 0x46, 0x46]], // RIFF (WebP container)
};

function verifyFileSignature(buffer: Buffer, extension: string): boolean {
  const ext = extension.replace('.', '').toLowerCase();
  const signatures = ALLOWED_SIGNATURES[ext];

  if (!signatures) return false;

  return signatures.some(signature =>
    signature.every((byte, index) => buffer[index] === byte)
  );
}

/**
 * 이미지 최적화 및 압축
 * - 최대 너비: 2000px (상세 이미지용 고해상도 유지)
 * - JPEG 품질: 85% (고품질 유지)
 * - WebP 변환: 최적의 압축률
 */
async function optimizeImage(
  buffer: Buffer,
  extension: string
): Promise<{ buffer: Buffer; contentType: string; extension: string }> {
  const ext = extension.replace('.', '').toLowerCase();

  // GIF는 애니메이션 가능성이 있으므로 압축하지 않음
  if (ext === 'gif') {
    return { buffer, contentType: 'image/gif', extension: '.gif' };
  }

  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    logger.info('Image optimization started', {
      originalSize: buffer.length,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
    });

    // 최대 너비 2000px로 리사이징 (비율 유지)
    const MAX_WIDTH = 2000;
    let processedImage = image;

    if (metadata.width && metadata.width > MAX_WIDTH) {
      processedImage = processedImage.resize(MAX_WIDTH, undefined, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // WebP로 변환 (최고의 압축률 + 품질)
    const optimizedBuffer = await processedImage
      .webp({ quality: 85, effort: 6 })
      .toBuffer();

    const compressionRatio = ((1 - optimizedBuffer.length / buffer.length) * 100).toFixed(1);

    logger.info('Image optimization completed', {
      originalSize: buffer.length,
      optimizedSize: optimizedBuffer.length,
      compressionRatio: `${compressionRatio}%`,
      format: 'webp',
    });

    return {
      buffer: optimizedBuffer,
      contentType: 'image/webp',
      extension: '.webp',
    };
  } catch (error) {
    logger.warn('Image optimization failed, using original', {
      error: error instanceof Error ? error.message : String(error),
    });
    // 최적화 실패 시 원본 사용
    return {
      buffer,
      contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      extension,
    };
  }
}

export const POST = withAuth(async (request: NextRequest, context) => {
  const { user } = context;
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      logger.warn('File upload failed: No file provided', {
        userId: user.userId,
        endpoint: request.url,
      });
      return NextResponse.json(createErrorResponse(ErrorCode.FILE001), { status: 400 });
    }

    // 파일 확장자 검증
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      logger.warn('File upload failed: Unsupported file type', {
        userId: user.userId,
        fileName: file.name,
        extension: fileExtension,
      });
      return NextResponse.json(
        createErrorResponse(ErrorCode.FILE002, '지원하는 형식: jpg, jpeg, png, gif, webp'),
        { status: 400 }
      );
    }

    // 파일 크기 제한 (20MB) - 고품질 상세 이미지 지원
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
    if (file.size > MAX_FILE_SIZE) {
      logger.warn('File upload failed: File size exceeds limit', {
        userId: user.userId,
        fileName: file.name,
        fileSize: file.size,
        maxSize: MAX_FILE_SIZE,
      });
      return NextResponse.json(createErrorResponse(ErrorCode.FILE003), { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Magic number로 실제 파일 타입 검증
    if (!verifyFileSignature(buffer, fileExtension)) {
      logger.error(
        'File upload failed: File signature mismatch',
        ErrorCode.FILE004,
        { fileName: file.name, extension: fileExtension },
        { userId: user.userId, endpoint: request.url }
      );
      return NextResponse.json(createErrorResponse(ErrorCode.FILE004), { status: 400 });
    }

    // 이미지 최적화 및 압축
    const originalSize = buffer.length;
    const optimized = await optimizeImage(buffer, fileExtension);

    // 고유한 파일명 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomString}${optimized.extension}`;

    // Vercel Blob Storage에 업로드
    const blob = await put(fileName, optimized.buffer, {
      access: 'public',
      contentType: optimized.contentType,
    });

    logger.info('File uploaded successfully to Vercel Blob', {
      userId: user.userId,
      fileName,
      originalSize,
      optimizedSize: optimized.buffer.length,
      compressionRatio: `${(((originalSize - optimized.buffer.length) / originalSize) * 100).toFixed(1)}%`,
      fileUrl: blob.url,
    });

    return NextResponse.json({ url: blob.url }, { status: 200 });
  } catch (error) {
    // 상세한 에러 정보 로깅
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      // 환경 변수 상태도 함께 로깅
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      nodeEnv: process.env.NODE_ENV,
    };

    logger.error(
      'File upload failed: Server error',
      ErrorCode.FILE005,
      errorDetails,
      { userId: user.userId, endpoint: request.url }
    );

    // 개발 환경에서는 더 자세한 에러 메시지 반환
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        {
          ...createErrorResponse(ErrorCode.FILE005),
          debug: errorDetails.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(createErrorResponse(ErrorCode.FILE005), { status: 500 });
  }
});
