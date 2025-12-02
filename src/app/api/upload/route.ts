import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { withAuth } from '@/lib/auth';
import { ErrorCode, createErrorResponse } from '@/lib/errorCodes';
import { logger } from '@/lib/logger';

// Configure route segment for file uploads
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 최대 실행 시간 60초


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

export const POST = withAuth(async (request: NextRequest, { user }) => {
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

    // 파일 크기 제한 (10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
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

    // 업로드 디렉토리 확인 및 생성
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // 고유한 파일명 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomString}${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // 클라이언트에서 접근 가능한 URL 반환
    const fileUrl = `/uploads/${fileName}`;

    logger.info('File uploaded successfully', {
      userId: user.userId,
      fileName,
      fileSize: file.size,
      fileUrl,
    });

    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    logger.error(
      'File upload failed: Server error',
      ErrorCode.FILE005,
      error instanceof Error ? { message: error.message, stack: error.stack } : error,
      { userId: user.userId, endpoint: request.url }
    );
    return NextResponse.json(createErrorResponse(ErrorCode.FILE005), { status: 500 });
  }
});
