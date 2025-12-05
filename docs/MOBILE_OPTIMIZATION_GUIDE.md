# Mobile Optimization & Minimalist Design Guide

## 개요
이 문서는 Next.js 15 + SCSS 프로젝트에서 모바일 최적화와 미니멀 디자인을 구현한 과정을 정리한 기술 가이드입니다.

## 목차
1. [태그 및 배지 레이아웃 최적화](#태그-및-배지-레이아웃-최적화)
2. [모바일 반응형 그리드 시스템](#모바일-반응형-그리드-시스템)
3. [캐러셀 모바일 최적화](#캐러셀-모바일-최적화)
4. [미니멀 디자인 원칙](#미니멀-디자인-원칙)
5. [일반적인 문제와 해결책](#일반적인-문제와-해결책)

---

## 태그 및 배지 레이아웃 최적화

### 문제: 태그/배지가 너무 길게 표시됨

**원인**: 블록 레벨 요소 또는 width 설정 문제

**해결 방법**:
```scss
.tag {
  display: inline-flex;        // 인라인 플렉스로 콘텐츠 크기에 맞춤
  align-items: center;
  white-space: nowrap;         // 줄바꿈 방지
  max-width: fit-content;      // 콘텐츠에 맞는 너비
  padding: 0.25rem 0.6rem;     // 일관된 패딩
}
```

**HTML 요소 선택**:
```tsx
// ❌ 나쁜 예: div는 기본적으로 블록 레벨
<div className={styles.badge}>{badge}</div>

// ✅ 좋은 예: span은 인라인 레벨
<span className={styles.badge}>{badge}</span>
```

### 배지를 이미지 위에 오버레이

**방법**:
```scss
.mainImage {
  position: relative;  // 부모를 relative로
}

.badge {
  position: absolute;  // 절대 위치
  top: 0.75rem;
  right: 0.75rem;
  z-index: 2;          // 이미지 위에 표시
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);  // 가독성 향상
}
```

---

## 모바일 반응형 그리드 시스템

### 2열 그리드 유지 (데스크톱 + 모바일)

**기본 구조**:
```scss
// 데스크톱
.certGridTwo {
  max-width: 700px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}

// 모바일 (768px 이하)
@media (max-width: 768px) {
  .certGridTwo {
    grid-template-columns: repeat(2, 1fr);  // 2열 유지
    gap: 1.5rem;                             // 간격 축소
  }
}
```

### 제품 카드 그리드 (반응형 열 수)

```scss
.productsGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);  // 데스크톱: 4열
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);  // 태블릿: 3열
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);  // 모바일: 2열
    gap: 1rem;
  }
}
```

---

## 캐러셀 모바일 최적화

### 무한 스크롤 캐러셀을 정적 그리드로 변환

**문제**: 모바일에서 무한 스크롤 캐러셀이 비효율적이고 복제된 항목이 표시됨

**해결 방법**:

#### 1. 데스크톱: 무한 스크롤 캐러셀
```scss
.processFlow {
  overflow: hidden;
  position: relative;

  // 그라디언트 오버레이
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100px;
    z-index: 2;
    pointer-events: none;
  }
}

.processTrack {
  display: flex;
  gap: $space-xl;
  animation: scroll 25s linear infinite;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

#### 2. 모바일: 2열 그리드
```scss
@media (max-width: 768px) {
  .processFlow {
    overflow: visible;  // 오버플로우 해제

    &::before,
    &::after {
      display: none;    // 그라디언트 숨김
    }
  }

  .processTrack {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    animation: none;    // 애니메이션 비활성화
    gap: $space-md;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .processStep {
    width: 100%;
    max-width: none;

    // 복제된 항목 숨기기 (6번째 이후)
    &:nth-child(n + 6) {
      display: none;
    }
  }
}
```

#### 3. HTML 구조
```tsx
<div className={styles.processTrack}>
  {/* 원본 항목 (1-5) */}
  {processSteps.map((step, index) => (
    <ProcessCard key={index} {...step} />
  ))}

  {/* 무한 스크롤용 복제 항목 (6-10) - 모바일에서 CSS로 숨김 */}
  {processSteps.map((step, index) => (
    <ProcessCard key={`copy-${index}`} {...step} />
  ))}
</div>
```

---

## 미니멀 디자인 원칙

### 1. 콘텐츠 간소화

**변경 전**:
```tsx
<div className={styles.sectionHeader}>
  <h2>인증 현황</h2>
  <p>공신력 있는 기관으로부터 받은 각종 인증서</p>
</div>

<div className={styles.certCard}>
  <div className={styles.certIcon}>📜</div>
  <h3>HACCP 인증</h3>
  <p>위해요소중점관리기준</p>
  <span className={styles.certDate}>2025년 취득</span>
  <div className={styles.certBadge}>유효</div>
</div>
```

**변경 후**:
```tsx
<div className={styles.sectionHeader}>
  <h2>인증 현황</h2>
  <p>안전하고 깨끗한 우렁이 생산을 위한 인증</p>
</div>

<div className={styles.certCard}>
  <div className={styles.certIcon}>📜</div>
  <h3>HACCP 인증</h3>
  <p>위해요소중점관리기준</p>
</div>
```

**원칙**:
- 날짜, 상태 등 부가 정보 제거
- 핵심 메시지만 유지
- 설명은 간결하고 구체적으로

### 2. 일관된 간격

```scss
// 모바일 간격 체계
$space-sm: 0.5rem;   // 8px
$space-md: 1rem;     // 16px
$space-lg: 1.5rem;   // 24px
$space-xl: 2rem;     // 32px

@media (max-width: 768px) {
  .section {
    padding: $space-lg $space-md;  // 일관된 간격 사용
  }
}
```

### 3. 폰트 크기 축소

```scss
// 데스크톱
.productName {
  font-size: clamp(1.5rem, 4vw, 2.75rem);
}

// 모바일
@media (max-width: 480px) {
  .productName {
    font-size: 1.5rem;  // 고정 크기로 명확하게
  }
}
```

---

## 일반적인 문제와 해결책

### 1. 요소 너비 문제

**증상**: 요소가 화면 너비를 넘어감

**해결**:
```scss
.element {
  max-width: 100%;
  overflow-x: hidden;
}
```

### 2. 그리드 아이템 크기 불일치

**증상**: 그리드 아이템이 균등하지 않음

**해결**:
```scss
.gridItem {
  width: 100%;           // 그리드 셀에 맞춤
  max-width: none;       // 최대 너비 제한 제거
}
```

### 3. Flexbox vs Grid 선택

**Flexbox 사용**:
- 1차원 레이아웃 (가로 또는 세로)
- 콘텐츠 크기에 따라 유연하게 배치
- 예: 태그 목록, 네비게이션

```scss
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

**Grid 사용**:
- 2차원 레이아웃 (가로 + 세로)
- 균등한 크기의 아이템
- 예: 제품 카드, 인증서 카드

```scss
.productGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
```

### 4. 모바일 우선 vs 데스크톱 우선

**권장: 모바일 우선 (Mobile First)**

```scss
// ✅ 좋은 예: 모바일 우선
.container {
  padding: 1rem;  // 모바일 기본값

  @media (min-width: 768px) {
    padding: 2rem;  // 데스크톱 확장
  }
}

// ❌ 나쁜 예: 데스크톱 우선
.container {
  padding: 2rem;  // 데스크톱 기본값

  @media (max-width: 768px) {
    padding: 1rem;  // 모바일 축소
  }
}
```

---

## 브레이크포인트 가이드

```scss
// 권장 브레이크포인트
$breakpoint-sm: 480px;   // 스마트폰
$breakpoint-md: 768px;   // 태블릿
$breakpoint-lg: 1024px;  // 작은 데스크톱
$breakpoint-xl: 1280px;  // 큰 데스크톱

// 사용 예
@media (max-width: $breakpoint-sm) {
  // 스마트폰 스타일
}

@media (max-width: $breakpoint-md) {
  // 태블릿 이하 스타일
}
```

---

## 성능 최적화 팁

### 1. CSS 애니메이션 최적화

```scss
// 모바일에서 애니메이션 비활성화
@media (max-width: 768px) {
  .animated {
    animation: none;
    transform: none;
  }
}
```

### 2. 이미지 최적화

```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="설명"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"  // 반응형 크기
/>
```

### 3. 불필요한 DOM 요소 제거

```scss
// CSS로 숨기기보다 조건부 렌더링
@media (max-width: 768px) {
  .desktopOnly {
    display: none;  // DOM에는 존재
  }
}
```

```tsx
// ✅ 더 나은 방법
{!isMobile && <DesktopComponent />}
```

---

## 체크리스트

프로젝트에 모바일 최적화를 적용할 때 확인할 사항:

- [ ] 모든 태그/배지가 `inline-flex`와 `fit-content` 사용
- [ ] 그리드 레이아웃이 모바일에서 적절한 열 수로 조정
- [ ] 캐러셀이 모바일에서 정적 레이아웃으로 변환
- [ ] 불필요한 콘텐츠가 제거되었는지 확인
- [ ] 폰트 크기가 모바일에서 읽기 쉬운지 확인
- [ ] 간격이 일관되고 적절한지 확인
- [ ] 모바일에서 애니메이션이 비활성화되었는지 확인
- [ ] 이미지가 반응형으로 로드되는지 확인
- [ ] 터치 타겟이 충분히 큰지 확인 (최소 44x44px)
- [ ] 실제 모바일 디바이스에서 테스트

---

## 참고 자료

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Mobile First Design](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)

---

## 결론

이 가이드에서 다룬 최적화 기법들은:
- **사용자 경험 향상**: 모바일에서 더 빠르고 깔끔한 UI
- **유지보수성**: 일관된 패턴으로 코드 가독성 향상
- **성능**: 불필요한 요소와 애니메이션 제거로 성능 개선

비슷한 프로젝트에서 이 가이드를 참고하여 더 나은 모바일 경험을 만들 수 있습니다.
