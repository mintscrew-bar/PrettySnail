# Database Migration Guide: JSON → PostgreSQL

## 📋 개요

이 가이드는 현재 JSON 파일 기반의 데이터를 PostgreSQL 데이터베이스로 마이그레이션하는 과정을 설명합니다.

## 🏗️ 현재 데이터 구조

### 모델 (Prisma Schema)

**Product**
- `id`: 고유 식별자 (CUID)
- `category`: 상품 카테고리 (생물, 손질, 냉동 등)
- `name`: 상품명
- `tags`: 태그 배열
- `description`: 상세 설명 (Text)
- `badge`: 배지 (인기, 추천 등)
- `thumbnails`: 썸네일 이미지 URL 배열
- `detailImages`: 상세 이미지 URL 배열
- `imageUrl`: 메인 이미지 URL
- `storeUrl`: 구매 링크
- `featured`: 특성 상품 여부 (Boolean)
- `isActive`: 활성 상태 (Boolean)
- `createdAt`, `updatedAt`: 타임스탐프

**Banner**
- `id`: 고유 식별자 (CUID)
- `type`: 배너 타입 (main, promotion)
- `title`, `description`: 배너 텍스트
- `contentPosition`: 콘텐츠 위치 (enum: top_left, middle_center 등)
- `titleColor`, `descriptionColor`, `textColor`: 색상 설정
- `imageUrl`: 배너 이미지
- `imagePosition`: 이미지 위치
- `imageX`, `imageY`, `imageScale`: 이미지 좌표 및 스케일
- `linkUrl`, `buttonUrl`: 링크
- `buttonText`: 버튼 텍스트
- `showButton`: 버튼 표시 여부
- `position`: 배너 위치 (1, 2, 3 등)
- `isActive`: 활성 상태
- `createdAt`, `updatedAt`: 타임스탐프

**AdminUser**
- `id`: 고유 식별자 (CUID)
- `username`: 사용자명 (Unique)
- `password`: 해시된 암호 (bcrypt)
- `role`: 역할 (admin, editor)
- `createdAt`: 생성일

## 🔄 마이그레이션 단계

### Step 1: 로컬 PostgreSQL 설정 (개발 환경)

#### macOS/Linux
```bash
# PostgreSQL 설치 (Homebrew)
brew install postgresql@15

# 서비스 시작
brew services start postgresql@15

# 데이터베이스 생성
createdb prettysnail

# 연결 테스트
psql -d prettysnail
```

#### Windows
```powershell
# PostgreSQL 다운로드 및 설치
# https://www.postgresql.org/download/windows/

# 또는 Docker 사용 (권장)
docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=prettysnail -p 5432:5432 -d postgres:15

# 환경변수 설정
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prettysnail"
```

### Step 2: Vercel Postgres 설정 (프로덕션)

```bash
# Vercel 로그인
vercel login

# 프로젝트와 연결
vercel link

# 데이터베이스 생성
# Vercel Dashboard > Storage > Create Database > Postgres
# 연결하기 > 프로젝트 선택
# .env.local 탭에서 Prisma URL 복사
```

### Step 3: 환경변수 설정

#### 개발 환경 (.env.local)
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/prettysnail"
```

#### 프로덕션 (Vercel Dashboard)
```
Settings > Environment Variables > Add
DATABASE_URL = postgresql://...@vercel.sh:5432/...?sslmode=require
```

### Step 4: Prisma 마이그레이션

```bash
# 의존성 설치
npm install

# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 스키마 동기화
npm run db:push

# 또는 마이그레이션 생성 (마이그레이션 기록 필요 시)
npm run db:migrate
```

### Step 5: 데이터 임포트

```bash
# 기존 JSON 데이터를 PostgreSQL로 임포트
npm run db:seed
```

## 📊 데이터 변환 매핑

### JSON → PostgreSQL 타입 변환

| JSON 형식 | PostgreSQL 타입 | 주의사항 |
|-----------|-----------------|---------|
| String[] | TEXT[] | 배열로 저장 |
| Boolean | BOOLEAN | true/false |
| DateTime | TIMESTAMP | ISO 8601 형식 |
| Float | DOUBLE PRECISION | 좌표 값 |
| String (Enum) | ENUM | 사전 정의된 값만 허용 |

### 데이터 마이그레이션 예시

**Product**
```json
// JSON
{
  "id": "1",
  "name": "생우렁이",
  "category": "생물",
  "tags": ["신선", "무항생제"],
  "featured": true,
  "isActive": true
}

// PostgreSQL (Prisma)
Product.create({
  data: {
    id: "1",
    name: "생우렁이",
    category: "생물",
    tags: ["신선", "무항생제"],
    featured: true,
    isActive: true
  }
})
```

**Banner**
```json
// JSON
{
  "id": "1760428566466",
  "type": "main",
  "contentPosition": "middle-center",
  "imageX": 49.41550598325827,
  "imageY": 51.3333333333333
}

// PostgreSQL (Prisma)
Banner.create({
  data: {
    id: "1760428566466",
    type: "main",
    contentPosition: "middle_center",  // 언더스코어로 변환
    imageX: 49.41550598325827,
    imageY: 51.3333333333333
  }
})
```

## ⚠️ 주의사항

### 1. ID 생성 방식
- **현재**: 임의 ID 또는 타임스탐프 기반
- **PostgreSQL**: Prisma의 CUID 자동 생성 권장
- **마이그레이션**: 기존 ID는 유지하거나 새로 생성

### 2. Enum 변환
- **JSON**: `"contentPosition": "middle-center"`
- **PostgreSQL**: `"contentPosition": "middle_center"` (언더스코어)
- `scripts/seed.ts`에서 자동 변환됨

### 3. 타임스탐프 형식
- JSON의 ISO 8601 형식은 PostgreSQL TIMESTAMP와 호환
- Prisma의 `@updatedAt`는 자동으로 현재 시간으로 설정

### 4. 배열 타입
- PostgreSQL에서 배열은 TEXT[]로 저장
- Prisma에서 자동으로 JSON 직렬화/역직렬화

## 🔍 검증 체크리스트

마이그레이션 완료 후 확인 사항:

```
✓ 모든 Product 레코드가 데이터베이스에 존재
✓ 모든 Banner 레코드가 데이터베이스에 존재
✓ AdminUser 레코드 (암호는 해시 상태)
✓ `created_at`, `updated_at` 타임스탐프 올바름
✓ featured, isActive 등 Boolean 값 올바름
✓ 배열 필드(tags, thumbnails 등) 구조 유지
✓ Enum 필드 값이 올바른 형식 (언더스코어)
✓ 특수 문자나 한글 데이터 인코딩 정상
```

## 📝 검증 쿼리

```bash
# 모든 Product 개수
npx prisma db execute --stdin < <<EOF
SELECT COUNT(*) FROM "Product";
EOF

# 모든 Banner 개수
npx prisma db execute --stdin < <<EOF
SELECT COUNT(*) FROM "Banner";
EOF

# AdminUser 확인
npx prisma db execute --stdin < <<EOF
SELECT id, username, role FROM "AdminUser";
EOF

# Prisma Studio (GUI)
npm run db:studio
```

## 🚀 배포 후 단계

1. **백업 생성**: PostgreSQL 백업 설정
   ```bash
   # Vercel: 자동 백업 활성화
   ```

2. **모니터링**: 에러 로그 확인
   ```bash
   vercel logs
   ```

3. **롤백 계획**: 문제 발생 시 JSON 복구 가능하도록 보관

## 📚 참고 자료

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/15/datatype.html)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Database Seeding](https://www.prisma.io/docs/reference/api-reference/prisma-cli-reference#db-seed)
