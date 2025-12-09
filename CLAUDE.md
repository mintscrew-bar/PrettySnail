# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**이쁜우렁이 (Pretty Snail)** is a Korean snail farm business website built with Next.js 15, featuring a modern, animated user interface for a traditional snail farming company. The site showcases the company's 3-generation heritage and premium snail products.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production (runs Prisma generate first)
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without changing files

### Testing Commands
- `npm run test` - Run tests in watch mode (Vitest)
- `npm run test:ui` - Run tests with UI dashboard
- `npm run test:run` - Run tests once without watch mode
- `npm run test:coverage` - Generate test coverage report

### Database Commands
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database (no migration)
- `npm run db:migrate` - Create and run migration (dev)
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with initial data

### Development Server
The project uses Next.js with Turbopack for faster development builds. The dev server runs on http://localhost:3000.

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Prisma ORM with PostgreSQL
- **Styling**: SCSS modules with global styles
- **Fonts**: Noto Sans KR from Google Fonts (Korean optimized)
- **Build Tool**: Turbopack
- **Security**: bcrypt (password hashing), jose (JWT authentication)
- **Validation**: Zod (schema validation)
- **Testing**: Vitest with React Testing Library
- **Code Quality**: ESLint, Prettier
- **UI Libraries**: react-hot-toast (notifications), jsPDF (PDF generation)

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Korean metadata & SEO
│   ├── page.tsx           # Homepage with hero, products, values
│   ├── globals.scss       # Global SCSS styles
│   ├── sitemap.ts         # XML sitemap for SEO
│   ├── robots.ts          # robots.txt configuration
│   ├── global-error.tsx   # Global error boundary
│   ├── admin/             # Admin dashboard pages
│   │   ├── login/         # Admin login page
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── products/      # Product management
│   │   ├── banners/       # Banner management
│   │   ├── logs/          # Log viewer
│   │   └── settings/      # Admin settings
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication APIs (login, change-password)
│   │   ├── products/      # Product CRUD APIs (with validation)
│   │   ├── banners/       # Banner CRUD APIs (with validation)
│   │   ├── upload/        # File upload API (authenticated)
│   │   └── logs/          # Log management API
│   ├── products/          # Product pages
│   ├── story/             # Brand story page
│   ├── quality/           # Quality management page
│   └── contact/           # Contact page
├── components/            # Reusable React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── AdminLayout.tsx    # Admin page layout wrapper
│   ├── ErrorBoundary.tsx  # Error boundary component
│   ├── ToastProvider.tsx  # Toast notification provider
│   └── *.module.scss      # Component-specific styles
├── lib/                   # Utility libraries
│   ├── prisma.ts         # Prisma client singleton
│   ├── db.ts             # Database operations (Prisma wrapper)
│   ├── password.ts       # Password hashing utilities (bcrypt)
│   ├── jwt.ts            # JWT token generation & verification
│   ├── auth.ts           # API authentication middleware
│   ├── validation.ts     # Zod validation schemas
│   ├── errorCodes.ts     # Systematic error code definitions
│   ├── logger.ts         # Centralized logging system
│   ├── rateLimit.ts      # Rate limiting utilities
│   ├── csrf.ts           # CSRF protection
│   ├── apiClient.ts      # Client-side API wrapper
│   ├── apiHelpers.ts     # API utility functions
│   ├── typeGuards.ts     # TypeScript type guards
│   ├── tagHelpers.ts     # Tag manipulation utilities
│   ├── toast.ts          # Toast notification helpers
│   └── __tests__/        # Unit tests
├── constants/             # Application constants
├── types/                 # TypeScript type definitions
│   └── index.ts          # Product, Banner, AdminUser types
└── styles/               # Global styling resources
    ├── design-system.scss # Design system tokens
    ├── design-mixins.scss # Reusable SCSS mixins
    ├── mixins.scss        # Utility mixins
    └── variables.scss     # SCSS variables
```

Other important directories:
```
prisma/                    # Prisma ORM configuration
├── schema.prisma         # Database schema (Product, Banner, AdminUser)
└── migrations/           # Database migration history

data/                      # Legacy directory (not used by current code)
├── .gitkeep              # Keep directory in git
└── *.json                # May contain old JSON files (unused)

logs/                      # Application logs
├── error.log             # Error and warning logs
├── access.log            # Info logs (API access)
└── debug.log             # Debug logs (dev only)

scripts/                   # Utility scripts
├── seed.ts               # Database seeding script
├── install-hooks.sh      # Git hooks installer (Unix)
└── install-hooks.cmd     # Git hooks installer (Windows)

docs/                      # Technical documentation
```

### Key Architectural Patterns

**Database Layer (`src/lib/db.ts`)**:
- All database operations use Prisma ORM (PostgreSQL)
- Abstraction layer with helper functions for CRUD operations
- Automatic data format conversion between Prisma and API types
- Helper functions for kebab-case/snake_case conversion (ContentPosition enum)
- Requires `DATABASE_URL` environment variable to be set

**API Authentication Flow**:
1. User logs in via `/api/auth/login` → receives JWT token
2. Token stored in HTTP-only cookie via `src/lib/cookies.ts`
3. Protected API routes use `withAuth` middleware from `src/lib/auth.ts`
4. JWT verification handled by `src/lib/jwt.ts` using jose library

**Error Handling System**:
- Centralized error codes in `src/lib/errorCodes.ts` (format: `[CATEGORY][NUMBER]`)
- All API errors return standardized format: `{ error, errorCode, message, details, timestamp }`
- Comprehensive logging via `src/lib/logger.ts` to `logs/` directory
- Categories: AUTH, FILE, VALID, DB, API, PROD, BANNER

**Client-Side API Calls**:
- Use `src/lib/apiClient.ts` for consistent error handling and token management
- Toast notifications via `react-hot-toast` (wrapper in `src/lib/toast.ts`)
- Type-safe API responses using TypeScript type guards (`src/lib/typeGuards.ts`)

**File Upload Security**:
- File type verification using magic numbers (file signatures)
- Max size: 20MB (configurable)
- Allowed formats: jpg, jpeg, png, gif, webp
- Authenticated uploads only (admin users)

**Styling System**:
- SCSS modules for component isolation (`.module.scss`)
- Global design system in `src/styles/design-system.scss`
- Reusable mixins in `src/styles/design-mixins.scss` and `src/styles/mixins.scss`
- Mobile-first responsive design with breakpoint mixins

## Code Patterns

### TypeScript Configuration
- Path aliases: `@/*` maps to `./src/*`
- Strict mode enabled (target: ES2017)
- Type definitions in `src/types/index.ts`

### Data Models (Prisma Schema)
The database schema includes three main models:

1. **Product**:
   - Fields: category, name, tags (array), description, badge, thumbnails (array), detailImages (array), imageUrl, storeUrl, featured, isActive
   - Indexes on: category, featured, isActive

2. **Banner**:
   - Fields: type (main/promotion), title, description, contentPosition, colors, imageUrl, imagePosition/X/Y/Scale, linkUrl, buttonText/Url, showButton, position, isActive
   - Indexes on: type, position, isActive

3. **AdminUser**:
   - Fields: username (unique), password (hashed), role (admin/editor)
   - Index on: username

### API Route Patterns
All API routes follow this structure:
```typescript
// 1. Import dependencies
import { withAuth } from '@/lib/auth';
import { ErrorCode, createErrorResponse } from '@/lib/errorCodes';
import { logger } from '@/lib/logger';
import { db } from '@/lib/db';

// 2. Protected endpoints use withAuth wrapper
export const GET = withAuth(async (request, { userId }) => {
  try {
    // 3. Perform operation
    const data = await db.getProducts();

    // 4. Log success
    logger.info('Products fetched', { userId, count: data.length });

    // 5. Return data
    return Response.json({ data });
  } catch (error) {
    // 6. Log error with error code
    logger.error('Failed to fetch products', ErrorCode.PROD001, { error }, { userId });

    // 7. Return standardized error response
    return Response.json(
      createErrorResponse(ErrorCode.PROD001),
      { status: 500 }
    );
  }
});
```

### Validation Pattern
Use Zod schemas from `src/lib/validation.ts`:
```typescript
import { ProductSchema } from '@/lib/validation';

const validatedData = ProductSchema.parse(requestData);
```

### Testing Patterns
- Tests located in `src/lib/__tests__/`
- Use Vitest with React Testing Library
- Run with `npm run test` or `npm run test:ui`
- Coverage reports generated with `npm run test:coverage`

### Korean Language Support
- Site language set to Korean (`lang="ko"`)
- All user-facing content in Korean
- Error messages in Korean (see `ErrorMessages` in `errorCodes.ts`)
- SEO optimized with Korean metadata

## Security

### Authentication & Authorization
- **Password Security**: All passwords are hashed using bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based authentication (7-day expiry)
- **API Protection**: Admin-only endpoints protected with `withAuth` middleware
- **Input Validation**: All API inputs validated using Zod schemas

### API Security
- All POST/PUT/DELETE operations require authentication
- File uploads are authenticated and validated:
  - File type verification using magic numbers (file signatures)
  - Maximum file size: 20MB
  - Allowed formats: jpg, jpeg, png, gif, webp
- Detailed error logging for debugging
- Security headers configured in `next.config.ts`

### Environment Variables
Required environment variables (see `.env.example` for development, `.env.production.example` for production):
```env
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# JWT Authentication (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key

# Admin Account (REQUIRED)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Database (REQUIRED - Prisma)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DATABASE_SHADOW_URL=postgresql://user:pass@host:5432/shadow_db  # Optional, for migrations

# Vercel Blob (Optional, for file storage)
BLOB_READ_WRITE_TOKEN=vercel_blob_token
```

**⚠️ IMPORTANT**:
- `DATABASE_URL` is **REQUIRED** - application will not start without it
- Change `JWT_SECRET` and `ADMIN_PASSWORD` in production!
- Generate a strong JWT secret: `openssl rand -base64 32`
- Copy `.env.example` to `.env.local` for local development

## Data Management

### Database Architecture
The project uses **Prisma ORM with PostgreSQL** exclusively via `src/lib/db.ts`:

**Prisma + PostgreSQL**:
- Database: PostgreSQL via Prisma ORM
- Schema defined in `prisma/schema.prisma`
- Migrations in `prisma/migrations/`
- Client auto-generated via `npm run db:generate`
- **Requires `DATABASE_URL` environment variable** (no fallback)

**Database Operations**:
All CRUD operations go through `src/lib/db.ts` which:
- Provides abstraction layer over Prisma client
- Converts between Prisma types and API types
- Handles enum format conversions (snake_case ↔ kebab-case)
- Auto-initializes admin user on first run

**Initial Setup**:
1. Set `DATABASE_URL` in `.env.local` (e.g., `postgresql://user:pass@localhost:5432/prettysnail`)
2. Run `npm run db:push` to create tables (or `npm run db:migrate` for production)
3. Run `npm run db:seed` to populate initial data
4. View/edit data with `npm run db:studio` (opens Prisma Studio GUI)

**Note**: The `data/` directory may exist for legacy purposes but is **not used** by the current codebase.

### File Storage
- **Development**: Files stored in `public/uploads/` (temporary)
- **Production**: Use Vercel Blob or cloud storage (recommended)
- Upload API: `/api/upload` (authenticated)

### Admin Panel
- Login: `/admin/login` (default: admin/admin123)
- Dashboard: `/admin/dashboard`
- Product Management: `/admin/products`
- Banner Management: `/admin/banners`
- Log Viewer: `/admin/logs`
- Settings: `/admin/settings` (password change)

## SEO & Performance

### SEO Optimizations
- Open Graph and Twitter Card meta tags
- XML sitemap at `/sitemap.xml`
- robots.txt configuration
- Korean language optimization
- Structured metadata for all pages

### Performance
- Image optimization with WebP/AVIF support
- Responsive image sizes: 640, 750, 828, 1080, 1200, 1920, 2048, 3840
- React Strict Mode enabled
- Turbopack for faster builds
- Security headers for enhanced protection (X-Frame-Options, X-Content-Type-Options, etc.)
- `poweredByHeader` disabled to remove X-Powered-By header

## Error Tracking & Debugging

### Error Code System
The application uses a systematic error code system for better debugging and tracking:

**Error Code Format**: `[CATEGORY][NUMBER]`

**Categories**:
- `AUTH` - Authentication errors (AUTH001-006)
- `FILE` - File upload errors (FILE001-005)
- `VALID` - Validation errors (VALID001-003)
- `DB` - Database errors (DB001-005)
- `API` - General API errors (API001-003)
- `PROD` - Product-related errors (PROD001-004)
- `BANNER` - Banner-related errors (BANNER001-004)

**Error Code Definitions**: See `src/lib/errorCodes.ts` for complete list

**API Error Response Format**:
```json
{
  "error": "Human-readable error message",
  "errorCode": "AUTH001",
  "message": "Additional details (optional)",
  "details": {},
  "timestamp": "2025-12-01T..."
}
```

### Logging System

**Log Files Location**: `logs/` directory
- `error.log` - Error and warning logs
- `access.log` - Info logs (API access, successful operations)
- `debug.log` - Debug logs (development only)

**Log Entry Format**:
```json
{
  "timestamp": "2025-12-01T10:30:00.000Z",
  "level": "ERROR",
  "message": "Authentication failed: Invalid token",
  "errorCode": "AUTH003",
  "details": {},
  "userId": "1",
  "ip": "127.0.0.1",
  "endpoint": "/api/products"
}
```

**Viewing Logs**:
1. **Console** - Development environment shows colored logs in terminal
2. **Log Files** - Check `logs/` directory for persistent logs
3. **Admin Dashboard** - Navigate to `/admin/logs` for web-based log viewer
   - View error, access, or debug logs
   - Filter by log type and limit
   - Clean old logs (30+ days)

**Using the Logger**:
```typescript
import { logger } from '@/lib/logger';
import { ErrorCode } from '@/lib/errorCodes';

// Info log
logger.info('User logged in successfully', { userId: '123' });

// Warning log
logger.warn('Deprecated API called', { endpoint: '/old-api' });

// Error log
logger.error(
  'Database operation failed',
  ErrorCode.DB001,
  { operation: 'save', table: 'products' },
  { userId: '123', ip: '127.0.0.1', endpoint: '/api/products' }
);

// Debug log (dev only)
logger.debug('Cache hit', { key: 'products-list' });
```

**Log Management**:
- Logs are automatically created in `logs/` directory
- Use `/admin/logs` to view recent logs
- Use DELETE `/api/logs?days=30` to clean logs older than 30 days
- Logs persist across server restarts

## Deployment

### Vercel Deployment
See `DEPLOYMENT.md` for complete deployment guide. Key points:

1. **Environment Variables**: Set in Vercel dashboard (all REQUIRED)
   - `DATABASE_URL` - PostgreSQL connection string (required, no fallback)
   - `JWT_SECRET` - Generate with `openssl rand -base64 32`
   - `ADMIN_USERNAME` - Admin username
   - `ADMIN_PASSWORD` - Admin password (change from default!)
   - `BLOB_READ_WRITE_TOKEN` - Optional, if using Vercel Blob for file storage

2. **Build Configuration**:
   - Build command: `npm run build` (includes Prisma generate)
   - Output directory: `.next`
   - Node version: 20.x or higher

3. **Database Migration**:
   - Prisma migrations run automatically in build
   - Seed database with `npm run db:seed`

4. **File Storage**:
   - Vercel filesystem is read-only
   - Must use Vercel Blob or external storage for uploads

### Git Hooks
Install local git hooks to prevent Windows reserved filenames:
```bash
# Windows (cmd.exe)
scripts\install-hooks.cmd

# macOS / Linux
scripts/install-hooks.sh
```

## Troubleshooting

### Common Issues
1. **Prisma errors**: Run `npm run db:generate` to regenerate client
2. **Database connection fails**: Verify `DATABASE_URL` format and network access
3. **Login fails**: Check JWT_SECRET is set; verify admin user exists in database
4. **File upload fails**: Ensure upload directory exists with write permissions (or use Vercel Blob)
5. **Build errors**: Run `npm run lint:fix` and `npm run format` to fix code quality issues
6. **Tests failing**: Run `npm run db:generate` first, then `npm run test`
7. **TypeScript errors**: Check `@/*` path alias is configured in `tsconfig.json`

### Debugging Tips
1. **Check error codes**: All API errors include an error code (format: `[CATEGORY][NUMBER]`)
2. **Review logs**: Check `/admin/logs` (web UI) or `logs/` directory (files)
3. **Console output**: Development mode shows colored logs in terminal
4. **Network tab**: Use browser DevTools to inspect API responses with error codes
5. **Prisma debugging**: Set `DEBUG="prisma:*"` environment variable
6. **Database inspection**: Use `npm run db:studio` to view/edit data directly

### Performance Issues
1. **Slow page loads**: Check image sizes and formats (use WebP/AVIF)
2. **Slow API responses**: Check database indexes (see `prisma/schema.prisma`)
3. **Build time too long**: Ensure Turbopack is enabled in `next.config.ts`

### Useful Documents
- `PROJECT_STRUCTURE.md` - Detailed directory structure
- `DEPLOYMENT.md` - Complete deployment guide
- `docs/MOBILE_OPTIMIZATION_GUIDE.md` - Mobile optimization techniques
- `docs/TECHNICAL_GUIDE.md` - Technical implementation details
- `docs/README.md` - Documentation index
