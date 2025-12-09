# 배포 가이드 (Vercel)

이쁜우렁이 웹사이트를 Vercel에 배포하는 방법을 안내합니다.

## 사전 준비

### 1. GitHub 계정 및 레포지토리

1. [GitHub](https://github.com)에 가입 (무료)
2. 새 레포지토리 생성:
   - Repository name: `prettysnail` (또는 원하는 이름)
   - Private 또는 Public 선택
   - **README 추가 안함** (이미 있음)

### 2. Vercel 계정

1. [Vercel](https://vercel.com)에 가입 (무료)
2. GitHub 계정으로 로그인 권장

## 배포 단계

### Step 1: GitHub에 코드 업로드

현재 프로젝트 폴더에서 다음 명령어 실행:

```bash
# Git 저장소 초기화 (이미 되어있음)
git status

# GitHub 레포지토리 연결 (GitHub에서 생성한 레포지토리 URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/prettysnail.git

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial deployment"

# GitHub에 푸시
git push -u origin master
```

> **중요**: `YOUR_USERNAME`을 실제 GitHub 사용자명으로 변경하세요!

### Step 2: Vercel에서 프로젝트 임포트

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. "Add New Project" 클릭
3. "Import Git Repository" 선택
4. GitHub 레포지토리에서 `prettysnail` 선택
5. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)

### Step 3: 로컬 빌드, Prisma 마이그레이션 및 환경 변수 설정

배포 전에 로컬에서 빌드/마이그레이션/시드 과정을 먼저 확인하세요. Vercel에 환경 변수를 설정하면 런타임에서 사용됩니다.

로컬에서 기본 검증 명령 (예시):

```bash
# 의존성 설치
npm install

# 타입 체크 + 린트(옵션)
npm run build
npm run lint

# Prisma 마이그레이션 (프로덕션 DB에 적용 전 반드시 검토)
npx prisma migrate deploy

# 시드(프로젝트에 시드 스크립트가 있는 경우)
node scripts/seed.ts
```

Vercel 프로젝트 설정에서 다음 환경 변수를 추가하세요:

#### 권장 환경 변수

```env
# 배포된 도메인 URL (Vercel이 자동 제공)
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app

# JWT 비밀키 (강력한 랜덤 문자열 생성 필요!)
JWT_SECRET=생성한_강력한_비밀키

# 관리자 계정 정보 (초기 로그인용 — 배포 후 변경 권장)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=안전한_비밀번호

# 데이터베이스 (Postgres 권장)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# (옵션) 마이그레이션이나 로컬 쉐도우 DB가 필요한 경우
DATABASE_SHADOW_URL=postgresql://user:pass@host:5432/shadow_db
```

※ 민감한 값은 `.env`에 직접 두지 말고 Vercel 환경 변수로 관리하세요.

#### JWT_SECRET 생성 방법

**옵션 1: 온라인 생성기 사용**

- https://generate-secret.vercel.app/32

**옵션 2: 로컬에서 생성 (Git Bash 또는 WSL)**

```bash
openssl rand -base64 32
```

**옵션 3: Node.js로 생성**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: 배포 확인

1. "Deploy" 버튼 클릭
2. 배포 완료까지 2-3분 대기
3. 배포 완료 후 제공된 URL 확인:
   - 예: `https://prettysnail.vercel.app`
   - 또는 커스텀 도메인 설정 가능

## 배포 후 설정

### 1. 관리자 초기 설정

배포 후 처음 한 번 관리자 로그인 시도:

1. `https://your-project.vercel.app/admin/login` 접속
2. 환경 변수에 설정한 `ADMIN_USERNAME`과 `ADMIN_PASSWORD`로 로그인
3. 로그인 성공 시 `data/users.json` 자동 생성됨
4. 꼭 설정에서 비밀번호 재설정할 것

### 2. 데이터 디렉토리 주의사항

⚠️ **중요**: Vercel은 **읽기 전용 파일 시스템**입니다!

현재 프로젝트는 파일 기반 데이터베이스(`data/*.json`)를 사용하는데, Vercel에서는 다음과 같은 제약이 있습니다:

- 배포 시 포함된 파일은 읽기 가능
- **런타임에 파일 생성/수정 불가능**
- 재배포 시 모든 데이터 초기화됨

#### 해결 방법

**즉시 사용 가능한 방법:**

1. 로컬에서 `data/` 폴더에 초기 데이터 파일 생성
2. GitHub에 커밋 (`.gitignore`에서 `data/*.json` 제거 필요)
3. 재배포

**장기적 해결책:**

1. **Vercel Postgres** 사용 (Vercel 제공, 무료 티어 있음)
2. **Supabase** 사용 (무료 PostgreSQL 데이터베이스)
3. **MongoDB Atlas** 사용 (무료 클라우드 MongoDB)

### 3. 파일 업로드 설정

Vercel의 `/tmp` 디렉토리는 임시 저장소입니다:

- 업로드된 파일은 **일시적으로만 저장됨**
- 서버 재시작 시 모든 파일 삭제됨

**해결 방법:**

1. **Vercel Blob Storage** 사용 (추천)
2. **Cloudinary** 또는 **AWS S3** 사용
3. **Uploadthing** 사용

## 커스텀 도메인 설정 (선택사항)

1. Vercel Dashboard → 프로젝트 선택
2. "Settings" → "Domains" 이동
3. 보유한 도메인 입력 (예: `prettysnail.com`)
4. DNS 설정 안내에 따라 도메인 제공업체에서 설정

## 자동 배포

GitHub에 코드를 푸시하면 자동으로 Vercel에 배포됩니다:

```bash
# 코드 수정 후
git add .
git commit -m "Update something"
git push

# Vercel이 자동으로 새 버전 배포 (약 2-3분 소요)
```

## 배포 상태 확인

- Vercel Dashboard에서 실시간 배포 로그 확인
- 빌드 실패 시 상세한 에러 메시지 제공
- 배포 히스토리 및 롤백 기능 제공

## 문제 해결

### 배포는 성공했지만 페이지가 로드되지 않음

- Vercel Dashboard → Functions 탭에서 에러 로그 확인
- 환경 변수가 올바르게 설정되었는지 확인

### 관리자 로그인 실패

- `JWT_SECRET` 환경 변수 확인
- `ADMIN_USERNAME`, `ADMIN_PASSWORD` 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 이미지가 표시되지 않음

- `public/assets/` 폴더가 GitHub에 커밋되었는지 확인
- 이미지 경로가 올바른지 확인 (`/assets/` 로 시작)

## 비용

- **Vercel Hobby 플랜**: 무료
  - 대역폭: 100GB/월
  - 빌드 시간: 6000분/월
  - 개인 프로젝트에 충분

- **초과 시**: Pro 플랜으로 자동 업그레이드 권장 ($20/월)

## 다음 단계

배포 후 권장사항:

1. ✅ 커스텀 도메인 설정
2. ✅ 데이터베이스 마이그레이션 (PostgreSQL/MongoDB)
3. ✅ 이미지 스토리지 설정 (Vercel Blob/Cloudinary)
4. ✅ 분석 도구 추가 (Google Analytics)
5. ✅ 성능 모니터링 (Vercel Analytics)

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 환경 변수](https://vercel.com/docs/concepts/projects/environment-variables)
