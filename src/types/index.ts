// Product Types
export interface Product {
  id: string;
  category: string;
  name: string;
  tags?: string[];
  description: string;
  badge?: string;
  thumbnails?: string[]; // 제품 썸네일 이미지 URLs
  detailImages?: string[]; // 상세 페이지 이미지 URLs
  imageUrl?: string; // 단일 이미지 URL (하위 호환성)
  storeUrl?: string; // 네이버 스토어 등 외부 구매 링크
  featured?: boolean; // 추천 제품 여부
  isActive: boolean; // 활성화 여부
  createdAt: string;
  updatedAt: string;
}

// Banner Types
export type ContentPosition = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface Banner {
  id: string;
  type: 'main' | 'promotion'; // main: 메인 히어로 배너, promotion: 섹션 사이 프로모션 배너
  title?: string; // 배너 타이틀
  description?: string; // 배너 설명
  contentPosition?: ContentPosition; // 타이틀/버튼 위치 (9개 위치)
  titleColor?: string; // 타이틀 색상 (hex color)
  descriptionColor?: string; // 설명 색상 (hex color)
  textColor?: string; // 폰트 색상 (deprecated - 하위 호환성)
  imageUrl: string; // 배너 이미지 (필수)
  imagePosition?: string; // 이미지 위치 조정 (center, top, bottom, left, right 등) - deprecated
  imageX?: number; // 이미지 X 위치 (0-100%)
  imageY?: number; // 이미지 Y 위치 (0-100%)
  imageScale?: number; // 이미지 크기 (0.5-3)
  linkUrl?: string; // 클릭 시 이동할 URL
  buttonText?: string; // 버튼 텍스트
  buttonUrl?: string; // 버튼 클릭 시 이동할 URL
  showButton?: boolean; // 버튼 표시 여부 (hero 섹션 내 고정 버튼)
  position: number; // 배너 위치 (main: 0 고정, promotion: 1=브랜드가치후, 2=제품쇼케이스후, 3=하단)
  isActive: boolean; // 활성화 여부
  createdAt: string;
  updatedAt: string;
}

// Admin User Types
export interface AdminUser {
  id: string;
  username: string;
  password: string; // In production, this should be hashed
  role: 'admin' | 'editor';
  createdAt: string;
}
