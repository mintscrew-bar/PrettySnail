'use client';

import { useEffect, useState } from 'react';
import styles from "./products.module.scss";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);

      // 카테고리 목록 추출 (활성화된 제품만)
      const uniqueCategories = Array.from(
        new Set(data.filter((p: Product) => p.isActive).map((p: Product) => p.category))
      );
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  // 필터링된 제품 목록
  const filteredProducts = selectedCategory === '전체'
    ? products.filter(p => p.isActive)
    : products.filter(p => p.isActive && p.category === selectedCategory);

  return (
    <div className={styles.container}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">홈</Link> → <span>제품</span>
          </div>
          <h1 className={styles.heroTitle}>
            프리미엄 우렁이<br />
            <span className={styles.highlight}>제품 라인업</span>
          </h1>
          <p className={styles.heroDescription}>
            37년간 축적된 노하우로 엄선한 최고급 우렁이 제품군을<br />
            고객의 다양한 요구에 맞춰 준비했습니다.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className={styles.products}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>{selectedCategory === '전체' ? '전체 제품' : `${selectedCategory} 제품`}</h2>
            <p>이쁜우렁이가 자신있게 추천하는 제품을 만나보세요</p>
          </div>

          {/* 카테고리 필터 */}
          <div className={styles.categoryFilter}>
            <button
              className={`${styles.filterButton} ${selectedCategory === '전체' ? styles.active : ''}`}
              onClick={() => setSelectedCategory('전체')}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className={styles.productGrid}>
            {loading ? (
              <div className={styles.emptyState}>
                <p>제품을 불러오는 중...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <p>등록된 제품이 없습니다.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className={styles.productCard}>
                  <div className={styles.productImage}>
                    {product.badge && (
                      <div className={styles.productBadge}>{product.badge}</div>
                    )}
                    {product.thumbnails?.[0] ? (
                      <img src={product.thumbnails[0]} alt={product.name} className={styles.productThumb} />
                    ) : (
                      <div className={styles.productPlaceholder}>📦</div>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <p className={styles.productCategory}>{product.category}</p>
                    <h3>{product.name}</h3>
                    <div className={styles.productTags}>
                      {product.tags?.slice(0, 3).map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                      ))}
                      {product.badge && (
                        <span className={styles.badge}>{product.badge}</span>
                      )}
                    </div>
                    <p className={styles.description}>{product.description?.substring(0, 80)}...</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}