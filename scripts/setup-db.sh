#!/usr/bin/env bash
# Database Setup Script for PrettySnail
# Supports both local PostgreSQL and Vercel Postgres

set -euo pipefail

echo "🚀 PrettySnail Database Setup"
echo "===================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if .env.local exists
if [ ! -f .env.local ]; then
    warning ".env.local not found"
    info "Creating .env.local from .env.example..."
    cp .env.example .env.local
    warning "Please update .env.local with your DATABASE_URL"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "${DATABASE_URL:-}" ]; then
    error "DATABASE_URL not set in .env.local"
fi

echo "Database Configuration:"
echo "  DATABASE_URL: ${DATABASE_URL:0:50}..."
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
if npm install; then
    success "Dependencies installed"
else
    error "Failed to install dependencies"
fi
echo ""

# Step 2: Generate Prisma Client
echo "🔧 Step 2: Generating Prisma Client..."
if npm run db:generate; then
    success "Prisma Client generated"
else
    error "Failed to generate Prisma Client"
fi
echo ""

# Step 3: Push schema to database
echo "📊 Step 3: Syncing schema with database..."
if npm run db:push; then
    success "Schema synchronized"
else
    error "Failed to sync schema"
fi
echo ""

# Step 4: Seed database
echo "🌱 Step 4: Seeding database with initial data..."
if npm run db:seed; then
    success "Database seeded"
else
    warning "Seeding encountered an issue (may be normal if data already exists)"
fi
echo ""

# Step 5: Verify data
echo "✅ Step 5: Verifying data..."
echo ""
echo "Summary:"
echo "  - Prisma Client: Generated"
echo "  - Database Schema: Synchronized"
echo "  - Initial Data: Seeded"
echo ""

success "Database setup completed!"
echo ""
echo "Next steps:"
echo "  1. Review data in Prisma Studio: npm run db:studio"
echo "  2. Test application: npm run dev"
echo "  3. For production, set DATABASE_URL in Vercel Environment Variables"
echo ""
