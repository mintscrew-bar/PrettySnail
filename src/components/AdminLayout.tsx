"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from "./AdminLayout.module.scss";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Logout function that clears all authentication data
  const performLogout = useCallback(
    async (showMessage = false) => {
      try {
        // Call logout API to clear httpOnly cookies and CSRF token
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Clear all authentication data from localStorage
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken"); // Legacy token cleanup

        if (showMessage) {
          alert("보안을 위해 자동으로 로그아웃되었습니다.");
        }

        router.push("/admin/login");
      }
    },
    [router]
  );

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("adminUser");

    if (!userData) {
      router.push("/admin/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem("adminUser");
      router.push("/admin/login");
    }
  }, [router]);

  // Auto-logout when leaving admin pages
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Synchronously clear localStorage before page unloads
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
    };

    const handleVisibilityChange = () => {
      // Auto-logout when user navigates away or closes tab
      if (document.visibilityState === "hidden") {
        // Call logout API asynchronously
        navigator.sendBeacon("/api/auth/logout");
        // Clear localStorage
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
      {/* Mobile Header with Hamburger */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileHeaderContent}>
          <button
            className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴 토글"
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={styles.mobileLogo}>
            <Image
              src="/assets/logo_circle.png"
              alt="이쁜우렁이 로고"
              width={120}
              height={120}
              priority
              quality={95}
            />
          </div>
        </div>
      </header>

      {/* Sidebar / Mobile Menu */}
      <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.logo}>
          <div className={styles.logoImage}>
            <Image
              src="/assets/logo_circle.png"
              alt="이쁜우렁이 로고"
              width={200}
              height={200}
              priority
              quality={95}
            />
          </div>
          <p>관리자 패널</p>
        </div>

        <nav className={styles.nav}>
          <Link
            href="/admin/dashboard"
            className={pathname === "/admin/dashboard" ? styles.active : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
            대시보드
          </Link>
          <Link
            href="/admin/products"
            className={pathname === "/admin/products" ? styles.active : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            제품 관리
          </Link>
          <Link
            href="/admin/banners"
            className={pathname === "/admin/banners" ? styles.active : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            배너 관리
          </Link>
          <Link
            href="/admin/settings"
            className={pathname === "/admin/settings" ? styles.active : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            설정
          </Link>
        </nav>

        <div className={styles.user}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.964 0a9 9 0 10-11.964 0m11.964 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user.username}</p>
              <p className={styles.userRole}>{user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            로그아웃
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div className={styles.overlay} onClick={() => setMobileMenuOpen(false)} />
      )}

      <main className={styles.main}>{children}</main>
    </div>
  );
}
