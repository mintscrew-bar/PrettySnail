// Footer.tsx
// 사이트 하단 푸터 컴포넌트
// - 브랜드 정보, 제품/회사/고객센터 링크, 인증, 사업자 정보 표시
// - SCSS 모듈 스타일 적용

import Image from "next/image";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 푸터 메인 콘텐츠: 브랜드, 인증, 링크 */}
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <div className={styles.logoIcon}>
                <Image
                  src="/assets/logo_no.1.png"
                  alt="이쁜우렁이 로고"
                  width={200}
                  height={50}
                />
              </div>
              <div className={styles.logoText}>
              </div>
            </div>
            <p className={styles.footerDesc}>
              우렁이 전문 농장
              <br />
              자연이 키우고 정성으로 기르는 프리미엄 우렁이
            </p>
            <div className={styles.certifications}>
              <div className={styles.cert}>HACCP 인증</div>
              <div className={styles.cert}>무항생제 인증</div>
            </div>
          </div>

          {/* 푸터 링크: 제품, 회사, 고객센터 */}
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>제품</h4>
              <ul>
                <li>
                  <a href="#products">냉동 논우렁살</a>
                </li>
                <li>
                  <a href="#products">생물 논우렁살</a>
                </li>
                <li>
                  <a href="#products">업체용 논우렁살</a>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4>회사</h4>
              <ul>
                <li>
                  <a href="#story">브랜드 스토리</a>
                </li>
                <li>
                  <a href="#quality">품질관리</a>
                </li>
                <li>
                  <a href="#contact">문의하기</a>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4>고객센터</h4>
              <ul>
                <li>팩스번호: 051-980-0598</li>
                <li><a  href="http://pf.kakao.com/_이쁜우렁이"
                        target="_blank"
                        rel="noopener noreferrer"
                        >카카오톡 채널</a>
                </li>
                <li>
                  <a  href="https://talk.naver.com/이쁜우렁이"
                      target="_blank"
                      rel="noopener noreferrer"
                      >네이버 톡톡</a>
                </li>
                <li>평일 09:00 - 17:00</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 푸터 하단: 사업자 정보 및 저작권 */}
        <div className={styles.footerBottom}>
          <div className={styles.footerInfo}>
            <p>
              영어조합법인 이쁜우렁이 | 대표: 김선하 | 사업자등록번호: 189-86-02061
            </p>
            <p>
              주소: 부산광역시 강서구 입소정관길 134-78 (대저2동)
            </p>
          </div>
          <div className={styles.footerCopyright}>
            <p>&copy; 2025 영어조합법인 이쁜우렁이. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
