'use client';

import { useState, useEffect, useCallback } from 'react';
import { Banner } from '@/types';
import styles from './BannerCarousel.module.scss';

interface BannerCarouselProps {
  banners: Banner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [banners.length, isTransitioning]);

  const _prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [banners.length, isTransitioning]);

  // 자동 재생
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5초마다 자동 전환

    return () => clearInterval(interval);
  }, [banners.length, nextSlide]);

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  // 배너에 콘텐츠가 있는지 확인 (제목, 설명, 버튼)
  const hasContent = currentBanner.title || currentBanner.description || (currentBanner.showButton && currentBanner.buttonText && currentBanner.buttonUrl);

  // 폰트 크기 계산 함수
  const getFontSize = (size?: string) => {
    if (!size) return undefined;
    if (size.endsWith('pt')) return size;

    // h1~h6 매핑
    const fontSizeMap: Record<string, string> = {
      h1: 'clamp(2.5rem, 5vw, 3.5rem)',
      h2: 'clamp(2rem, 4vw, 2.75rem)',
      h3: 'clamp(1.75rem, 3.5vw, 2.25rem)',
      h4: 'clamp(1.5rem, 3vw, 2rem)',
      h5: 'clamp(1.25rem, 2.5vw, 1.75rem)',
      h6: 'clamp(1rem, 2vw, 1.5rem)',
    };
    return fontSizeMap[size] || fontSizeMap.h2;
  };

  // 디버깅: 배너 데이터 로깅
  if (process.env.NODE_ENV === 'development') {
    console.log('Current Banner:', {
      index: currentIndex,
      showButton: currentBanner.showButton,
      buttonText: currentBanner.buttonText,
      buttonUrl: currentBanner.buttonUrl,
      hasContent,
    });
  }

  // 배너 컨테이너를 링크로 감쌀지 결정
  const BannerWrapper = currentBanner.linkUrl ? 'a' : 'div';
  const wrapperProps = currentBanner.linkUrl
    ? { href: currentBanner.linkUrl, className: styles.bannerContainer, style: { cursor: 'pointer' } }
    : { className: styles.bannerContainer };

  return (
    <div className={styles.carousel}>
      <BannerWrapper {...wrapperProps}>
        {/* 배경 이미지 */}
        <div className={styles.heroBackground}>
          <div style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title || "배너 이미지"}
              style={{
                position: 'absolute',
                left: `${currentBanner.imageX || 50}%`,
                top: `${currentBanner.imageY || 50}%`,
                /* 이미지 스케일에 CSS 변수를 곱해 모바일 축소 반영 */
                transform: `translate(-50%, -50%) scale(calc(${currentBanner.imageScale || 1} * var(--banner-image-scale, 1)))`,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: hasContent ? 'brightness(0.6)' : 'none'
              }}
            />
          </div>
          {hasContent && <div className={styles.heroOverlay}></div>}
        </div>

        {/* 콘텐츠 */}
        {hasContent && <div className={styles.heroContainer} data-position={currentBanner.contentPosition || 'middle-left'}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {currentBanner.title && (
                <span className={styles.heroTitleMain} style={{
                  color: currentBanner.titleColor || '#ffffff',
                  fontSize: getFontSize(currentBanner.titleFontSize)
                }}>
                  {currentBanner.title}
                </span>
              )}
              {currentBanner.description && (
                <span className={styles.heroTitleHighlight} style={{
                  color: currentBanner.descriptionColor || '#e9c46a',
                  fontSize: getFontSize(currentBanner.descriptionFontSize)
                }}>
                  {currentBanner.description}
                </span>
              )}
            </h1>
            {currentBanner.showButton && currentBanner.buttonText && currentBanner.buttonUrl && (
              <div className={styles.heroCTA} onClick={(e) => e.stopPropagation()}>
                <a
                  href={currentBanner.buttonUrl}
                  className={styles.ctaButtonPrimary}
                  aria-label={currentBanner.buttonText}
                >
                  <span>{currentBanner.buttonText}</span>
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
                </a>
              </div>
            )}
          </div>
        </div>}
      </BannerWrapper>

      {/* 인디케이터 (배너가 여러 개일 때만 표시) */}
      {banners.length > 1 && (
        <div className={styles.indicators}>
          {banners.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.indicatorActive : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
              aria-label={`배너 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}

      {/* 스크롤 유도 인디케이터 (showButton이 true일 때만 표시) */}
      {currentBanner.showButton && (
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span className={styles.scrollText}>더 알아보기</span>
          <svg className={styles.scrollArrow} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}
