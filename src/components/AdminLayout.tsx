'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './AdminLayout.module.scss';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  // Logout function that clears all authentication data
  const performLogout = useCallback(async (showMessage = false) => {
    try {
      // Call logout API to clear httpOnly cookies and CSRF token
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all authentication data from localStorage
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken'); // Legacy token cleanup

      if (showMessage) {
        alert('보안을 위해 자동으로 로그아웃되었습니다.');
      }

      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('adminUser');

    if (!userData) {
      router.push('/admin/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.removeItem('adminUser');
      router.push('/admin/login');
    }
  }, [router]);

  // Auto-logout when leaving admin pages
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Synchronously clear localStorage before page unloads
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
    };

    const handleVisibilityChange = () => {
      // Auto-logout when user navigates away or closes tab
      if (document.visibilityState === 'hidden') {
        // Call logout API asynchronously
        navigator.sendBeacon('/api/auth/logout');
        // Clear localStorage
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleLogout = () => {
    performLogout(false);
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
          <Link
            href="/admin/settings"
            className={pathname === '/admin/settings' ? styles.active : ''}
          >
            ⚙️ 설정
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
