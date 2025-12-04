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
  const [progress, setProgress] = useState(0);

  // 자동 재생 타이머
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, banners.length]);

  // 프로그레스 바 애니메이션
  useEffect(() => {
    if (banners.length <= 1) return;

    setProgress(0);
    const startTime = Date.now();
    const duration = 5000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(updateProgress);
      }
    };

    const animationId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationId);
  }, [currentIndex, banners.length]);

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
        <div className={styles.indicators}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentIndex + progress) / banners.length) * 100}%` }}
            aria-hidden="true"
          />

          {banners.map((_, index) => (
            <button
              key={index}
              className={`${styles.progressSegment} ${index === currentIndex ? styles.progressSegmentActive : ''}`}
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
