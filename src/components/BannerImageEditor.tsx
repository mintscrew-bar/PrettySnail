'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './BannerImageEditor.module.scss';

interface BannerImageEditorProps {
  imageUrl: string;
  onPositionChange: (position: { x: number; y: number; scale: number }) => void;
  initialPosition?: { x: number; y: number; scale: number };
}

export default function BannerImageEditor({
  imageUrl,
  onPositionChange,
  initialPosition = { x: 50, y: 50, scale: 1 }
}: BannerImageEditorProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onPositionChange(position);
  }, [position, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({
      x: clickX,
      y: clickY
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const deltaX = currentX - dragStart.x;
    const deltaY = currentY - dragStart.y;

    const newX = position.x + (deltaX / rect.width) * 100;
    const newY = position.y + (deltaY / rect.height) * 100;

    setPosition({
      ...position,
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY))
    });

    setDragStart({
      x: currentX,
      y: currentY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setPosition(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale + delta))
    }));
  };

  const handleReset = () => {
    setPosition({ x: 50, y: 50, scale: 1 });
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>확대/축소</label>
          <div className={styles.zoomControls}>
            <button type="button" onClick={() => handleZoom(-0.1)} className={styles.zoomButton}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <span className={styles.scaleValue}>{Math.round(position.scale * 100)}%</span>
            <button type="button" onClick={() => handleZoom(0.1)} className={styles.zoomButton}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        <button type="button" onClick={handleReset} className={styles.resetButton}>
          초기화
        </button>
      </div>

      <div className={styles.editorHint}>
        <strong>이미지 위치 조정</strong> - 드래그하여 이동 · 점선 영역 안으로 이미지 배치
      </div>

      <div
        ref={containerRef}
        className={styles.previewContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {/* 안전 영역 가이드 */}
        <div className={styles.safeArea}>
          <div className={styles.safeAreaLabel}>실제 보이는 영역</div>
        </div>

        {/* 이미지 */}
        <img
          src={imageUrl}
          alt="배너 편집"
          draggable={false}
          className={styles.imageWrapper}
          style={{
            position: 'absolute',
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: `translate(-50%, -50%) scale(${position.scale})`,
            width: '100%',
            height: 'auto',
            minHeight: '100%',
            objectFit: 'cover',
            pointerEvents: 'none'
          }}
        />

        {/* 가이드 그리드 */}
        <div className={styles.gridOverlay}>
          <div className={styles.gridLine} style={{ left: '33.33%' }}></div>
          <div className={styles.gridLine} style={{ left: '66.66%' }}></div>
          <div className={styles.gridLine} style={{ top: '33.33%', width: '100%', height: '1px' }}></div>
          <div className={styles.gridLine} style={{ top: '66.66%', width: '100%', height: '1px' }}></div>
        </div>
      </div>

      <div className={styles.positionInfo}>
        <span>X: {Math.round(position.x)}%</span>
        <span>Y: {Math.round(position.y)}%</span>
        <span>크기: {Math.round(position.scale * 100)}%</span>
      </div>
    </div>
  );
}
