import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface JsonProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  featured?: boolean;
  badge?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  thumbnails?: string[];
  detailImages?: string[];
  storeUrl?: string;
}

interface JsonBanner {
  id: string;
  type: 'main' | 'promotion';
  title?: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  showButton?: boolean;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  imageX?: number;
  imageY?: number;
  imageScale?: number;
  contentPosition?: string;
  titleColor?: string;
  descriptionColor?: string;
  textColor?: string;
  imagePosition?: string;
}

interface JsonUser {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'editor';
  createdAt: string;
}

// Helper function to convert kebab-case to snake_case for enum values
function toSnakeCase(str: string): string {
  return str.replace(/-/g, '_');
}

async function main() {
  console.log('Starting database seeding...');

  // Read JSON files
  const dataDir = path.join(process.cwd(), 'data');
  const productsJson = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'products.json'), 'utf-8')
  ) as JsonProduct[];
  const bannersJson = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'banners.json'), 'utf-8')
  ) as JsonBanner[];
  const usersJson = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'users.json'), 'utf-8')
  ) as JsonUser[];

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.product.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.adminUser.deleteMany();

  // Seed Products
  console.log(`Seeding ${productsJson.length} products...`);
  for (const product of productsJson) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        imageUrl: product.imageUrl,
        isActive: product.isActive,
        featured: product.featured || false,
        badge: product.badge,
        tags: product.tags || [],
        thumbnails: product.thumbnails || [],
        detailImages: product.detailImages || [],
        storeUrl: product.storeUrl,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      },
    });
  }
  console.log('Products seeded successfully!');

  // Seed Banners
  console.log(`Seeding ${bannersJson.length} banners...`);
  for (const banner of bannersJson) {
    await prisma.banner.create({
      data: {
        id: banner.id,
        type: banner.type,
        title: banner.title,
        description: banner.description,
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl,
        buttonText: banner.buttonText,
        buttonUrl: banner.buttonUrl,
        showButton: banner.showButton || false,
        position: banner.position,
        isActive: banner.isActive,
        imageX: banner.imageX,
        imageY: banner.imageY,
        imageScale: banner.imageScale,
        contentPosition: banner.contentPosition
          ? (toSnakeCase(banner.contentPosition) as
              | 'top_left'
              | 'top_center'
              | 'top_right'
              | 'middle_left'
              | 'middle_center'
              | 'middle_right'
              | 'bottom_left'
              | 'bottom_center'
              | 'bottom_right')
          : null,
        titleColor: banner.titleColor,
        descriptionColor: banner.descriptionColor,
        textColor: banner.textColor,
        imagePosition: banner.imagePosition,
        createdAt: new Date(banner.createdAt),
        updatedAt: new Date(banner.updatedAt),
      },
    });
  }
  console.log('Banners seeded successfully!');

  // Seed Admin Users
  console.log(`Seeding ${usersJson.length} admin users...`);
  for (const user of usersJson) {
    await prisma.adminUser.create({
      data: {
        id: user.id,
        username: user.username,
        password: user.password,
        role: user.role,
        createdAt: new Date(user.createdAt),
      },
    });
  }
  console.log('Admin users seeded successfully!');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
