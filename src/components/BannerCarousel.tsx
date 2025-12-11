'use client';

import { useState, useEffect } from 'react';
import { Banner } from '@/types';
import styles from './BannerCarousel.module.scss';

interface BannerCarouselProps {
  banners: Banner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 자동 재생 타이머
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, banners.length]);

  // 이전/다음 배너로 이동
  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];
  const hasContent = currentBanner.title || currentBanner.description || (currentBanner.showButton && currentBanner.buttonText && currentBanner.buttonUrl);

  const getFontSize = (size?: string) => {
    if (!size) return undefined;
    if (size.endsWith('pt')) return size;

    const fontSizeMap: Record<string, string> = {
      h1: 'clamp(1.4rem, 4.5vw, 3.5rem)',
      h2: 'clamp(1.25rem, 4vw, 2.75rem)',
      h3: 'clamp(1.15rem, 3.5vw, 2.25rem)',
      h4: 'clamp(1.05rem, 3vw, 2rem)',
      h5: 'clamp(1rem, 2.5vw, 1.75rem)',
      h6: 'clamp(0.95rem, 2vw, 1.5rem)',
    };
    return fontSizeMap[size] || fontSizeMap.h2;
  };

  const BannerWrapper = currentBanner.linkUrl ? 'a' : 'div';
  const wrapperProps = currentBanner.linkUrl
    ? { href: currentBanner.linkUrl, className: styles.bannerContainer, style: { cursor: 'pointer' } }
    : { className: styles.bannerContainer };

  return (
    <div className={styles.carousel}>
      <BannerWrapper {...wrapperProps}>
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
                transform: `translate(-50%, -50%) scale(${currentBanner.imageScale || 1})`,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: hasContent ? 'brightness(0.6)' : 'none'
              }}
            />
          </div>
          {hasContent && <div className={styles.heroOverlay}></div>}
        </div>

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

      {banners.length > 1 && (
        <div className={styles.paginationIndicator}>
          <button
            className={styles.navButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="이전 배너"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <span className={styles.pageNumber}>
            {currentIndex + 1} / {banners.length}
          </span>

          <button
            className={styles.navButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNext();
            }}
            aria-label="다음 배너"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

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
