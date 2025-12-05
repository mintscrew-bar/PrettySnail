# Scripts

프로젝트 유틸리티 스크립트 모음입니다.

## 스크립트 목록

### Database

#### seed.ts
데이터베이스 초기 데이터를 생성하는 스크립트입니다.

**사용법**:
```bash
npm run db:seed
```

**기능**:
- 관리자 계정 생성
- 샘플 제품 데이터 추가
- 샘플 배너 데이터 추가

### Git Hooks

#### install-hooks.sh / install-hooks.cmd
Git hooks를 설치하는 스크립트입니다.

**사용법**:
```bash
# Linux/Mac
./scripts/install-hooks.sh

# Windows
scripts\install-hooks.cmd
```

**설치되는 Hooks**:
- `pre-commit`: 커밋 전 코드 품질 검사
- `pre-push`: 푸시 전 테스트 실행

### Development

#### add-credentials-to-fetch.js
Fetch 요청에 인증 정보를 추가하는 헬퍼 스크립트입니다.

**사용 예**:
```javascript
const { authenticatedFetch } = require('./scripts/add-credentials-to-fetch');

// 인증이 필요한 API 호출
const response = await authenticatedFetch('/api/admin/products');
```

## 새 스크립트 추가하기

새로운 스크립트를 추가할 때는:

1. 적절한 카테고리 폴더에 배치
2. 실행 권한 설정 (필요시)
3. 이 README에 문서화
4. package.json에 npm 스크립트 추가 (필요시)

### 예시

```json
// package.json
{
  "scripts": {
    "my-script": "node scripts/my-script.js"
  }
}
```
