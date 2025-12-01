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

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

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
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
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
            <div className={styles.category}>{product.category}</div>
            <h1 className={styles.productName}>{product.name}</h1>

            {product.tags && product.tags.length > 0 && (
              <div className={styles.tags}>
                {product.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            )}

            <p className={styles.description}>{product.description}</p>

            {product.storeUrl && (
              <div className={styles.actionSection}>
                <p className={styles.contactText}>제품 문의 및 구매는 아래 링크를 통해 진행해주세요</p>
                <a
                  href={product.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.storeButton}
                >
                  구매 문의하기 →
                </a>
              </div>
            )}

            {product.badge && (
              <div className={styles.badge}>
                <span>🏷️ {product.badge}</span>
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
                    {p.thumbnails?.[0] ? (
                      <img src={p.thumbnails[0]} alt={p.name} />
                    ) : (
                      <div className={styles.productPlaceholder}>📦</div>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <p className={styles.productCategory}>{p.category}</p>
                    <h3>{p.name}</h3>
                    <p className={styles.productDescription}>{p.description?.substring(0, 60)}...</p>
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
