# 프로젝트 구조

이쁜우렁이 프로젝트의 폴더 및 파일 구조 설명입니다.

## 📁 루트 디렉토리

```
prettysnail/
├── src/                    # 소스 코드
├── public/                 # 정적 파일 (이미지, 아이콘 등)
├── docs/                   # 기술 문서
├── scripts/                # 유틸리티 스크립트
├── data/                   # 파일 기반 데이터베이스 (개발용)
├── logs/                   # 애플리케이션 로그
├── prisma/                 # Prisma 스키마 및 마이그레이션
├── .github/                # GitHub 설정 (워크플로우 등)
├── .claude/                # Claude Code 설정
└── [설정 파일들]
```

---

## 📂 주요 디렉토리 설명

### `src/` - 소스 코드
애플리케이션의 핵심 코드가 위치합니다.

```
src/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 홈페이지
│   ├── globals.scss        # 전역 스타일
│   ├── admin/              # 관리자 페이지
│   ├── api/                # API 라우트
│   ├── products/           # 제품 페이지
│   ├── quality/            # 품질관리 페이지
│   ├── story/              # 브랜드 스토리
│   └── contact/            # 문의 페이지
├── components/             # 재사용 가능한 컴포넌트
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                    # 유틸리티 라이브러리
│   ├── db.ts              # 데이터베이스 연결
│   ├── auth.ts            # 인증 미들웨어
│   ├── jwt.ts             # JWT 처리
│   └── validation.ts      # 입력 검증
├── types/                  # TypeScript 타입 정의
│   └── index.ts
└── styles/                 # 공통 스타일
```

### `public/` - 정적 파일
브라우저에서 직접 접근 가능한 파일들입니다.

```
public/
├── assets/                 # 이미지, 아이콘 등
│   ├── 원물.jpg
│   ├── 탈각 전.jpg
│   └── ...
└── uploads/                # 사용자 업로드 파일 (관리자)
    └── .gitkeep
```

### `docs/` - 기술 문서
프로젝트 관련 기술 문서 모음입니다.

```
docs/
├── README.md                           # 문서 목록
└── MOBILE_OPTIMIZATION_GUIDE.md        # 모바일 최적화 가이드
```

### `scripts/` - 유틸리티 스크립트
개발 및 배포 관련 스크립트입니다.

```
scripts/
├── README.md                   # 스크립트 설명
├── seed.ts                     # DB 초기 데이터
├── install-hooks.sh            # Git hooks 설치 (Linux/Mac)
├── install-hooks.cmd           # Git hooks 설치 (Windows)
└── add-credentials-to-fetch.js # Fetch 헬퍼
```

### `prisma/` - Prisma ORM
데이터베이스 스키마 및 마이그레이션 파일입니다.

```
prisma/
├── schema.prisma              # 데이터베이스 스키마
└── migrations/                # 마이그레이션 히스토리
```

### `data/` - 파일 기반 데이터베이스
개발 환경에서 사용하는 JSON 데이터베이스입니다.

```
data/
├── products.json              # 제품 데이터
├── banners.json               # 배너 데이터
├── users.json                 # 사용자 데이터
└── .gitkeep
```

⚠️ **주의**: 프로덕션에서는 PostgreSQL/MySQL 사용 권장

### `logs/` - 애플리케이션 로그
런타임 로그 파일들입니다.

```
logs/
├── error.log                  # 에러 로그
├── access.log                 # 접근 로그
└── debug.log                  # 디버그 로그
```

---

## 📄 주요 설정 파일

### 프로젝트 설정
- `package.json` - 프로젝트 의존성 및 스크립트
- `tsconfig.json` - TypeScript 설정
- `next.config.ts` - Next.js 설정
- `eslint.config.mjs` - ESLint 규칙
- `.prettierrc` - Prettier 포맷팅 규칙

### 환경 설정
- `.env.local` - 로컬 개발 환경 변수
- `.env.example` - 환경 변수 예시 (개발)
- `.env.production.example` - 환경 변수 예시 (프로덕션)

### Git 설정
- `.gitignore` - Git 제외 파일
- `.gitattributes` - Git 속성
- `.githooks/` - Git hooks 스크립트

### 배포 설정
- `vercel.json` - Vercel 배포 설정
- `prisma.config.ts` - Prisma 설정

---

## 📝 문서 파일

### 루트 디렉토리 문서
- `README.md` - 프로젝트 개요 및 시작 가이드
- `CLAUDE.md` - Claude Code 프로젝트 가이드
- `DEPLOYMENT.md` - 배포 가이드
- `PROJECT_STRUCTURE.md` - 이 파일 (프로젝트 구조 설명)

### docs/ 디렉토리 문서
- `MOBILE_OPTIMIZATION_GUIDE.md` - 모바일 최적화 기술 가이드

---

## 🚫 제외된 파일/폴더 (.gitignore)

다음 파일들은 Git에서 추적하지 않습니다:

- `node_modules/` - NPM 패키지
- `.next/` - Next.js 빌드 파일
- `*.log` - 로그 파일
- `.env*` - 환경 변수 (예시 파일 제외)
- `*.tsbuildinfo` - TypeScript 빌드 캐시
- `data/*.json` - 데이터베이스 파일
- `public/uploads/*` - 업로드된 파일
- `.idea/` - JetBrains IDE 설정
- `.vscode/*` - VS Code 설정 (일부 제외)

---

## 🏗️ 아키텍처 개요

### 프론트엔드
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: SCSS Modules
- **Fonts**: Noto Sans KR

### 백엔드
- **API**: Next.js API Routes
- **Database**: Prisma (PostgreSQL 권장)
- **Authentication**: JWT + bcrypt
- **Validation**: Zod

### 개발 도구
- **Build**: Turbopack
- **Linting**: ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky

---

## 📦 의존성 관리

### 주요 패키지
- `next@15.5.3` - Next.js 프레임워크
- `react@19.0.0` - React 라이브러리
- `@prisma/client` - Prisma ORM 클라이언트
- `bcrypt` - 비밀번호 해싱
- `jose` - JWT 처리
- `zod` - 스키마 검증

### 개발 의존성
- `typescript` - TypeScript 컴파일러
- `sass` - SCSS 컴파일러
- `eslint` - 코드 품질 도구
- `prettier` - 코드 포맷팅 도구

---

## 🔍 파일 찾기 가이드

### "어디에 파일을 만들어야 하나요?"

| 작업 | 위치 | 예시 |
|------|------|------|
| 새 페이지 추가 | `src/app/[페이지명]/` | `src/app/about/page.tsx` |
| 새 API 엔드포인트 | `src/app/api/[경로]/` | `src/app/api/users/route.ts` |
| 재사용 컴포넌트 | `src/components/` | `src/components/Card.tsx` |
| 유틸리티 함수 | `src/lib/` | `src/lib/formatDate.ts` |
| 타입 정의 | `src/types/` | `src/types/user.ts` |
| 스타일 (전역) | `src/styles/` | `src/styles/mixins.scss` |
| 스타일 (컴포넌트) | 컴포넌트와 같은 폴더 | `page.module.scss` |
| 정적 이미지 | `public/assets/` | `public/assets/logo.png` |
| 기술 문서 | `docs/` | `docs/API_GUIDE.md` |
| 스크립트 | `scripts/` | `scripts/migrate.ts` |

---

## 🎯 베스트 프랙티스

### 1. 파일 명명 규칙
- 컴포넌트: PascalCase (`Header.tsx`)
- 유틸리티: camelCase (`formatDate.ts`)
- 스타일: kebab-case + .module (`page.module.scss`)
- 설정: 소문자 + 점 (`.prettierrc`)

### 2. 폴더 구조
- 기능별로 그룹화 (`src/app/products/`)
- 관련 파일을 같은 폴더에 (`page.tsx` + `page.module.scss`)

### 3. Import 경로
- 절대 경로 사용: `@/components/Header`
- 상대 경로 최소화

### 4. 스타일
- SCSS Modules 우선 사용
- 전역 스타일은 `globals.scss`에만

---

## 📚 추가 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [TypeScript 문서](https://www.typescriptlang.org/docs)
- [프로젝트 README](./README.md)
- [배포 가이드](./DEPLOYMENT.md)

---

**업데이트**: 2025-12-05
**버전**: 1.0
