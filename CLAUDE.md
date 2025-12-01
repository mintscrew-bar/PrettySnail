# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**이쁜우렁이 (Pretty Snail)** is a Korean snail farm business website built with Next.js 15, featuring a modern, animated user interface for a traditional snail farming company. The site showcases the company's 3-generation heritage and premium snail products.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without changing files

### Development Server
The project uses Next.js with Turbopack for faster development builds. The dev server runs on http://localhost:3000.

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: SCSS modules with global styles
- **Fonts**: Noto Sans KR from Google Fonts (Korean optimized)
- **Build Tool**: Turbopack (Next.js experimental)
- **Security**: bcrypt (password hashing), jose (JWT authentication)
- **Validation**: Zod (schema validation)
- **Code Quality**: ESLint, Prettier

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Korean metadata & SEO
│   ├── page.tsx           # Homepage with hero, products, values
│   ├── sitemap.ts         # XML sitemap for SEO
│   ├── robots.ts          # robots.txt configuration
│   ├── globals.scss       # Global SCSS styles
│   ├── page.module.scss   # Homepage-specific styles
│   ├── admin/             # Admin dashboard pages
│   │   ├── login/         # Admin login page
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── products/      # Product management
│   │   └── banners/       # Banner management
│   ├── api/               # API routes
│   │   ├── auth/login/    # JWT authentication endpoint
│   │   ├── products/      # Product CRUD APIs (with validation)
│   │   ├── banners/       # Banner CRUD APIs (with validation)
│   │   └── upload/        # File upload API (authenticated)
│   ├── products/          # Product pages
│   ├── story/             # Brand story page
│   ├── quality/           # Quality management page
│   └── contact/           # Contact page
├── components/            # Reusable React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── FeatureCard.tsx    # Service cards for navigation
│   └── *.module.scss      # Component-specific styles
├── lib/                   # Utility libraries
│   ├── db.ts             # File-based database (JSON)
│   ├── password.ts       # Password hashing utilities (bcrypt)
│   ├── jwt.ts            # JWT token generation & verification
│   ├── auth.ts           # API authentication middleware
│   └── validation.ts     # Zod validation schemas
├── types/                 # TypeScript type definitions
│   └── index.ts          # Product, Banner, AdminUser types
└── styles/               # Additional styling resources
```

### Key Components Architecture

**Animation System**: The site features a comprehensive animation system with three main components:
- `ScrollAnimations`: Handles scroll-reveal effects and parallax
- `SnailAnimations`: Manages snail-themed visual effects
- `MouseFollower`: Creates interactive mouse-following elements

**Styling Architecture**: Uses SCSS modules for component isolation with global styles for shared animations and base styles.

**Content Structure**: Korean-language business site with sections for hero, brand values, product showcase, and navigation cards.

## Code Patterns

### Component Structure
- Components use TypeScript with explicit prop interfaces
- SCSS modules for styling (`.module.scss`)
- Accessibility features with ARIA labels and semantic HTML
- SEO-optimized with proper meta tags and Korean language setting

### Korean Language Support
- Site language set to Korean (`lang="ko"`)
- Korean metadata and content throughout
- Accessibility features in Korean language

### Development Practices
- Path aliases configured: `@/*` maps to `./src/*`
- ESLint with Next.js and TypeScript rules
- Prettier for consistent code formatting (semi: true, singleQuote: false, printWidth: 100)
- Strict TypeScript configuration (target: ES2017)
- Component-based architecture with reusable modules

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
  - Maximum file size: 10MB
  - Allowed formats: jpg, jpeg, png, gif, webp
- Detailed error logging for debugging
- Security headers configured in `next.config.ts`

### Environment Variables
Required environment variables (see `.env.example` for development, `.env.production.example` for production):
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**⚠️ IMPORTANT**:
- Change `JWT_SECRET` and `ADMIN_PASSWORD` in production!
- Generate a strong JWT secret: `openssl rand -base64 32`
- Copy `.env.example` to `.env.local` for local development

## Data Management

### File-Based Database
- Currently uses JSON files in `data/` directory
- Files: `products.json`, `banners.json`, `users.json`
- **Note**: Not suitable for high-traffic production. Consider migrating to PostgreSQL/MySQL.
- **Setup**: Ensure the `data/` directory exists; files are created automatically on first use
- Uploaded images are stored in `public/uploads/` directory

### Admin Panel
- Login: `/admin/login` (default: admin/admin123)
- Dashboard: `/admin/dashboard`
- Product Management: `/admin/products`
- Banner Management: `/admin/banners`

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

## Troubleshooting

### Common Issues
1. **Login fails**: Check if `data/users.json` exists and admin is initialized
2. **File upload fails**: Ensure `public/uploads/` directory exists with write permissions
3. **JWT errors**: Verify `JWT_SECRET` is set in `.env.local`
4. **Build errors**: Run `npm run lint:fix` and `npm run format` to fix code quality issues
5. **Dev server not starting**: Ensure port 3000 is available or specify a different port
6. **Logs not appearing**: Check if `logs/` directory exists with write permissions

### Debugging Tips
1. **Check error codes**: All API errors include an error code for quick identification
2. **Review logs**: Check `/admin/logs` or `logs/error.log` for detailed error information
3. **Console output**: Development mode shows colored logs in terminal
4. **Network tab**: Use browser DevTools Network tab to see API error responses with error codes
5. **Log context**: Error logs include user ID, IP, and endpoint for better context

### Useful Documents
- `PROJECT_ISSUES_AND_IMPROVEMENTS.md` - Detailed analysis and recommendations
- `SECURITY_IMPROVEMENTS_COMPLETED.md` - Security implementation guide
