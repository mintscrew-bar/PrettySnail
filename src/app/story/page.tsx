import styles from "./story.module.scss";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function StoryPage() {
  return (
    <div className={styles.container}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">홈</Link> → <span>브랜드 스토리</span>
          </div>
          <h1 className={styles.heroTitle}>
            <br />
            <span className={styles.highlight}>우렁이 전문 농장</span>
          </h1>
          <p className={styles.heroDescription}>
            이쁜우렁이는 2005년 부산에서 시작해, 건강하고 안전한 식재료를 제공하기 위해 노력해온 브랜드입니다.
            무항생제 사료만을 사용하여 깨끗한 환경에서 우렁이를 길러왔으며, HACCP 인증 시설에서 위생적으로 생산·포장 과정을 진행합니다.
            신선함과 건강함을 최우선으로, 부산 지역의 신뢰받는 먹거리 브랜드로 자리매김하고 있습니다.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.values}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>우리의 가치</h2>
            <p>이쁜우렁이가 지키고 있는 변하지 않는 가치들</p>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIconWrapper}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={styles.valueIcon}>
                  <path d="M16 4C16 4 12 8 12 12C12 14.2 13.8 16 16 16C18.2 16 20 14.2 20 12C20 8 16 4 16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 16V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 20C10 20 8 22 8 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M20 20C22 20 24 22 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>자연과의 조화</h3>
              <p>자연의 순리를 따르는 양식 방법으로 우렁이가 건강하게 자랄 수 있는 최적의 환경을 조성합니다. 순수한 자연 그대로의 맛을 추구합니다.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIconWrapper}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={styles.valueIcon}>
                  <path d="M16 8C13.8 8 12 9.8 12 12C12 16 16 20 16 20C16 20 20 16 20 12C20 9.8 18.2 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="16" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>가족같은 정성</h3>
              <p>고객을 가족처럼 생각하며 최고의 품질만을 제공하겠다는 마음가짐입니다.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIconWrapper}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={styles.valueIcon}>
                  <path d="M16 4L18.5 11.5L26 14L18.5 16.5L16 24L13.5 16.5L6 14L13.5 11.5L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 28H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>품질에 대한 자부심</h3>
              <p>수년간 쌓아온 노하우와 경험을 바탕으로 최상급 우렁이만을 선별합니다. 품질에 타협하지 않는 것이 우리가 지키는 원칙입니다.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIconWrapper}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={styles.valueIcon}>
                  <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 6V16H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="16" cy="16" r="2" fill="currentColor"/>
                </svg>
              </div>
              <h3>지속가능한 미래</h3>
              <p>강가 생태계 순환을 생각해 오폐수 처리를 위한 고품질 정화조 설비를 갖추고 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Farm Info Section */}
      <section className={styles.farmInfo}>
        <div className={styles.container}>
          <div className={styles.farmContent}>
            <div className={styles.farmText}>
              <h2>농장 정보</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <strong>농장 위치</strong>
                  <span>부산광역시 강서구 입소정관길 134-78</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>농장 규모</strong>
                  <span>양식장 3,000평, 연간 생산량 50톤</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>인증 현황</strong>
                  <span>HACCP 인증, 무항생제 사료 인증</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>주요 시설</strong>
                  <span>양식장 10개동, 선별 포장 시설, 냉장/냉동 보관 창고</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>수질 관리</strong>
                  <span>낙동강 강수, 오수 및 유기물 처리 및 재사용을 위한 정화조 설비 </span>
                </div>
                <div className={styles.infoItem}>
                  <strong>생산 주기</strong>
                  <span>년중 지속 생산, 수확 후 즉시 선별 포장</span>
                </div>
              </div>
            </div>
            <div className={styles.farmImage}>
              <div className={styles.imagePlaceholder}>
                <img className={styles.farmImageSrc} src="/assets/농장.png" alt="농장 전경"/>
                <p>농장 전경</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}