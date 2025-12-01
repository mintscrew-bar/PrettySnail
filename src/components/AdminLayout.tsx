'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './AdminLayout.module.scss';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (!user) {
    return <div className={styles.loading}>로딩중...</div>;
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>🐌 이쁜우렁이</h2>
          <p>관리자 패널</p>
        </div>

        <nav className={styles.nav}>
          <Link
            href="/admin/dashboard"
            className={pathname === '/admin/dashboard' ? styles.active : ''}
          >
            📊 대시보드
          </Link>
          <Link
            href="/admin/products"
            className={pathname === '/admin/products' ? styles.active : ''}
          >
            📦 제품 관리
          </Link>
          <Link
            href="/admin/banners"
            className={pathname === '/admin/banners' ? styles.active : ''}
          >
            🖼️ 배너 관리
          </Link>
        </nav>

        <div className={styles.user}>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.username}</p>
            <p className={styles.userRole}>{user.role}</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            로그아웃
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
