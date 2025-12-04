import styles from "./ProductCard.module.scss";

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  imagePlaceholder: string;
  specs: string[];
}

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
      {badge && <div className={styles.productBadge}>{badge}</div>}
      <div className={styles.productImage}>
        <div className={styles.imagePlaceholder}>
          <div className={styles.placeholderIcon}>{imagePlaceholder}</div>
          <p>제품 이미지</p>
        </div>
      </div>
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
        <button className={styles.orderButton}>주문하기</button>
      </div>
    </div>
  );
}