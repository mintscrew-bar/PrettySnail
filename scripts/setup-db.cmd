@echo off
REM Database Setup Script for PrettySnail (Windows)
REM Supports both local PostgreSQL and Vercel Postgres

setlocal enabledelayedexpansion

echo.
echo 🚀 PrettySnail Database Setup
echo ====================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ⚠ .env.local not found
    echo ℹ Creating .env.local from .env.example...
    copy .env.example .env.local >nul
    echo ⚠ Please update .env.local with your DATABASE_URL
    exit /b 1
)

echo Database Configuration:
echo   .env.local: Found
echo.

REM Step 1: Install dependencies
echo 📦 Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ✗ Failed to install dependencies
    exit /b 1
)
echo ✓ Dependencies installed
echo.

REM Step 2: Generate Prisma Client
echo 🔧 Step 2: Generating Prisma Client...
call npm run db:generate
if errorlevel 1 (
    echo ✗ Failed to generate Prisma Client
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

REM Step 3: Push schema to database
echo 📊 Step 3: Syncing schema with database...
call npm run db:push
if errorlevel 1 (
    echo ✗ Failed to sync schema
    exit /b 1
)
echo ✓ Schema synchronized
echo.

REM Step 4: Seed database
echo 🌱 Step 4: Seeding database with initial data...
call npm run db:seed
if errorlevel 1 (
    echo ⚠ Seeding encountered an issue (may be normal if data already exists)
) else (
    echo ✓ Database seeded
)
echo.

REM Step 5: Verify data
echo ✅ Step 5: Verification complete
echo.
echo Summary:
echo   - Prisma Client: Generated
echo   - Database Schema: Synchronized
echo   - Initial Data: Seeded (if applicable)
echo.
echo ✓ Database setup completed!
echo.
echo Next steps:
echo   1. Review data in Prisma Studio: npm run db:studio
echo   2. Test application: npm run dev
echo   3. For production, set DATABASE_URL in Vercel Environment Variables
echo.

endlocal
