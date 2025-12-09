# 이쁜우렁이 - 전체 기술 가이드

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [개발 환경 설정](#개발-환경-설정)
4. [아키텍처](#아키텍처)
5. [개발 워크플로우](#개발-워크플로우)
6. [코딩 표준](#코딩-표준)
7. [데이터베이스](#데이터베이스)
8. [API 설계](#api-설계)
9. [인증 및 보안](#인증-및-보안)
10. [파일 업로드](#파일-업로드)
11. [스타일링](#스타일링)
12. [성능 최적화](#성능-최적화)
13. [테스팅](#테스팅)
14. [배포](#배포)
15. [문제 해결](#문제-해결)

---

## 구현 세부사항 (리포지토리 스캔 기반 요약)

아래 섹션은 현재 저장소 파일을 기반으로 자동으로 수집한 구현 세부사항입니다. 배포/운영 또는 다른 개발자가 빠르게 이해할 수 있도록 주요 환경변수, 인증 흐름, 파일 업로드 동작, API 엔드포인트 등을 정리했습니다.

## 프로젝트 개요

### 소개

이쁜우렁이는 전통적인 우렁이 농장 사업을 위한 현대적인 웹사이트입니다. 3대에 걸친 가업을 계승하며 프리미엄 우렁이 제품을 선보입니다.

### 주요 기능

- **제품 카탈로그**: 우렁이 제품 소개 및 상세 정보
- **품질관리**: HACCP 인증 및 품질 관리 프로세스 소개
- **관리자 대시보드**: 제품, 배너, 콘텐츠 관리
- **반응형 디자인**: 모바일/태블릿/데스크톱 최적화

### 기술적 특징

- Server-Side Rendering (SSR)
- 파일 기반 데이터베이스 (개발) / Prisma ORM (프로덕션)
- JWT 기반 인증
- 이미지 최적화
- SCSS 모듈 기반 스타일링

---

## 기술 스택

### Frontend

| 기술         | 버전   | 용도                          |
| ------------ | ------ | ----------------------------- |
| Next.js      | 15.5.3 | React 프레임워크 (App Router) |
| React        | 19.0.0 | UI 라이브러리                 |
| TypeScript   | Latest | 타입 안정성                   |
| SCSS         | Latest | 스타일링                      |
| Noto Sans KR | -      | 한글 폰트                     |

### Backend

| 기술               | 버전   | 용도                    |
| ------------------ | ------ | ----------------------- |
| Next.js API Routes | 15.5.3 | RESTful API             |
| Prisma             | Latest | ORM                     |
| PostgreSQL         | -      | 데이터베이스 (프로덕션) |
| bcrypt             | Latest | 비밀번호 해싱           |
| jose               | Latest | JWT 처리                |
| Zod                | Latest | 입력 검증               |

### DevOps

| 도구      | 용도         |
| --------- | ------------ |
| Turbopack | 빌드 도구    |
| ESLint    | 코드 품질    |
| Prettier  | 코드 포맷팅  |
| Git Hooks | 커밋 전 검증 |
| Vercel    | 배포 플랫폼  |

---

## 개발 환경 설정

### 필수 요구사항

- Node.js 18.17 이상
- npm 9.0 이상
- Git

### 초기 설정

#### 1. 저장소 클론

```bash
git clone https://github.com/mintscrew-bar/PrettySnail.git
cd PrettySnail
```

#### 2. 의존성 설치

```bash
npm install
```

#### 3. 환경 변수 설정

```bash
# .env.example을 .env.local로 복사
cp .env.example .env.local

# .env.local 파일 수정
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
DATABASE_URL=your-database-url  # 프로덕션용
```

**중요**: 프로덕션 환경에서는 반드시 안전한 값으로 변경!

#### 4. Git Hooks 설치

```bash
# Windows
scripts\install-hooks.cmd

# Linux/Mac
./scripts/install-hooks.sh
```

#### 5. 데이터베이스 초기화 (개발)

```bash
# 파일 기반 DB 사용 (개발 환경)
npm run dev  # 자동으로 data/ 폴더에 JSON 파일 생성
```

#### 6. 데이터베이스 초기화 (프로덕션)

```bash
# Prisma 마이그레이션
npm run db:generate
npm run db:push

# 초기 데이터 입력
npm run db:seed
```

#### 7. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 아키텍처

### 시스템 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                    클라이언트                         │
│              (브라우저 - React 19)                    │
└─────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────┐
│               Next.js 15 App Router                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ Pages (SSR)  │  │ API Routes   │  │ Middleware│  │
│  │ - Home       │  │ - /products  │  │ - Auth   │  │
│  │ - Products   │  │ - /auth      │  │          │  │
│  │ - Quality    │  │ - /upload    │  │          │  │
│  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────┐
│                  데이터 레이어                        │
│  ┌──────────────────────┐  ┌────────────────────┐  │
│  │   Prisma ORM         │  │  File-based DB     │  │
│  │   (프로덕션)          │  │  (개발)             │  │
│  └──────────────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────┐
│              PostgreSQL / JSON Files                 │
└─────────────────────────────────────────────────────┘
```

### 폴더 구조 아키텍처

**계층별 책임**:

```
src/app/                    → Presentation Layer (UI + Routing)
  ├── page.tsx              → React 컴포넌트 (UI)
  ├── layout.tsx            → 레이아웃 컴포넌트
  └── api/                  → API 엔드포인트
      └── route.ts          → RESTful API 핸들러

src/components/             → Reusable UI Components
  └── Header.tsx            → 재사용 가능한 컴포넌트

src/lib/                    → Business Logic Layer
  ├── db.ts                 → 데이터베이스 로직
  ├── auth.ts               → 인증 로직
  └── validation.ts         → 비즈니스 규칙

src/types/                  → Type Definitions
  └── index.ts              → TypeScript 타입

prisma/                     → Data Layer
  └── schema.prisma         → 데이터 모델
```

---

## 개발 워크플로우

### 일반적인 개발 흐름

```
1. 이슈/작업 확인
   ↓
2. 새 브랜치 생성 (feature/*, fix/*)
   ↓
3. 코드 작성
   ↓
4. 로컬 테스트
   ↓
5. Lint & Format 검사
   ↓
6. 커밋 (Git Hooks 자동 실행)
   ↓
7. 푸시
   ↓
8. Pull Request 생성
   ↓
9. 리뷰 & 머지
   ↓
10. 배포 (자동)
```

### Git 브랜치 전략

```
master (main)              → 프로덕션 브랜치
  ├── develop              → 개발 통합 브랜치 (선택사항)
  ├── feature/new-feature  → 새 기능
  ├── fix/bug-name         → 버그 수정
  └── chore/task           → 유지보수 작업
```

### 커밋 메시지 규칙

```
<타입>: <제목>

<본문> (선택사항)

<푸터> (선택사항)
```

**타입**:

- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드/도구 변경

**예시**:

```
feat: add product image gallery

- Added thumbnail carousel
- Implemented image zoom feature
- Mobile responsive layout

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 코딩 표준

### TypeScript

#### 타입 정의

```typescript
// ✅ 좋은 예
interface Product {
  id: string;
  name: string;
  category: string;
  tags?: Tag[];
}

// ❌ 나쁜 예
const product: any = { ... };
```

#### 함수 시그니처

```typescript
// ✅ 좋은 예
async function getProduct(id: string): Promise<Product | null> {
  // ...
}

// ❌ 나쁜 예
async function getProduct(id) {
  // ...
}
```

### React/Next.js

#### 컴포넌트 구조

```typescript
// ✅ 좋은 예
'use client';  // 클라이언트 컴포넌트인 경우

import { useState } from 'react';
import styles from './Component.module.scss';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export default function Component({ title, onAction }: ComponentProps) {
  const [state, setState] = useState<string>('');

  return (
    <div className={styles.container}>
      {/* ... */}
    </div>
  );
}
```

#### API 라우트

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { ErrorCode } from "@/lib/errorCodes";

export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    logger.error("API error", ErrorCode.API001, { error });
    return NextResponse.json(
      { error: "Internal server error", errorCode: ErrorCode.API001 },
      { status: 500 }
    );
  }
}
```

### SCSS

#### 모듈 사용

```scss
// Component.module.scss

// 변수 정의
$primary-color: #547416;
$spacing-md: 1rem;

// 클래스 정의
.container {
  padding: $spacing-md;

  .title {
    color: $primary-color;
    font-size: 1.5rem;
  }

  // 모바일
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
}
```

#### BEM 네이밍 (선택사항)

```scss
.productCard {
  // Block
  &__image {
    // Element
    width: 100%;
  }

  &__title {
    // Element
    font-size: 1.2rem;

    &--featured {
      // Modifier
      color: red;
    }
  }
}
```

---

## 데이터베이스

### Prisma 스키마

```prisma
// prisma/schema.prisma

model Product {
  id           String   @id @default(cuid())
  category     String
  name         String
  tags         Json?
  description  String
  badge        String?
  thumbnails   String[]
  detailImages String[]
  imageUrl     String?
  storeUrl     String?
  featured     Boolean  @default(false)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([category])
  @@index([featured])
}
```

### 데이터베이스 작업

#### 마이그레이션

```bash
# 스키마 변경 후
npx prisma migrate dev --name add_new_field

# 프로덕션 적용
npx prisma migrate deploy
```

#### 데이터 조회 (Prisma)

```typescript
import { prisma } from "@/lib/prisma";

// 단일 조회
const product = await prisma.product.findUnique({
  where: { id: productId },
});

// 목록 조회
const products = await prisma.product.findMany({
  where: { isActive: true },
  orderBy: { createdAt: "desc" },
});

// 생성
const newProduct = await prisma.product.create({
  data: {
    name: "제품명",
    category: "카테고리",
    // ...
  },
});
```

---

## API 설계

### RESTful 엔드포인트

| Method | Endpoint            | 설명           | 인증 |
| ------ | ------------------- | -------------- | ---- |
| GET    | `/api/products`     | 제품 목록 조회 | ❌   |
| GET    | `/api/products/:id` | 제품 상세 조회 | ❌   |
| POST   | `/api/products`     | 제품 생성      | ✅   |
| PUT    | `/api/products/:id` | 제품 수정      | ✅   |
| DELETE | `/api/products/:id` | 제품 삭제      | ✅   |
| POST   | `/api/auth/login`   | 로그인         | ❌   |
| POST   | `/api/upload`       | 파일 업로드    | ✅   |

### 에러 응답 형식

```typescript
{
  "error": "Invalid input",
  "errorCode": "VALID001",
  "message": "Name is required",
  "details": {
    "field": "name"
  },
  "timestamp": "2025-12-05T10:30:00.000Z"
}
```

### 에러 코드 체계

| 코드         | 카테고리     | 설명             |
| ------------ | ------------ | ---------------- |
| AUTH001-006  | 인증         | 인증 관련 에러   |
| FILE001-005  | 파일         | 파일 업로드 에러 |
| VALID001-003 | 검증         | 입력 검증 에러   |
| DB001-005    | 데이터베이스 | DB 작업 에러     |
| PROD001-004  | 제품         | 제품 관련 에러   |

---

## 인증 및 보안

### JWT 인증 흐름

```
1. 사용자 로그인 → POST /api/auth/login
2. 서버가 JWT 토큰 발급
3. 클라이언트가 토큰을 localStorage에 저장
4. 이후 요청에 Authorization 헤더 포함
5. 서버가 토큰 검증
```

### 비밀번호 보안

```typescript
import bcrypt from "bcrypt";

// 해싱 (회원가입)
const hashedPassword = await bcrypt.hash(password, 10);

// 검증 (로그인)
const isValid = await bcrypt.compare(password, hashedPassword);
```

### API 보호

```typescript
// src/lib/auth.ts
import { withAuth } from "@/lib/auth";

export const POST = withAuth(async (request: NextRequest) => {
  // 인증된 사용자만 접근 가능
  const userId = request.userId; // withAuth가 주입
  // ...
});
```

---

## 파일 업로드

### 파일 검증

```typescript
// Magic number 검증 (파일 시그니처)
const allowedTypes = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
};

// 파일 크기 제한
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
```

### 업로드 플로우

```
1. 클라이언트가 파일 선택
2. FormData로 전송
3. 서버가 파일 타입/크기 검증
4. public/uploads/에 저장
5. 파일 경로 반환
```

---

## 스타일링

### SCSS 변수

```scss
// globals.scss
$primary: #547416;
$secondary: #e63946;
$neutral-100: #f5f5f5;
$neutral-900: #1a1a1a;

$space-sm: 0.5rem;
$space-md: 1rem;
$space-lg: 1.5rem;
$space-xl: 2rem;

$breakpoint-sm: 480px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
```

### 반응형 디자인

```scss
// 모바일 우선 접근
.container {
  padding: $space-sm;

  @media (min-width: $breakpoint-md) {
    padding: $space-lg;
  }

  @media (min-width: $breakpoint-lg) {
    padding: $space-xl;
  }
}
```

---

## 성능 최적화

### 이미지 최적화

```tsx
import Image from "next/image";

<Image
  src="/products/snail.jpg"
  alt="우렁이"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
  priority={false} // LCP 이미지만 true
/>;
```

### 코드 스플리팅

```tsx
import dynamic from "next/dynamic";

// 동적 임포트
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
  ssr: false, // 클라이언트에서만 로드
});
```

### 캐싱 전략

```typescript
// Next.js fetch 캐싱
const data = await fetch("https://api.example.com/data", {
  next: { revalidate: 3600 }, // 1시간 캐시
});
```

---

## 테스팅

### 단위 테스트 (TODO)

```typescript
// __tests__/lib/validation.test.ts
import { productSchema } from "@/lib/validation";

describe("Product Validation", () => {
  it("should validate valid product data", () => {
    const data = {
      name: "우렁이",
      category: "제품",
      description: "설명",
    };

    expect(() => productSchema.parse(data)).not.toThrow();
  });
});
```

### E2E 테스트 (TODO)

```typescript
// e2e/products.spec.ts
test("should display product list", async ({ page }) => {
  await page.goto("/products");
  await expect(page.locator(".productCard")).toHaveCount(4);
});
```

---

## 배포

### Vercel 배포

#### 1. Vercel 프로젝트 생성

```bash
vercel login
vercel
```

#### 2. 환경 변수 설정

Vercel Dashboard에서 설정:

- `NEXT_PUBLIC_BASE_URL`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `DATABASE_URL`

#### 3. 자동 배포

- `master` 브랜치에 푸시하면 자동 배포
- PR 생성 시 프리뷰 배포

### 수동 배포

```bash
# 빌드
npm run build

# 프로덕션 시작
npm start
```

---

## 문제 해결

### 일반적인 문제

#### 1. 빌드 실패

```bash
# 캐시 삭제
rm -rf .next node_modules
npm install
npm run build
```

#### 2. 타입 에러

```bash
# TypeScript 체크
npx tsc --noEmit
```

#### 3. 로그 확인

```
# 로그 파일 위치
logs/error.log
logs/access.log
logs/debug.log

# 또는 관리자 대시보드
/admin/logs
```

#### 4. 데이터베이스 문제

```bash
# Prisma 재생성
npm run db:generate

# 마이그레이션 재실행
npx prisma migrate reset
```

---

## 참고 자료

### 공식 문서

- [Next.js 문서](https://nextjs.org/docs)
- [React 문서](https://react.dev)
- [Prisma 문서](https://www.prisma.io/docs)
- [TypeScript 문서](https://www.typescriptlang.org/docs)

### 프로젝트 문서

- [README](../README.md)
- [프로젝트 구조](../PROJECT_STRUCTURE.md)
- [배포 가이드](../DEPLOYMENT.md)
- [모바일 최적화 가이드](./MOBILE_OPTIMIZATION_GUIDE.md)

---

**작성일**: 2025-12-05
**버전**: 1.0
**작성자**: Claude Code
