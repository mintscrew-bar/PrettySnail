'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product } from '@/types';
import styles from './detail.module.scss';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  // Auto-rotate thumbnails
  useEffect(() => {
    if (!product?.thumbnails || product.thumbnails.length <= 1 || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.thumbnails!.length);
    }, 3000); // 3초마다 전환

    return () => clearInterval(interval);
  }, [product, isHovered]);

  const fetchProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      }

      // 다른 제품들도 가져오기
      const allRes = await fetch('/api/products');
      if (allRes.ok) {
        const allProducts = await allRes.json();
        setOtherProducts(allProducts.filter((p: Product) => p.id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>로딩중...</div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.error}>제품을 찾을 수 없습니다</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.productDetail}>
        <div className={styles.breadcrumb}>
          <Link href="/">홈</Link> → <Link href="/products">제품</Link> → <span>{product.name}</span>
        </div>

        <div className={styles.mainSection}>
          {/* 좌측: 이미지 갤러리 */}
          <div
            className={styles.imageSection}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={styles.mainImage}>
              {product.badge && (
                <span className={styles.badge}>{product.badge}</span>
              )}
              {product.thumbnails && product.thumbnails[selectedImage] ? (
                <img src={product.thumbnails[selectedImage]} alt={product.name} />
              ) : (
                <div className={styles.placeholder}>📦</div>
              )}
            </div>
            {product.thumbnails && product.thumbnails.length > 1 && (
              <div className={styles.thumbnails}>
                {product.thumbnails.map((thumb, index) => (
                  <div
                    key={index}
                    className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={thumb} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 우측: 제품 정보 */}
          <div className={styles.infoSection}>
            <h1 className={styles.productName}>{product.name}</h1>

            <div>
              <span className={styles.categoryTag}>{product.category}</span>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className={styles.tags}>
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={styles.tag}
                    style={{
                      backgroundColor: tag.color + '15',
                      color: tag.color,
                      border: `1px solid ${tag.color}40`
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.descriptionSection}>
              <h3>제품 설명</h3>
              <p className={styles.description}>{product.description}</p>
            </div>

            {product.storeUrl && (
              <div className={styles.actionSection}>
                <a
                  href={product.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.storeButton}
                >
                  구매 문의하기
                </a>
                <p className={styles.contactText}>네이버 스토어에서 구매 가능합니다</p>
              </div>
            )}
          </div>
        </div>

        {/* 상세 이미지 */}
        {product.detailImages && product.detailImages.length > 0 && (
          <div className={styles.detailSection}>
            <h2>제품 상세</h2>
            <div className={styles.detailImages}>
              {product.detailImages.map((img, index) => (
                <img key={index} src={img} alt={`${product.name} 상세 ${index + 1}`} />
              ))}
            </div>
          </div>
        )}

        {/* 다른 제품들 */}
        {otherProducts.length > 0 && (
          <div className={styles.otherProducts}>
            <h2>다른 제품 보기</h2>
            <div className={styles.productsGrid}>
              {otherProducts.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className={styles.productCard}>
                  <div className={styles.productImage}>
                    {p.badge && <div className={styles.productBadge}>{p.badge}</div>}
                    {p.thumbnails?.[0] ? (
                      <img src={p.thumbnails[0]} alt={p.name} />
                    ) : (
                      <div className={styles.productPlaceholder}>📦</div>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{p.name}</h3>
                    <div className={styles.productTags}>
                      <span className={styles.productCategoryTag}>{p.category}</span>
                      {p.tags && p.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className={styles.productTag}
                          style={{
                            backgroundColor: tag.color + '15',
                            color: tag.color,
                            border: `1px solid ${tag.color}40`
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    <p className={styles.productDescription}>
                      {p.description?.length > 50
                        ? `${p.description.substring(0, 50)}...`
                        : p.description
                      }
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
