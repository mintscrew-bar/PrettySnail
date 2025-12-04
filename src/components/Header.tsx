// Header.tsx
// 사이트 상단 네비게이션/헤더 컴포넌트
// - 로고, 네비게이션 메뉴, 모바일 햄버거 버튼, 오버레이 지원
// - SCSS 모듈 스타일 적용

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.scss";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 모바일 메뉴 토글
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 메뉴 닫기
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        {/* 로고 영역 */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon} aria-label="이쁜우렁이 로고">
            <Image
              src="/assets/logo_no.1.png"
              alt="이쁜우렁이 로고"
              width={200}
              height={80}
              priority
            />
          </div>
        </Link>

        {/* 햄버거 버튼 (모바일) */}
        <button
          className={`${styles.menuToggle} ${isMenuOpen ? styles.open : ""}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* 네비게이션 메뉴 */}
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
          <li>
            <Link href="/story" onClick={closeMenu}>브랜드 스토리</Link>
          </li>
          <li>
            <Link href="/products" onClick={closeMenu}>제품</Link>
          </li>
          <li>
            <Link href="/quality" onClick={closeMenu}>품질관리</Link>
          </li>
          <li>
            <Link href="/contact" onClick={closeMenu}>문의하기</Link>
          </li>
        </ul>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isMenuOpen && (
        <div
          className={styles.overlay}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
