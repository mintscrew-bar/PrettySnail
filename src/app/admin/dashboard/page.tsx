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

      const productsData = await productsRes.json();
      const bannersData = await bannersRes.json();

      const products: Product[] = productsData.data || [];
      const banners: Banner[] = bannersData.data || [];

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
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            새로고침
          </button>
        </header>

        {loading ? (
          <div className={styles.loading}>로딩중...</div>
        ) : (
          <>
            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <h2>빠른 작업</h2>
              <div className={styles.actionGrid}>
                <Link href="/admin/products" className={styles.actionCard}>
                  <span className={styles.actionIcon}>
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                  <span>제품 추가</span>
                </Link>
                <Link href="/admin/banners" className={styles.actionCard}>
                  <span className={styles.actionIcon}>
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                  <span>배너 추가</span>
                </Link>
                <Link href="/admin/logs" className={styles.actionCard}>
                  <span className={styles.actionIcon}>
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </span>
                  <span>시스템 로그 보기</span>
                </Link>
                <Link href="/products" className={styles.actionCard}>
                  <span className={styles.actionIcon}>
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span>제품 페이지 보기</span>
                </Link>
                <Link href="/" className={styles.actionCard}>
                  <span className={styles.actionIcon}>
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </span>
                  <span>메인 페이지 보기</span>
                </Link>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <h3>전체 제품</h3>
                  <p className={styles.statNumber}>{stats.products}</p>
                  <span className={styles.statSubtext}>활성: {stats.activeProducts}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <h3>전체 배너</h3>
                  <p className={styles.statNumber}>{stats.banners}</p>
                  <span className={styles.statSubtext}>활성: {stats.activeBanners}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <h3>제품 카테고리</h3>
                  <p className={styles.statNumber}>{stats.categories}</p>
                  <span className={styles.statSubtext}>분류</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
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
          </>
        )}
      </div>
    </AdminLayout>
  );
}
