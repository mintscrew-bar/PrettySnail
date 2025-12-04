'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import styles from './dashboard.module.scss';
import type { Product, Banner } from '@/types';
import { initializeCsrfToken } from '@/lib/api';

interface Stats {
  products: number;
  activeProducts: number;
  banners: number;
  activeBanners: number;
  categories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    activeProducts: 0,
    banners: 0,
    activeBanners: 0,
    categories: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentBanners, setRecentBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize CSRF token before making any requests
    initializeCsrfToken().then(() => {
      fetchStats();
    });
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, bannersRes] = await Promise.all([
        fetch('/api/products', { credentials: 'include' }),
        fetch('/api/banners', { credentials: 'include' }),
      ]);

      const products: Product[] = await productsRes.json();
      const banners: Banner[] = await bannersRes.json();

      // Calculate statistics
      const activeProducts = products.filter(p => p.isActive);
      const activeBanners = banners.filter(b => b.isActive);
      const categories = new Set(products.map(p => p.category)).size;

      setStats({
        products: products.length,
        activeProducts: activeProducts.length,
        banners: banners.length,
        activeBanners: activeBanners.length,
        categories,
      });

      // Get recent items (last 5)
      setRecentProducts(products.slice(0, 5));
      setRecentBanners(banners.slice(0, 5));
    } catch {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1>대시보드</h1>
            <p>이쁜우렁이 관리자 페이지에 오신 것을 환영합니다</p>
          </div>
          <button onClick={fetchStats} className={styles.refreshButton} disabled={loading}>
            🔄 새로고침
          </button>
        </header>

        {loading ? (
          <div className={styles.loading}>로딩중...</div>
        ) : (
          <>
            {/* Statistics Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📦</div>
                <div className={styles.statInfo}>
                  <h3>전체 제품</h3>
                  <p className={styles.statNumber}>{stats.products}</p>
                  <span className={styles.statSubtext}>활성: {stats.activeProducts}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>🖼️</div>
                <div className={styles.statInfo}>
                  <h3>전체 배너</h3>
                  <p className={styles.statNumber}>{stats.banners}</p>
                  <span className={styles.statSubtext}>활성: {stats.activeBanners}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📂</div>
                <div className={styles.statInfo}>
                  <h3>제품 카테고리</h3>
                  <p className={styles.statNumber}>{stats.categories}</p>
                  <span className={styles.statSubtext}>분류</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>✨</div>
                <div className={styles.statInfo}>
                  <h3>브랜드 활성도</h3>
                  <p className={styles.statNumber}>{Math.round((stats.activeProducts / (stats.products || 1)) * 100)}%</p>
                  <span className={styles.statSubtext}>활성 콘텐츠 비율</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className={styles.mainGrid}>
              {/* Recent Products */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>최근 제품</h2>
                  <Link href="/admin/products" className={styles.viewAllLink}>
                    전체 보기 →
                  </Link>
                </div>
                <div className={styles.listContainer}>
                  {recentProducts.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>등록된 제품이 없습니다</p>
                      <Link href="/admin/products" className={styles.addButton}>
                        제품 추가하기
                      </Link>
                    </div>
                  ) : (
                    <div className={styles.itemList}>
                      {recentProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/admin/products`}
                          className={styles.listItem}
                        >
                          <div className={styles.itemInfo}>
                            <h4>{product.name}</h4>
                            <p>{product.category} • {product.description}</p>
                          </div>
                          <div className={styles.itemMeta}>
                            <span className={product.isActive ? styles.badgeActive : styles.badgeInactive}>
                              {product.isActive ? '활성' : '비활성'}
                            </span>
                            {product.featured && (
                              <span className={styles.badgeFeatured}>추천</span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Banners */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>최근 배너</h2>
                  <Link href="/admin/banners" className={styles.viewAllLink}>
                    전체 보기 →
                  </Link>
                </div>
                <div className={styles.listContainer}>
                  {recentBanners.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>등록된 배너가 없습니다</p>
                      <Link href="/admin/banners" className={styles.addButton}>
                        배너 추가하기
                      </Link>
                    </div>
                  ) : (
                    <div className={styles.itemList}>
                      {recentBanners.map((banner) => (
                        <Link
                          key={banner.id}
                          href={`/admin/banners`}
                          className={styles.listItem}
                        >
                          <div className={styles.itemInfo}>
                            <h4>{banner.title}</h4>
                            <p>{banner.type === 'main' ? '메인 배너' : '프로모션 배너'}</p>
                          </div>
                          <div className={styles.itemMeta}>
                            <span className={banner.isActive ? styles.badgeActive : styles.badgeInactive}>
                              {banner.isActive ? '활성' : '비활성'}
                            </span>
                            <span className={styles.itemDate}>{formatDate(banner.updatedAt)}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <h2>빠른 작업</h2>
              <div className={styles.actionGrid}>
                <Link href="/admin/products" className={styles.actionCard}>
                  <span className={styles.actionIcon}>➕</span>
                  <span>제품 추가</span>
                </Link>
                <Link href="/admin/banners" className={styles.actionCard}>
                  <span className={styles.actionIcon}>➕</span>
                  <span>배너 추가</span>
                </Link>
                <Link href="/admin/logs" className={styles.actionCard}>
                  <span className={styles.actionIcon}>📋</span>
                  <span>시스템 로그 보기</span>
                </Link>
                <Link href="/products" className={styles.actionCard}>
                  <span className={styles.actionIcon}>👁️</span>
                  <span>제품 페이지 보기</span>
                </Link>
                <Link href="/" className={styles.actionCard}>
                  <span className={styles.actionIcon}>🏠</span>
                  <span>메인 페이지 보기</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
