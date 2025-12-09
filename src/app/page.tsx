import { Banner, Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import BannerCarousel from "../components/BannerCarousel";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PromotionBanner from "../components/PromotionBanner";
import styles from "./page.module.scss";

async function getBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/banners`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const body = await res.json();
    // API may return raw array or a wrapped object { success, data }
    const banners: Banner[] = Array.isArray(body)
      ? body
      : body && typeof body === 'object' && 'data' in body && Array.isArray(body.data)
        ? body.data
        : [];
    return banners.filter(b => b.isActive);
  } catch {
    return [];
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const body = await res.json();
    // API may return raw array or a wrapped object { success, data }
    const products: Product[] = Array.isArray(body)
      ? body
      : body && typeof body === 'object' && 'data' in body && Array.isArray(body.data)
        ? body.data
        : [];
    // 활성화된 제품만 가져오고, featured 제품 우선 표시
    return products
      .filter(p => p.isActive)
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  } catch {
    return [];
  }
}

export default async function Home() {
  const banners = await getBanners();
  const products = await getProducts();
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
          {mainBanners.length > 0 ? (
            <BannerCarousel banners={mainBanners} />
          ) : (
            <div className={styles.hero}>
              <div className={styles.heroBackground}>
                <Image
                  src="/assets/1.jpg"
                  alt="이쁜우렁이 농장의 신선한 우렁이"
                  fill
                  className={styles.heroBackgroundImage}
                  priority
                />
                <div className={styles.heroOverlay}></div>
              </div>
              <div className={styles.heroContainer} data-position="middle-left">
                <div className={styles.heroContent}>
                  <h1 id="hero-title" className={styles.heroTitle}>
                    <span className={styles.heroTitleMain}>자연이 키운 건강함,</span>
                    <span className={styles.heroTitleHighlight}>이쁜우렁이와 함께</span>
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

        {/* Brand Values Section */}
        <section className={styles.brandValues} aria-labelledby="brand-values-title">
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 id="brand-values-title">이쁜우렁이만의 특별함</h2>
              <p>믿을 수 있는 경험과 차별화된 공정으로 생산된 특별한 우렁이를 만나보세요</p>
            </div>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path
                      d="M24 4L30 18L44 20L34 30L36 44L24 38L12 44L14 30L4 20L18 18L24 4Z"
                      fill="#f4a261"
                      fillOpacity="0.1"
                      stroke="#f4a261"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3>건강한 우렁이</h3>
                <p>깨끗한 양식장에서 무항생제 사료를 사용하여 건강하게 키운 우렁이입니다.</p>
              </div>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="#2d5a4d"
                      fillOpacity="0.1"
                      stroke="#2d5a4d"
                      strokeWidth="2"
                    />
                    <path
                      d="M16 24L22 30L32 18"
                      stroke="#2d5a4d"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>전문적 품질관리</h3>
                <p>
                  HACCP 인증 시설에서 엄격한 품질관리와 안전한 생산 과정을 거쳐 안심하고 드실 수
                  있습니다.
                </p>
              </div>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path
                      d="M24 8C20 8 16 12 16 16V32C16 36 20 40 24 40C28 40 32 36 32 32V16C32 12 28 8 24 8Z"
                      fill="#e9c46a"
                      fillOpacity="0.1"
                      stroke="#e9c46a"
                      strokeWidth="2"
                    />
                    <path
                      d="M20 20H28M20 24H28M20 28H26"
                      stroke="#e9c46a"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3>차별화된 공정</h3>
                <p>차별화된 공정으로 최고 품질의 우렁이를 생산합니다.</p>
              </div>
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

        {/* Product Showcase Section */}
        <section className={styles.productShowcase} aria-labelledby="products-title">
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 id="products-title">자연이 키운 프리미엄 우렁이</h2>
              <p>신선하고 건강한 우렁이를 엄선하여 제공합니다</p>
            </div>
            <div className={styles.productGrid}>
              {displayProducts.map(product => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImage}>
                    <Image
                      src={
                        product.thumbnails?.[0] || product.imageUrl || "/assets/default-product.jpg"
                      }
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      style={{ objectFit: "cover" }}
                    />
                    {product.badge && <span className={styles.productBadge}>{product.badge}</span>}
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                </div>
              ))}
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

        {/* Quality Process Section */}
        <section className={styles.qualityProcess} aria-labelledby="process-title">
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 id="process-title">엄격한 품질 관리 프로세스</h2>
              <p>HACCP 인증 시설에서 진행되는 안전하고 위생적인 생산 과정</p>
            </div>
            <div className={styles.processGrid}>
              <div className={styles.processCard}>
                <div className={styles.processImage}>
                  <Image src="/assets/원물.jpg" alt="원물 검수" width={300} height={200} />
                </div>
                <div className={styles.processInfo}>
                  <h3>1. 원물 검수</h3>
                  <p>신선한 원물을 엄격한 기준으로 검수하여 최상의 품질을 보장합니다</p>
                </div>
              </div>
              <div className={styles.processCard}>
                <div className={styles.processImage}>
                  <Image src="/assets/탈각 전.jpg" alt="탈각 전 처리" width={300} height={200} />
                </div>
                <div className={styles.processInfo}>
                  <h3>2. 전처리 과정</h3>
                  <p>깨끗한 물로 세척하고 이물질을 제거합니다.</p>
                </div>
              </div>
              <div className={styles.processCard}>
                <div className={styles.processImage}>
                  <Image
                    src="/assets/탈각 및 이물질 제거 후.jpg"
                    alt="탈각 및 정제"
                    width={300}
                    height={200}
                  />
                </div>
                <div className={styles.processInfo}>
                  <h3>3. 탈각 및 이물질 제거</h3>
                  <p>껍질을 제거하고 이물질을 제거합니다.</p>
                </div>
              </div>
              <div className={styles.processCard}>
                <div className={styles.processImage}>
                  <Image src="/assets/손질 완료.jpg" alt="손질 완료" width={300} height={200} />
                </div>
                <div className={styles.processInfo}>
                  <h3>4. 최종 검수</h3>
                  <p>전문가가 직접 검수하여 완벽한 품질의 제품을 선별합니다</p>
                </div>
              </div>
              <div className={styles.processCard}>
                <div className={styles.processImage}>
                  <Image
                    src="/assets/멸균 공정 후.jpg"
                    alt="멸균 및 포장"
                    width={300}
                    height={200}
                  />
                </div>
                <div className={styles.processInfo}>
                  <h3>5. 멸균 및 포장</h3>
                  <p>HACCP 기준에 따른 멸균 처리 후 위생적으로 포장합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Cards Section */}
        <section className={styles.navigationCards} aria-labelledby="navigation-title">
          <div className={styles.sectionContainer}>
            <h2 id="navigation-title" className="sr-only">
              주요 서비스 메뉴
            </h2>
            <div className={styles.navGrid} role="navigation" aria-label="주요 페이지 링크">
              <FeatureCard
                icon="📖"
                title="브랜드 스토리"
                description="20년 전통의 우렁이 전문 농장의 철학을 만나보세요. "
                href="/story"
                linkText="스토리 보기 →"
  
              />
              <FeatureCard
                icon="🏆"
                title="품질관리"
                description="HACCP 인증 시설의 엄격한 품질관리 시스템과 안전한 생산 과정. 신선하고 건강한 우렁이를 엄선하여 제공합니다. "
                href="/quality"
                linkText="품질 보기 →"
              />
              <FeatureCard
                icon="💬"
                title="고객센터"
                description="무엇이든 물어보세요. 궁금한 점을 해결해드립니다. "
                href="/contact"
                linkText="문의하기 →"
              />
            </div>
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
