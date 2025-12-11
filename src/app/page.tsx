'use client';

import { Banner, Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import BannerCarousel from "../components/BannerCarousel";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PromotionBanner from "../components/PromotionBanner";
import ScrollReveal from "../components/ScrollReveal";
import styles from "./page.module.scss";

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch banners
        const bannersRes = await fetch('/api/banners');
        if (bannersRes.ok) {
          const body = await bannersRes.json();
          const bannersData: Banner[] = Array.isArray(body)
            ? body
            : body && typeof body === 'object' && 'data' in body && Array.isArray(body.data)
              ? body.data
              : [];
          setBanners(bannersData.filter(b => b.isActive));
        }

        // Fetch products
        const productsRes = await fetch('/api/products');
        if (productsRes.ok) {
          const body = await productsRes.json();
          const productsData: Product[] = Array.isArray(body)
            ? body
            : body && typeof body === 'object' && 'data' in body && Array.isArray(body.data)
              ? body.data
              : [];
          const filteredProducts = productsData
            .filter(p => p.isActive)
            .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  const mainBanners = banners.filter(b => b.type === "main");
  const bannersPosition1 = banners.filter(b => b.type === "promotion" && b.position === 1);
  const bannersPosition2 = banners.filter(b => b.type === "promotion" && b.position === 2);
  const bannersPosition3 = banners.filter(b => b.type === "promotion" && b.position === 3);

  // 메인 페이지에 표시할 제품: 어드민에서 'featured' 체크한 제품을 우선으로 보여줍니다 (최대 3개)
  const featuredProducts = products.filter(p => p.featured);
  const displayProducts =
    featuredProducts.length > 0 ? featuredProducts.slice(0, 3) : products.slice(0, 3);
  return (
    <div className={styles.container}>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        메인 콘텐츠로 건너뛰기
      </a>

      <Header />

      {/* Hero Section with Carousel */}
      <main id="main-content">
        <section id="home" aria-labelledby="hero-title">
          {!loading && mainBanners.length > 0 && (
            <BannerCarousel banners={mainBanners} />
          )}
          {loading && (
            <div className={styles.hero} style={{ background: 'transparent' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '520px',
                color: '#666'
              }}>
                로딩 중...
              </div>
            </div>
          )}
          {!loading && mainBanners.length === 0 && (
            <div className={styles.hero}>
              <div className={styles.heroContainer} data-position="middle-center">
                <div className={styles.heroContent}>
                  <h1 id="hero-title" className={styles.heroTitle}>
                    <span className={styles.heroTitleMain} style={{ color: '#1a1a1a' }}>자연이 키운 건강함,</span>
                    <span className={styles.heroTitleHighlight} style={{ color: '#7bc54c' }}>이쁜우렁이와 함께</span>
                  </h1>
                  <div className={styles.heroCTA}>
                    <Link href="/products" className={styles.ctaButtonPrimary}>
                      <span>스토어 바로가기</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M7 3L14 10L7 17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                    <Link href="/contact" className={styles.secondaryButton} aria-label="문의하기">
                      <span>문의하기</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Brand Values Section - Zigzag Large-Small Mix */}
        <section className={styles.brandValues} aria-labelledby="brand-values-title">
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 id="brand-values-title">우렁이에 대한 자신감</h2>
              <p>20년 전통의 노하우와 첨단 시설로 최상의 품질을 보장합니다</p>
            </div>
            <div className={styles.valuesZigzag}>
              {/* Row 1: Large Left + Small Right */}
              <ScrollReveal animation="fade-right" delay={0.1}>
                <div className={`${styles.valueCard} ${styles.valueLarge}`}>
                  <div className={styles.valueIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" style={{ width: '64px', height: '64px' }}>
                      <path fill="currentColor" d="M9.5 14.5H9a.5.5 0 0 0 .8.4zm2-1.5l.3-.4a.5.5 0 0 0-.6 0zm2 1.5l-.3.4a.5.5 0 0 0 .8-.4zm-2-3.5A2.5 2.5 0 0 1 9 8.5H8a3.5 3.5 0 0 0 3.5 3.5zM14 8.5a2.5 2.5 0 0 1-2.5 2.5v1A3.5 3.5 0 0 0 15 8.5zM11.5 6A2.5 2.5 0 0 1 14 8.5h1A3.5 3.5 0 0 0 11.5 5zm0-1A3.5 3.5 0 0 0 8 8.5h1A2.5 2.5 0 0 1 11.5 6zM9 10.5v4h1v-4zm.8 4.4l2-1.5-.6-.8l-2 1.5zm1.4-1.5l2 1.5.6-.8l-2-1.5zm2.8 1.1v-4h-1v4zM15 5V1.5h-1V5zm-1.5-5h-12v1h12zM0 1.5v12h1v-12zM1.5 15H8v-1H1.5zM0 13.5A1.5 1.5 0 0 0 1.5 15v-1a.5.5 0 0 1-.5-.5zM1.5 0A1.5 1.5 0 0 0 0 1.5h1a.5.5 0 0 1 .5-.5zM15 1.5A1.5 1.5 0 0 0 13.5 0v1a.5.5 0 0 1 .5.5zM3 5h5V4H3zm0 3h3V7H3z"/>
                    </svg>
                  </div>
                  <h3>HACCP 인증 시설</h3>
                  <p>위생적인 생산 환경과 체계적인 품질관리 시스템으로 안전한 먹거리를 제공합니다</p>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-left" delay={0.2}>
                <div className={`${styles.valueCard} ${styles.valueSmall}`}>
                  <div className={styles.valueIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: '56px', height: '56px', color: '#3b82f6' }}>
                      <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" d="M400 320c0 88.37-55.63 144-144 144s-144-55.63-144-144c0-94.83 103.23-222.85 134.89-259.88a12 12 0 0 1 18.23 0C296.77 97.15 400 225.17 400 320Z"/>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M344 328a72 72 0 0 1-72 72"/>
                    </svg>
                  </div>
                  <h3>청정 낙동강수</h3>
                  <p>깨끗한 강물로 최적의 양식 환경</p>
                </div>
              </ScrollReveal>

              {/* Row 2: Small Left + Large Right */}
              <ScrollReveal animation="fade-right" delay={0.3}>
                <div className={`${styles.valueCard} ${styles.valueSmall}`}>
                  <div className={styles.valueIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" style={{ width: '56px', height: '56px', color: '#6b7280' }}><path fill="currentColor" d="M837 844q-23 37-53 67t-68 54l51 124l-118 48l-51-123q-40 10-86 10t-86-10l-51 123l-118-48l51-124q-37-23-67-53t-54-68L63 895L15 777l123-51q-10-40-10-86t10-86L15 503l48-118l124 51q46-75 121-121l-51-124l118-48l51 123q40-10 86-10t86 10l51-123l118 48l-51 124q75 46 121 121l124-51l48 118l-123 51q10 40 10 86t-10 86l123 51l-48 118zm-325 52q53 0 99-20t82-55t55-81t20-100q0-53-20-99t-55-82t-81-55t-100-20q-53 0-99 20t-82 55t-55 81t-20 100q0 53 20 99t55 82t81 55t100 20m1408 448q0 55-14 111l137 56l-48 119l-138-57q-59 98-156 156l57 137l-119 49l-56-137q-56 14-111 14t-111-14l-56 137l-119-49l57-137q-98-58-156-156l-138 57l-48-119l137-56q-14-56-14-111t14-111l-137-56l48-119l138 57q58-97 156-156l-57-138l119-48l56 137q56-14 111-14t111 14l56-137l119 48l-57 138q97 59 156 156l138-57l48 119l-137 56q14 56 14 111m-448 320q66 0 124-25t101-68t69-102t26-125t-25-124t-69-101t-102-69t-124-26t-124 25t-102 69t-69 102t-25 124t25 124t68 102t102 69t125 25"/></svg>
                  </div>
                  <h3>자동화 설비</h3>
                  <p>효율성과 위생을 극대화</p>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-left" delay={0.4}>
                <div className={`${styles.valueCard} ${styles.valueLarge}`}>
                  <div className={styles.valueIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '64px', height: '64px' }}><path fill="currentColor" d="M8.04 16.34c1.01-2.51 2.15-5.38 6.46-6.34c0 0-5 0-6.62 4.63c0 0-.88-.88-.88-1.88s1-3.12 3.5-3.62c.71-.13 1.5-.26 2.28-.37c1.97-.26 3.86-.54 4.22-1.26c0 0-1.5 8.5-7 8.5c-.18 0-.43-.06-.67-.15L8.86 17l-.95-.33zM12 4c4.41 0 8 3.59 8 8s-3.59 8-8 8s-8-3.59-8-8s3.59-8 8-8m0-2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2"/></svg>
                  </div>
                  <h3>무항생제 친환경 사료</h3>
                  <p>건강하고 안전한 먹거리를 위한 친환경 양식으로 자연 그대로의 건강함을 지킵니다</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 프로모션 배너 - 브랜드 가치 섹션 후 */}
        {bannersPosition1.map(banner => (
          <PromotionBanner
            key={banner.id}
            imageUrl={banner.imageUrl}
            title={banner.title}
            description={banner.description}
            linkUrl={banner.linkUrl}
            buttonText={banner.buttonText}
            buttonUrl={banner.buttonUrl}
            imagePosition={banner.imagePosition}
            imageX={banner.imageX}
            imageY={banner.imageY}
            imageScale={banner.imageScale}
          />
        ))}

        {/* Product Showcase Section - Asymmetric Featured + Grid */}
        <section className={styles.productShowcase} aria-labelledby="products-title">
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 id="products-title">자연이 키운 프리미엄 우렁이</h2>
              <p>신선하고 건강한 우렁이를 엄선하여 제공합니다</p>
            </div>
            <div className={styles.productAsymmetric}>
              {/* Featured Product (Large) */}
              {displayProducts[0] && (
                <ScrollReveal animation="fade-right" delay={0.1}>
                  <Link
                    href={`/products/${displayProducts[0].id}`}
                    className={`${styles.productCard} ${styles.productFeatured}`}
                  >
                    <div className={styles.productImage}>
                      <Image
                        src={
                          displayProducts[0].thumbnails?.[0] || displayProducts[0].imageUrl || "/assets/default-product.jpg"
                        }
                        alt={displayProducts[0].name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
                        style={{ objectFit: "cover" }}
                      />
                      {displayProducts[0].badge && <span className={styles.productBadge}>{displayProducts[0].badge}</span>}
                    </div>
                    <div className={styles.productInfo}>
                      <h3>{displayProducts[0].name}</h3>
                      <p>{displayProducts[0].description}</p>
                    </div>
                  </Link>
                </ScrollReveal>
              )}

              {/* Secondary Products (Small Grid) */}
              <div className={styles.productSecondary}>
                {displayProducts.slice(1, 3).map((product, index) => (
                  <ScrollReveal key={product.id} animation="fade-left" delay={0.2 + index * 0.1}>
                    <Link
                      href={`/products/${product.id}`}
                      className={styles.productCard}
                    >
                      <div className={styles.productImage}>
                        <Image
                          src={
                            product.thumbnails?.[0] || product.imageUrl || "/assets/default-product.jpg"
                          }
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 25vw"
                          style={{ objectFit: "cover" }}
                        />
                        {product.badge && <span className={styles.productBadge}>{product.badge}</span>}
                      </div>
                      <div className={styles.productInfo}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
            <div className={styles.productCTA}>
              <Link href="/products" className={styles.ctaButton}>
                <span>전체 제품 보기</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M7 3L14 10L7 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* 프로모션 배너 - 제품 쇼케이스 섹션 후 */}
        {bannersPosition2.map(banner => (
          <PromotionBanner
            key={banner.id}
            imageUrl={banner.imageUrl}
            title={banner.title}
            description={banner.description}
            linkUrl={banner.linkUrl}
            buttonText={banner.buttonText}
            buttonUrl={banner.buttonUrl}
            imagePosition={banner.imagePosition}
            imageX={banner.imageX}
            imageY={banner.imageY}
            imageScale={banner.imageScale}
          />
        ))}

        {/* Quality Process Section - Horizontal Timeline */}
        <section className={styles.qualityProcess} aria-labelledby="process-title">
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 id="process-title">엄격한 품질 관리 프로세스</h2>
              <p>HACCP 인증 시설에서 진행되는 안전하고 위생적인 생산 과정</p>
            </div>
            <div className={styles.processTimeline}>
              <ScrollReveal animation="fade-up" delay={0.1}>
                <div className={styles.processStep}>
                  <div className={styles.stepNumber}>01</div>
                  <div className={styles.stepImage}>
                    <Image src="/assets/원물.jpg" alt="원물 검수" fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className={styles.stepContent}>
                    <h3>원물 검수</h3>
                    <p>신선한 원물을 엄격한 기준으로 검수</p>
                  </div>
                </div>
              </ScrollReveal>

              <div className={styles.timelineConnector} aria-hidden="true">
                <svg viewBox="0 0 100 20" fill="none">
                  <path d="M0 10 L80 10 L70 5 M80 10 L70 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <ScrollReveal animation="fade-up" delay={0.2}>
                <div className={styles.processStep}>
                  <div className={styles.stepNumber}>02</div>
                  <div className={styles.stepImage}>
                    <Image src="/assets/탈각 전.jpg" alt="전처리 과정" fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className={styles.stepContent}>
                    <h3>전처리 과정</h3>
                    <p>깨끗한 물로 세척 및 이물질 제거</p>
                  </div>
                </div>
              </ScrollReveal>

              <div className={styles.timelineConnector} aria-hidden="true">
                <svg viewBox="0 0 100 20" fill="none">
                  <path d="M0 10 L80 10 L70 5 M80 10 L70 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <ScrollReveal animation="fade-up" delay={0.3}>
                <div className={styles.processStep}>
                  <div className={styles.stepNumber}>03</div>
                  <div className={styles.stepImage}>
                    <Image
                      src="/assets/탈각 및 이물질 제거 후.jpg"
                      alt="탈각 및 정제"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.stepContent}>
                    <h3>탈각 및 정제</h3>
                    <p>껍질 제거 및 이물질 완전 제거</p>
                  </div>
                </div>
              </ScrollReveal>

              <div className={styles.timelineConnector} aria-hidden="true">
                <svg viewBox="0 0 100 20" fill="none">
                  <path d="M0 10 L80 10 L70 5 M80 10 L70 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <ScrollReveal animation="fade-up" delay={0.4}>
                <div className={styles.processStep}>
                  <div className={styles.stepNumber}>04</div>
                  <div className={styles.stepImage}>
                    <Image src="/assets/손질 완료.jpg" alt="최종 검수" fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className={styles.stepContent}>
                    <h3>최종 검수</h3>
                    <p>전문가 직접 품질 선별</p>
                  </div>
                </div>
              </ScrollReveal>

              <div className={styles.timelineConnector} aria-hidden="true">
                <svg viewBox="0 0 100 20" fill="none">
                  <path d="M0 10 L80 10 L70 5 M80 10 L70 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <ScrollReveal animation="fade-up" delay={0.5}>
                <div className={styles.processStep}>
                  <div className={styles.stepNumber}>05</div>
                  <div className={styles.stepImage}>
                    <Image
                      src="/assets/멸균 공정 후.jpg"
                      alt="멸균 및 포장"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.stepContent}>
                    <h3>멸균 및 포장</h3>
                    <p>HACCP 기준 멸균 처리 및 포장</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Navigation Cards Section - Full Bleed Image CTAs */}
        <section className={styles.navigationCards} aria-labelledby="navigation-title">
          <h2 id="navigation-title" className="sr-only">
            주요 서비스 메뉴
          </h2>
          <div className={styles.navFullBleed} role="navigation" aria-label="주요 페이지 링크">
            <ScrollReveal animation="zoom-in" delay={0.1}>
              <Link href="/story" className={styles.navFullCard}>
                <div className={styles.navCardOverlay}></div>
                <div className={styles.navCardContent}>
                  <div className={styles.navCardIcon}>
                    <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                      <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <line x1="10" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="10" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="10" y1="20" x2="18" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3>브랜드 스토리</h3>
                  <p>20년 전통의 우렁이 전문 농장</p>
                  <span className={styles.navCardLink}>
                    자세히 보기
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            </ScrollReveal>

            <ScrollReveal animation="zoom-in" delay={0.2}>
              <Link href="/quality" className={styles.navFullCard}>
                <div className={styles.navCardOverlay}></div>
                <div className={styles.navCardContent}>
                  <div className={styles.navCardIcon}>
                    <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                      <path d="M16 4L18.5 11.5L26 14L18.5 16.5L16 24L13.5 16.5L6 14L13.5 11.5L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="16" cy="14" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3>품질관리</h3>
                  <p>HACCP 인증 시설의 엄격한 관리</p>
                  <span className={styles.navCardLink}>
                    자세히 보기
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            </ScrollReveal>

            <ScrollReveal animation="zoom-in" delay={0.3}>
              <Link href="/contact" className={styles.navFullCard}>
                <div className={styles.navCardOverlay}></div>
                <div className={styles.navCardContent}>
                  <div className={styles.navCardIcon}>
                    <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                      <path d="M28 20C28 21.1 27.1 22 26 22H10L4 28V6C4 4.9 4.9 4 6 4H26C27.1 4 28 4.9 28 6V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="13" r="1.5" fill="currentColor"/>
                      <circle cx="16" cy="13" r="1.5" fill="currentColor"/>
                      <circle cx="20" cy="13" r="1.5" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3>고객센터</h3>
                  <p>궁금한 점을 해결해드립니다</p>
                  <span className={styles.navCardLink}>
                    문의하기
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* 프로모션 배너 - 하단 */}
        {bannersPosition3.map(banner => (
          <PromotionBanner
            key={banner.id}
            imageUrl={banner.imageUrl}
            title={banner.title}
            description={banner.description}
            linkUrl={banner.linkUrl}
            buttonText={banner.buttonText}
            buttonUrl={banner.buttonUrl}
            imagePosition={banner.imagePosition}
            imageX={banner.imageX}
            imageY={banner.imageY}
            imageScale={banner.imageScale}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
}
