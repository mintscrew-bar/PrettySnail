// db.ts
// Prisma ORM을 통한 DB 접근 및 변환 유틸리티
// - Product, Banner, AdminUser CRUD
// - Prisma 모델 → API 모델 변환, 포지션 케이스 변환
// - 관리자 초기화, 비밀번호 변경 등 지원

import { Product, Banner, AdminUser, ContentPosition } from '@/types';
import { hashPassword, comparePassword } from './password';
import prisma from './prisma';
import { getEnv } from './env';

// ContentPosition 변환: snake_case → kebab-case
function toKebabCase(str: string | null): ContentPosition | undefined {
  if (!str) return undefined;
  return str.replace(/_/g, '-') as ContentPosition;
}

// ContentPosition 변환: kebab-case → snake_case
function toSnakeCase(str: string | undefined): string | undefined {
  if (!str) return undefined;
  return str.replace(/-/g, '_');
}

// Prisma Product → API Product 변환
function toPrismaProduct(product: {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  badge: string | null;
  thumbnails: string[];
  detailImages: string[];
  imageUrl: string | null;
  storeUrl: string | null;
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Product {
  return {
    ...product,
    badge: product.badge || undefined,
    imageUrl: product.imageUrl || undefined,
    storeUrl: product.storeUrl || undefined,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

// Prisma Banner → API Banner 변환
function toPrismaBanner(banner: {
  id: string;
  type: 'main' | 'promotion';
  title: string | null;
  description: string | null;
  contentPosition: string | null;
  titleColor: string | null;
  descriptionColor: string | null;
  textColor: string | null;
  imageUrl: string;
  imagePosition: string | null;
  imageX: number | null;
  imageY: number | null;
  imageScale: number | null;
  linkUrl: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  showButton: boolean;
  position: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Banner {
  return {
    id: banner.id,
    type: banner.type,
    title: banner.title || undefined,
    description: banner.description || undefined,
    contentPosition: toKebabCase(banner.contentPosition),
    titleColor: banner.titleColor || undefined,
    descriptionColor: banner.descriptionColor || undefined,
    textColor: banner.textColor || undefined,
    imageUrl: banner.imageUrl,
    imagePosition: banner.imagePosition || undefined,
    imageX: banner.imageX || undefined,
    imageY: banner.imageY || undefined,
    imageScale: banner.imageScale || undefined,
    linkUrl: banner.linkUrl || undefined,
    buttonText: banner.buttonText || undefined,
    buttonUrl: banner.buttonUrl || undefined,
    showButton: banner.showButton,
    position: banner.position,
    isActive: banner.isActive,
    createdAt: banner.createdAt.toISOString(),
    updatedAt: banner.updatedAt.toISOString(),
  };
}

// Prisma AdminUser → API AdminUser 변환
function toPrismaAdminUser(user: {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'editor';
  createdAt: Date;
}): AdminUser {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
  };
}

// 제품 목록 조회
export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return products.map(toPrismaProduct);
}

// 제품 추가
export async function addProduct(
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> {
  const newProduct = await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      category: product.category,
      tags: product.tags || [],
      badge: product.badge,
      thumbnails: product.thumbnails || [],
      detailImages: product.detailImages || [],
      imageUrl: product.imageUrl,
      storeUrl: product.storeUrl,
      featured: product.featured || false,
      isActive: product.isActive,
    },
  });
  return toPrismaProduct(newProduct);
}

// 제품 수정
export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.category !== undefined && { category: updates.category }),
        ...(updates.tags !== undefined && { tags: updates.tags }),
        ...(updates.badge !== undefined && { badge: updates.badge }),
        ...(updates.thumbnails !== undefined && { thumbnails: updates.thumbnails }),
        ...(updates.detailImages !== undefined && { detailImages: updates.detailImages }),
        ...(updates.imageUrl !== undefined && { imageUrl: updates.imageUrl }),
        ...(updates.storeUrl !== undefined && { storeUrl: updates.storeUrl }),
        ...(updates.featured !== undefined && { featured: updates.featured }),
        ...(updates.isActive !== undefined && { isActive: updates.isActive }),
      },
    });
    return toPrismaProduct(updatedProduct);
  } catch {
    return null;
  }
}

// 제품 삭제
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// 배너 목록 조회
export async function getBanners(): Promise<Banner[]> {
  const banners = await prisma.banner.findMany({
    orderBy: { position: 'asc' },
  });
  return banners.map(toPrismaBanner);
}

// 배너 추가
export async function addBanner(
  banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Banner> {
  const newBanner = await prisma.banner.create({
    data: {
      type: banner.type,
      title: banner.title,
      description: banner.description,
      contentPosition: banner.contentPosition
        ? (toSnakeCase(banner.contentPosition) as 'top_left' | 'top_center' | 'top_right' | 'middle_left' | 'middle_center' | 'middle_right' | 'bottom_left' | 'bottom_center' | 'bottom_right')
        : undefined,
      titleColor: banner.titleColor,
      descriptionColor: banner.descriptionColor,
      textColor: banner.textColor,
      imageUrl: banner.imageUrl,
      imagePosition: banner.imagePosition,
      imageX: banner.imageX,
      imageY: banner.imageY,
      imageScale: banner.imageScale,
      linkUrl: banner.linkUrl,
      buttonText: banner.buttonText,
      buttonUrl: banner.buttonUrl,
      showButton: banner.showButton || false,
      position: banner.position,
      isActive: banner.isActive,
    },
  });
  return toPrismaBanner(newBanner);
}

// 배너 수정
export async function updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
  try {
    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: {
        ...(updates.type !== undefined && { type: updates.type }),
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.contentPosition !== undefined && {
          contentPosition: updates.contentPosition
            ? (toSnakeCase(updates.contentPosition) as 'top_left' | 'top_center' | 'top_right' | 'middle_left' | 'middle_center' | 'middle_right' | 'bottom_left' | 'bottom_center' | 'bottom_right')
            : null,
        }),
        ...(updates.titleColor !== undefined && { titleColor: updates.titleColor }),
        ...(updates.titleFontSize !== undefined && { titleFontSize: updates.titleFontSize }),
        ...(updates.descriptionColor !== undefined && {
          descriptionColor: updates.descriptionColor,
        }),
        ...(updates.descriptionFontSize !== undefined && { descriptionFontSize: updates.descriptionFontSize }),
        ...(updates.textColor !== undefined && { textColor: updates.textColor }),
        ...(updates.imageUrl !== undefined && { imageUrl: updates.imageUrl }),
        ...(updates.imagePosition !== undefined && { imagePosition: updates.imagePosition }),
        ...(updates.imageX !== undefined && { imageX: updates.imageX }),
        ...(updates.imageY !== undefined && { imageY: updates.imageY }),
        ...(updates.imageScale !== undefined && { imageScale: updates.imageScale }),
        ...(updates.linkUrl !== undefined && { linkUrl: updates.linkUrl }),
        ...(updates.buttonText !== undefined && { buttonText: updates.buttonText }),
        ...(updates.buttonUrl !== undefined && { buttonUrl: updates.buttonUrl }),
        ...(updates.showButton !== undefined && { showButton: updates.showButton }),
        ...(updates.position !== undefined && { position: updates.position }),
        ...(updates.isActive !== undefined && { isActive: updates.isActive }),
      },
    });
    return toPrismaBanner(updatedBanner);
  } catch {
    return null;
  }
}

// 배너 삭제
export async function deleteBanner(id: string): Promise<boolean> {
  try {
    await prisma.banner.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// 관리자 목록 조회
export async function getAdminUsers(): Promise<AdminUser[]> {
  const users = await prisma.adminUser.findMany();
  return users.map(toPrismaAdminUser);
}

/**
 * 관리자 계정 초기화 (최초 1회)
 * 환경변수 기반 username/password로 생성
 */
export async function initializeDefaultAdmin(): Promise<void> {
  const usersCount = await prisma.adminUser.count();

  // Only create if no users exist
  if (usersCount === 0) {
    const hashedPassword = await hashPassword(getEnv('ADMIN_PASSWORD'));
    await prisma.adminUser.create({
      data: {
        username: getEnv('ADMIN_USERNAME'),
        password: hashedPassword,
        role: 'admin',
      },
    });
  }
}

/**
 * 관리자 로그인: username+password 검증
 */
export async function findAdminUser(
  username: string,
  password: string
): Promise<AdminUser | null> {
  const user = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await comparePassword(password, user.password);
  return isPasswordValid ? toPrismaAdminUser(user) : null;
}

/**
 * 관리자 ID로 조회
 */
export async function findAdminUserById(id: string): Promise<AdminUser | null> {
  const user = await prisma.adminUser.findUnique({
    where: { id },
  });

  return user ? toPrismaAdminUser(user) : null;
}

/**
 * 관리자 비밀번호 변경
 */
export async function changeAdminPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.adminUser.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error('Error changing password:', error);
    return { success: false, error: 'Failed to change password' };
  }
}
