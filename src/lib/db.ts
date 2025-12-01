import fs from 'fs';
import path from 'path';
import { Product, Banner, AdminUser } from '@/types';
import { hashPassword, comparePassword } from './password';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const BANNERS_FILE = path.join(DATA_DIR, 'banners.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Ensure file exists with default data
function ensureFile(filePath: string, defaultData: unknown) {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
}

// Products
export function getProducts(): Product[] {
  ensureFile(PRODUCTS_FILE, []);
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function saveProducts(products: Product[]): void {
  ensureDataDir();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

export function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updates,
    id: products[index].id,
    createdAt: products[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

// Banners
export function getBanners(): Banner[] {
  ensureFile(BANNERS_FILE, []);
  const data = fs.readFileSync(BANNERS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function saveBanners(banners: Banner[]): void {
  ensureDataDir();
  fs.writeFileSync(BANNERS_FILE, JSON.stringify(banners, null, 2));
}

export function addBanner(banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Banner {
  const banners = getBanners();
  const newBanner: Banner = {
    ...banner,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  banners.push(newBanner);
  saveBanners(banners);
  return newBanner;
}

export function updateBanner(id: string, updates: Partial<Banner>): Banner | null {
  const banners = getBanners();
  const index = banners.findIndex(b => b.id === id);
  if (index === -1) return null;

  banners[index] = {
    ...banners[index],
    ...updates,
    id: banners[index].id,
    createdAt: banners[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  saveBanners(banners);
  return banners[index];
}

export function deleteBanner(id: string): boolean {
  const banners = getBanners();
  const filtered = banners.filter(b => b.id !== id);
  if (filtered.length === banners.length) return false;
  saveBanners(filtered);
  return true;
}

// Admin Users
export function getAdminUsers(): AdminUser[] {
  const defaultUsers: AdminUser[] = [];
  ensureFile(USERS_FILE, defaultUsers);
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

/**
 * Initialize default admin user with hashed password
 * This should be run once during setup
 */
export async function initializeDefaultAdmin(): Promise<void> {
  const users = getAdminUsers();

  // Only create if no users exist
  if (users.length === 0) {
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123');
    const defaultAdmin: AdminUser = {
      id: '1',
      username: process.env.ADMIN_USERNAME || 'admin',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    users.push(defaultAdmin);
    ensureDataDir();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }
}

/**
 * Find admin user by username and verify password
 */
export async function findAdminUser(username: string, password: string): Promise<AdminUser | null> {
  const users = getAdminUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return null;
  }

  const isPasswordValid = await comparePassword(password, user.password);
  return isPasswordValid ? user : null;
}
