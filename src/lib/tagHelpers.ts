import { ProductTag } from '@/types';
import { isProductTag } from './typeGuards';

/**
 * 기본 태그 색상
 */
export const DEFAULT_TAG_COLOR = '#547416';

/**
 * 태그 색상 팔레트
 */
export const TAG_COLORS = {
  PRIMARY: '#547416',
  SECONDARY: '#8b4513',
  ACCENT: '#d2691e',
  SUCCESS: '#27ae60',
  INFO: '#3498db',
  WARNING: '#f39c12',
  ERROR: '#e74c3c',
  GRAY: '#6b7280',
} as const;

/**
 * 태그를 문자열로 정규화
 * @param tag - 문자열 또는 ProductTag 객체
 * @returns 태그 이름 (문자열)
 */
export function normalizeTag(tag: string | ProductTag): string {
  if (typeof tag === 'string') {
    return tag;
  }
  if (isProductTag(tag)) {
    return tag.name;
  }
  throw new Error('Invalid tag format');
}

/**
 * 태그 배열을 문자열 배열로 정규화
 * @param tags - 태그 배열
 * @returns 문자열 배열
 */
export function normalizeTags(tags: Array<string | ProductTag>): string[] {
  return tags.map(normalizeTag);
}

/**
 * 태그 표시 정보 가져오기
 * @param tag - 문자열 또는 ProductTag 객체
 * @param defaultColor - 기본 색상 (옵션)
 * @returns { name, color } 객체
 */
export function getTagDisplay(
  tag: string | ProductTag,
  defaultColor: string = DEFAULT_TAG_COLOR
): ProductTag {
  if (typeof tag === 'string') {
    return {
      name: tag,
      color: defaultColor,
    };
  }
  if (isProductTag(tag)) {
    return tag;
  }
  throw new Error('Invalid tag format');
}

/**
 * 태그 배열을 ProductTag 배열로 변환
 * @param tags - 태그 배열
 * @param defaultColor - 기본 색상
 * @returns ProductTag 배열
 */
export function normalizeTagsToObjects(
  tags: Array<string | ProductTag>,
  defaultColor: string = DEFAULT_TAG_COLOR
): ProductTag[] {
  return tags.map((tag) => getTagDisplay(tag, defaultColor));
}

/**
 * 문자열 배열을 ProductTag 배열로 변환
 * @param tagNames - 태그 이름 배열
 * @param colorMap - 태그별 색상 매핑 (옵션)
 * @returns ProductTag 배열
 */
export function stringsToProductTags(
  tagNames: string[],
  colorMap?: Record<string, string>
): ProductTag[] {
  return tagNames.map((name) => ({
    name,
    color: colorMap?.[name] || DEFAULT_TAG_COLOR,
  }));
}

/**
 * 태그가 배열에 존재하는지 확인
 * @param tag - 확인할 태그
 * @param tags - 태그 배열
 * @returns 존재 여부
 */
export function tagExists(
  tag: string | ProductTag,
  tags: Array<string | ProductTag>
): boolean {
  const tagName = normalizeTag(tag);
  return tags.some((t) => normalizeTag(t) === tagName);
}

/**
 * 태그 추가 (중복 방지)
 * @param tag - 추가할 태그
 * @param tags - 기존 태그 배열
 * @returns 새 태그 배열
 */
export function addTag(
  tag: string | ProductTag,
  tags: Array<string | ProductTag>
): Array<string | ProductTag> {
  if (tagExists(tag, tags)) {
    return tags;
  }
  return [...tags, tag];
}

/**
 * 태그 제거
 * @param tag - 제거할 태그
 * @param tags - 기존 태그 배열
 * @returns 새 태그 배열
 */
export function removeTag(
  tag: string | ProductTag,
  tags: Array<string | ProductTag>
): Array<string | ProductTag> {
  const tagName = normalizeTag(tag);
  return tags.filter((t) => normalizeTag(t) !== tagName);
}

/**
 * 태그 배열에서 고유한 태그만 추출
 * @param tags - 태그 배열
 * @returns 고유한 태그 배열
 */
export function getUniqueTags(tags: Array<string | ProductTag>): string[] {
  const uniqueNames = new Set<string>();
  tags.forEach((tag) => {
    uniqueNames.add(normalizeTag(tag));
  });
  return Array.from(uniqueNames);
}

/**
 * 태그 정렬 (알파벳 순)
 * @param tags - 태그 배열
 * @returns 정렬된 태그 배열
 */
export function sortTags(tags: Array<string | ProductTag>): Array<string | ProductTag> {
  return [...tags].sort((a, b) => {
    const nameA = normalizeTag(a);
    const nameB = normalizeTag(b);
    return nameA.localeCompare(nameB);
  });
}

/**
 * 태그 검색 (대소문자 무시)
 * @param query - 검색어
 * @param tags - 태그 배열
 * @returns 매칭된 태그 배열
 */
export function searchTags(
  query: string,
  tags: Array<string | ProductTag>
): Array<string | ProductTag> {
  const lowerQuery = query.toLowerCase();
  return tags.filter((tag) => {
    const tagName = normalizeTag(tag).toLowerCase();
    return tagName.includes(lowerQuery);
  });
}

/**
 * 태그 유효성 검사
 * @param tag - 검사할 태그
 * @returns 유효 여부
 */
export function isValidTag(tag: string): boolean {
  return (
    typeof tag === 'string' &&
    tag.trim().length > 0 &&
    tag.trim().length <= 50
  );
}

/**
 * 태그 문자열 정리 (공백 제거, 소문자 변환 옵션)
 * @param tag - 정리할 태그 문자열
 * @param toLowerCase - 소문자로 변환 여부
 * @returns 정리된 태그 문자열
 */
export function sanitizeTag(tag: string, toLowerCase = false): string {
  let sanitized = tag.trim();
  if (toLowerCase) {
    sanitized = sanitized.toLowerCase();
  }
  return sanitized;
}
