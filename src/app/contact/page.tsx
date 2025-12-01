"use client";

import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import PageHeader from "../../components/PageHeader";
import styles from "./contact.module.scss";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "주문 후 언제 받을 수 있나요?",
      answer: " 당일 주문 오후 2시까지 당일 출고합니다. 제주, 울릉도 등 도서지역은 배송일이 몇일 더 소요될 수 있습니다."
    },
    {
      question: "우렁이는 어떻게 보관해야 하나요?",
      answer: "생물 논우렁이살은 냉장고(0-4℃)에 보관하시고 2-3일 내 드시기 바랍니다. 냉동 논우렁이살은 냉동 보관 시 3개월까지 가능합니다."
    },
    {
      question: "이쁜우렁이만의 특별한 점은 무엇인가요?",
      answer: "20년간 쌓은 전문 노하우와 HACCP 인증 시설, 무항생제 사료와 친환경적인 양식법으로 최고 품질의 우렁이를 생산합니다. 낙동강의 맑은 강물과 정화조를 사용하여 더욱 깨끗하고 건강한 우렁이를 키웁니다."
    },
    {
      question: "제품에 문제가 있으면 어떻게 하나요?",
      answer: "제품에 문제가 있을 시 100% 교환/환불 처리해드립니다. 제품 수령 후 24시간 내 고객센터로 연락주시면 즉시 처리해드립니다. 하지만 문제에 대한 증빙자료(사진 등)이 없는 경우, 단순 변심 및 잘못된 보관 및 취급으로 인한 문제는 교환/환불이 불가능합니다."
    },
    {
      question: "대량 구매나 사업 제휴는 어떻게 하나요?",
      answer: "카카오톡 채널이나 네이버 톡톡으로 '사업 제휴 문의'라고 남겨주시면 빠르게 연락드리겠습니다."
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="문의하기"
        description="궁금하신 점이 있으시면 언제든지 연락주세요"
        backgroundImage="/assets/1.jpg"
      />

      {/* 문의 방법 섹션 */}
      <section className={styles.contactMethods}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2>문의 방법</h2>
            <p>편하신 방법으로 언제든지 문의해주세요</p>
          </div>

          <div className={styles.methodsGrid}>
            {/* 카카오톡 채널 */}
            <a
              href="http://pf.kakao.com/_이쁜우렁이"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.methodCard}
            >
              <div className={styles.methodIcon}>💬</div>
              <h3>카카오톡 채널</h3>
              <p className={styles.methodDescription}>
                실시간 채팅 상담<br />
                빠른 답변 보장
              </p>
              <div className={styles.methodButton}>
                <span>채팅 시작하기</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </a>

            {/* 네이버 톡톡 */}
            <a
              href="https://talk.naver.com/이쁜우렁이"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.methodCard}
            >
              <div className={styles.methodIcon}>🟢</div>
              <h3>네이버 톡톡</h3>
              <p className={styles.methodDescription}>
                간편한 네이버 상담<br />
                사진 전송 가능
              </p>
              <div className={styles.methodButton}>
                <span>톡톡 상담하기</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 찾아오시는 길 섹션 */}
      <section className={styles.locationSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            
            <h2>📍 찾아오시는 길</h2>
          </div>

          <div className={styles.locationContent}>
            <div className={styles.mapContainer}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.7004591256505!2d128.91829027623422!3d35.16409045820767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568c15edc1591cd%3A0xdddf06b937c0b3b0!2z67aA7IKw6rSR7Jet7IucIOqwleyEnOq1rCDsnoXshozsoJXqtIDquLggMTM0LTc4!5e0!3m2!1sko!2skr!4v1760403531534!5m2!1sko!2skr" 
                width="600" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen={false}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">

              </iframe>
            </div>

            <div className={styles.addressInfo}>
              <div className={styles.addressCard}>
                <div className={styles.addressDetails}>
                  <h3>부산광역시 강서구 입소정관길 134-78</h3>
                  <p className={styles.contactInfo}>
                    평일 07:00-17:00
                    <br />
                    팩스번호: 051-980-0598
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 자주 받는 질문 섹션 */}
      <section className={styles.faqSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2>자주 받는 질문</h2>
            <p>고객님들이 가장 많이 문의하시는 내용입니다</p>
          </div>

          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`${styles.faqItem} ${openFaq === index ? styles.open : ''}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span className={styles.faqQ}>Q.</span>
                  <span>{faq.question}</span>
                  <svg
                    className={styles.faqIcon}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className={styles.faqAnswer}>
                    <span className={styles.faqA}>A.</span>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
