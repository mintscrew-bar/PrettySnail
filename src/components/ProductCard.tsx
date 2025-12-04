// ProductCard.tsx
// 제품 카드 컴포넌트
// - 제품명, 설명, 가격, 뱃지, 이미지, 스펙, 주문 버튼 표시
// - SCSS 모듈 스타일 적용

import styles from "./ProductCard.module.scss";

// 제품 카드 props 타입
interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  imagePlaceholder: string;
  specs: string[];
}

// ProductCard 컴포넌트
// 단일 제품 정보를 카드 형태로 렌더링
export default function ProductCard({
  name,
  description,
  price,
  originalPrice,
  badge,
  imagePlaceholder,
  specs
}: ProductCardProps) {
  return (
    <div className={styles.productCard}>
      {/* 제품 뱃지 */}
      {badge && <div className={styles.productBadge}>{badge}</div>}
      {/* 제품 이미지 (플레이스홀더) */}
      <div className={styles.productImage}>
        <div className={styles.imagePlaceholder}>
          <div className={styles.placeholderIcon}>{imagePlaceholder}</div>
          <p>제품 이미지</p>
        </div>
      </div>
      {/* 제품 정보 */}
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{name}</h3>
        <p className={styles.productDesc}>{description}</p>
        <ul className={styles.productSpecs}>
          {specs.map((spec, index) => (
            <li key={index}>{spec}</li>
          ))}
        </ul>
        <div className={styles.productPrice}>
          {originalPrice && (
            <span className={styles.originalPrice}>{originalPrice}</span>
          )}
          <span className={styles.price}>{price}</span>
        </div>
        {/* 주문 버튼 */}
        <button className={styles.orderButton}>주문하기</button>
      </div>
    </div>
  );
}