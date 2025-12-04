import { Product, Banner, AdminUser, ContentPosition } from '@/types';
import { hashPassword, comparePassword } from './password';
import prisma from './prisma';
import { getEnv } from './env';

// Helper to convert snake_case to kebab-case for ContentPosition
function toKebabCase(str: string | null): ContentPosition | undefined {
  if (!str) return undefined;
  return str.replace(/_/g, '-') as ContentPosition;
}

// Helper to convert kebab-case to snake_case for ContentPosition
function toSnakeCase(str: string | undefined): string | undefined {
  if (!str) return undefined;
  return str.replace(/-/g, '_');
}

// Helper to convert Prisma Product to API Product
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

// Helper to convert Prisma Banner to API Banner
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

// Helper to convert Prisma AdminUser to API AdminUser
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

// Products
export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return products.map(toPrismaProduct);
}

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

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// Banners
export async function getBanners(): Promise<Banner[]> {
  const banners = await prisma.banner.findMany({
    orderBy: { position: 'asc' },
  });
  return banners.map(toPrismaBanner);
}

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

export async function deleteBanner(id: string): Promise<boolean> {
  try {
    await prisma.banner.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// Admin Users
export async function getAdminUsers(): Promise<AdminUser[]> {
  const users = await prisma.adminUser.findMany();
  return users.map(toPrismaAdminUser);
}

/**
 * Initialize default admin user with hashed password
 * This should be run once during setup
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
 * Find admin user by username and verify password
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
 * Find admin user by ID
 */
export async function findAdminUserById(id: string): Promise<AdminUser | null> {
  const user = await prisma.adminUser.findUnique({
    where: { id },
  });

  return user ? toPrismaAdminUser(user) : null;
}

/**
 * Change admin user password
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
