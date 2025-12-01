import Image from "next/image";
import Link from "next/link";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import styles from "./quality.module.scss";

export default function QualityPage() {
  return (
    <div className={styles.container}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">홈</Link> → <span>품질관리</span>
          </div>
          <h1 className={styles.heroTitle}>
            엄격한 품질관리로
            <br />
            <span className={styles.highlight}>최상의 안전을 보장합니다</span>
          </h1>
          <p className={styles.heroDescription}>
            HACCP 인증 시설과 20년
             노하우로 구축한
            <br />
            체계적인 품질관리 시스템을 소개합니다.
          </p>
        </div>
      </section>

      {/* HACCP Section */}
      <section className={styles.haccp}>
        <div className={styles.container}>
          <div className={styles.haccpContent}>
            <div className={styles.haccpText}>
              <div className={styles.sectionBadge}>HACCP 인증</div>
              <h2>위해요소중점관리기준 인증</h2>
              <p className={styles.haccpDescription}>
                이쁜우렁이는 식품안전관리인증원으로부터
                HACCP(위해요소중점관리기준) 인증을 받은 시설에서 우렁이를
                생산하고 있습니다. 원료 입고부터 제품 출하까지 모든 과정에서
                위해요소를 체계적으로 관리하여 안전한 식품을 제공합니다.
              </p>
              <div className={styles.haccpFeatures}>
                <div className={styles.haccpFeature}>
                  <div className={styles.featureIcon}>🔍</div>
                  <div>
                    <h4>위해요소 분석</h4>
                    <p>생산 과정의 모든 위해요소를 사전에 분석하고 예방</p>
                  </div>
                </div>
                <div className={styles.haccpFeature}>
                  <div className={styles.featureIcon}>⚡</div>
                  <div>
                    <h4>중요관리점 설정</h4>
                    <p>핵심 관리 포인트를 설정하여 지속적 모니터링</p>
                  </div>
                </div>
                <div className={styles.haccpFeature}>
                  <div className={styles.featureIcon}>📊</div>
                  <div>
                    <h4>검증 및 기록</h4>
                    <p>모든 관리 과정을 문서화하고 정기적으로 검증</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Process */}
      <section className={styles.process}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>품질관리 프로세스</h2>
            <p>원료부터 완제품까지 5단계 엄격한 품질관리 시스템</p>
          </div>

          <div className={styles.processFlow}>
            <div className={styles.processTrack}>
              {/* 첫 번째 세트 */}
              <div className={styles.processStep}>
                <div className={styles.stepImage}>
                  <Image
                    src="/assets/원물.jpg"
                    alt="원물 검수"
                    width={300}
                    height={200}
                  />
                </div>
                <div className={styles.stepNumber}>01</div>
                <div className={styles.stepContent}>
                  <h3>원물 검수</h3>
                  <p>
                    신선한 원물을 엄격한 기준으로 검수하여 최상의 품질을
                    보장합니다
                  </p>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepImage}>
                  <Image
                    src="/assets/탈각 전.jpg"
                    alt="전처리 과정"
                    width={300}
                    height={200}
                  />
                </div>
                <div className={styles.stepNumber}>02</div>
                <div className={styles.stepContent}>
                  <h3>전처리 과정</h3>
                  <p>
                    깨끗한 물로 세척하고 이물질을 제거하여 안전성을 확보합니다
                  </p>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepImage}>
                  <Image
                    src="/assets/탈각 및 이물질 제거 후.jpg"
                    alt="탈각 및 정제"
                    width={300}
                    height={200}
                  />
                </div>
                <div className={styles.stepNumber}>03</div>
                <div className={styles.stepContent}>
                  <h3>탈각 및 정제</h3>
                  <p>전문 장비를 사용하여 껍질을 제거하고 정제 과정을 거칩니다</p>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepImage}>
                  <Image
                    src="/assets/손질 완료.jpg"
                    alt="최종 검수"
                    width={300}
                    height={200}
                  />
                </div>
                <div className={styles.stepNumber}>04</div>
                <div className={styles.stepContent}>
                  <h3>최종 검수</h3>
                  <p>전문가가 직접 검수하여 완벽한 품질의 제품을 선별합니다</p>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepImage}>
                  <Image
                    src="/assets/멸균 공정 후.jpg"
                    alt="멸균 및 포장"
                    width={300}
                    height={200}
                  />
                </div>
                <div className={styles.stepNumber}>05</div>
                <div className={styles.stepContent}>
                  <h3>멸균 및 포장</h3>
                  <p>HACCP 기준에 따른 멸균 처리 후 위생적으로 포장합니다</p>
                </div>
              </div>

              {/* 두 번째 세트 (무한 캐러셀 효과를 위한 복제) */}
              <div className={styles.processStep}>
                <div className={styles.stepImage}>
                  <Image
                    src="/assets/원물.jpg"
                    alt="원물 검수"
                    width={300}
                    height={200}
                  />
                </div>
                <div className={styles.stepNumber}>01</div>
                <div className={styles.stepContent}>
                  <h3>원물 검수</h3>
                  <p>
                    신선한 원물을 엄격한 기준으로 검수하여 최상의 품질을
                    보장합니다
                  </p>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepImage}>
                  <Image
                    src="/assets/탈각 전.jpg"
                    alt="전처리 과정"
                    width={300}
                    height={200}
                  />
                </div>
                <div className={styles.stepNumber}>02</div>
                <div className={styles.stepContent}>
                  <h3>전처리 과정</h3>
                  <p>
                    깨끗한 물로 세척하고 이물질을 제거하여 안전성을 확보합니다
                  </p>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepImage}>
                  <Image
                    src="/assets/탈각 및 이물질 제거 후.jpg"
                    alt="탈각 및 정제"
                    width={300}
                    height={200}
                  />
                </div>
                <div className={styles.stepNumber}>03</div>
                <div className={styles.stepContent}>
                  <h3>탈각 및 정제</h3>
                  <p>전문 장비를 사용하여 껍질을 제거하고 정제 과정을 거칩니다</p>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepImage}>
                  <Image
                    src="/assets/손질 완료.jpg"
                    alt="최종 검수"
                    width={300}
                    height={200}
                  />
                </div>
                <div className={styles.stepNumber}>04</div>
                <div className={styles.stepContent}>
                  <h3>최종 검수</h3>
                  <p>전문가가 직접 검수하여 완벽한 품질의 제품을 선별합니다</p>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepImage}>
                  <Image
                    src="/assets/멸균 공정 후.jpg"
                    alt="멸균 및 포장"
                    width={300}
                    height={200}
                  />
                </div>
                <div className={styles.stepNumber}>05</div>
                <div className={styles.stepContent}>
                  <h3>멸균 및 포장</h3>
                  <p>HACCP 기준에 따른 멸균 처리 후 위생적으로 포장합니다</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testing Lab */}
      <section className={styles.testing}>
        <div className={styles.container}>
          <div className={styles.testingContent}>
            <div className={styles.testingText}>
              <h2>자체 품질검사실 운영</h2>
              <p className={styles.testingDescription}>
                농장 내 자체 품질검사실을 운영하여 모든 제품의 안전성을 사전에
                검증합니다. 전문 검사 장비와 숙련된 검사원이 24시간
                품질관리업무를 수행하고 있습니다.
              </p>

              <div className={styles.testingItems}>
                <div className={styles.testingItem}>
                  <h4>🧪 미생물 검사</h4>
                  <p>대장균, 살모넬라 등 유해 미생물 검출 검사</p>
                </div>
                <div className={styles.testingItem}>
                  <h4>🔬 화학 검사</h4>
                  <p>중금속, 잔류농약, 항생제 잔류량 검사</p>
                </div>
                <div className={styles.testingItem}>
                  <h4>📊 물리적 검사</h4>
                  <p>크기, 중량, 외관 상태 등 물리적 품질 검사</p>
                </div>
                <div className={styles.testingItem}>
                  <h4>🌡️ 온도 관리</h4>
                  <p>저장, 운송 과정의 온도 이력 관리</p>
                </div>
              </div>
            </div>
            <div className={styles.testingImage}>
              <Image
                src="/assets/1.jpg"
                alt="품질검사실 및 생산 시설"
                width={400}
                height={300}
                className={styles.testingImageContent}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className={styles.certifications}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>인증 현황</h2>
            <p>공신력 있는 기관으로부터 받은 각종 인증서</p>
          </div>

          <div className={styles.certGridTwo}>
            <div className={styles.certCard}>
              <div className={styles.certIcon}>📜</div>
              <h3>HACCP 인증</h3>
              <p>위해요소중점관리기준</p>
              <span className={styles.certDate}>2025년 취득</span>
              <div className={styles.certBadge}>유효</div>
            </div>

            <div className={styles.certCard}>
              <div className={styles.certIcon}>💊</div>
              <h3>무항생제 인증</h3>
              <p>무항생제 사료 사용</p>
              <span className={styles.certDate}>2025년 취득</span>
              <div className={styles.certBadge}>유효</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
