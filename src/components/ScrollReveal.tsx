'use client';

import { useEffect, useRef, ReactNode } from 'react';
import styles from './ScrollReveal.module.scss';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade-in';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className = '',
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add(styles.visible);
          } else {
            // 요소가 뷰포트를 벗어나면 애니메이션 초기화 (선택사항)
            // element.classList.remove(styles.visible);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px', // 요소가 뷰포트 하단에서 50px 위에 있을 때 트리거
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={`${styles.scrollReveal} ${styles[animation]} ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
}
