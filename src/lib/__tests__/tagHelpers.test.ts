import { describe, it, expect } from 'vitest';
import {
  normalizeTag,
  normalizeTags,
  getTagDisplay,
  tagExists,
  addTag,
  removeTag,
  getUniqueTags,
  sortTags,
  searchTags,
  isValidTag,
  sanitizeTag,
  DEFAULT_TAG_COLOR,
} from '../tagHelpers';
import type { ProductTag } from '@/types';

describe('tagHelpers', () => {
  describe('normalizeTag', () => {
    it('should return string tag as is', () => {
      expect(normalizeTag('test-tag')).toBe('test-tag');
    });

    it('should extract name from ProductTag object', () => {
      const tag: ProductTag = { name: 'test-tag', color: '#ff0000' };
      expect(normalizeTag(tag)).toBe('test-tag');
    });

    it('should throw error for invalid tag', () => {
      expect(() => normalizeTag({} as ProductTag)).toThrow('Invalid tag format');
    });
  });

  describe('normalizeTags', () => {
    it('should normalize array of mixed tags', () => {
      const tags: Array<string | ProductTag> = [
        'tag1',
        { name: 'tag2', color: '#ff0000' },
        'tag3',
      ];
      expect(normalizeTags(tags)).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should handle empty array', () => {
      expect(normalizeTags([])).toEqual([]);
    });
  });

  describe('getTagDisplay', () => {
    it('should create ProductTag from string with default color', () => {
      const result = getTagDisplay('test-tag');
      expect(result).toEqual({ name: 'test-tag', color: DEFAULT_TAG_COLOR });
    });

    it('should create ProductTag from string with custom color', () => {
      const result = getTagDisplay('test-tag', '#ff0000');
      expect(result).toEqual({ name: 'test-tag', color: '#ff0000' });
    });

    it('should return ProductTag object as is', () => {
      const tag: ProductTag = { name: 'test-tag', color: '#ff0000' };
      expect(getTagDisplay(tag)).toEqual(tag);
    });
  });

  describe('tagExists', () => {
    it('should return true if tag exists (string)', () => {
      const tags = ['tag1', 'tag2', 'tag3'];
      expect(tagExists('tag2', tags)).toBe(true);
    });

    it('should return false if tag does not exist', () => {
      const tags = ['tag1', 'tag2', 'tag3'];
      expect(tagExists('tag4', tags)).toBe(false);
    });

    it('should work with ProductTag objects', () => {
      const tags: ProductTag[] = [
        { name: 'tag1', color: '#ff0000' },
        { name: 'tag2', color: '#00ff00' },
      ];
      expect(tagExists('tag1', tags)).toBe(true);
      expect(tagExists({ name: 'tag2', color: '#00ff00' }, tags)).toBe(true);
    });
  });

  describe('addTag', () => {
    it('should add new tag to array', () => {
      const tags = ['tag1', 'tag2'];
      const result = addTag('tag3', tags);
      expect(result).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should not add duplicate tag', () => {
      const tags = ['tag1', 'tag2'];
      const result = addTag('tag2', tags);
      expect(result).toEqual(['tag1', 'tag2']);
    });

    it('should work with ProductTag objects', () => {
      const tags: ProductTag[] = [{ name: 'tag1', color: '#ff0000' }];
      const result = addTag({ name: 'tag2', color: '#00ff00' }, tags);
      expect(result).toHaveLength(2);
    });
  });

  describe('removeTag', () => {
    it('should remove tag from array', () => {
      const tags = ['tag1', 'tag2', 'tag3'];
      const result = removeTag('tag2', tags);
      expect(result).toEqual(['tag1', 'tag3']);
    });

    it('should handle non-existent tag', () => {
      const tags = ['tag1', 'tag2'];
      const result = removeTag('tag3', tags);
      expect(result).toEqual(['tag1', 'tag2']);
    });
  });

  describe('getUniqueTags', () => {
    it('should return unique tag names', () => {
      const tags = ['tag1', 'tag2', 'tag1', 'tag3', 'tag2'];
      const result = getUniqueTags(tags);
      expect(result).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should work with ProductTag objects', () => {
      const tags: ProductTag[] = [
        { name: 'tag1', color: '#ff0000' },
        { name: 'tag2', color: '#00ff00' },
        { name: 'tag1', color: '#0000ff' }, // duplicate name
      ];
      const result = getUniqueTags(tags);
      expect(result).toEqual(['tag1', 'tag2']);
    });
  });

  describe('sortTags', () => {
    it('should sort tags alphabetically', () => {
      const tags = ['zebra', 'apple', 'banana'];
      const result = sortTags(tags);
      expect(result).toEqual(['apple', 'banana', 'zebra']);
    });

    it('should work with ProductTag objects', () => {
      const tags: ProductTag[] = [
        { name: 'zebra', color: '#ff0000' },
        { name: 'apple', color: '#00ff00' },
      ];
      const result = sortTags(tags);
      expect((result[0] as ProductTag).name).toBe('apple');
      expect((result[1] as ProductTag).name).toBe('zebra');
    });
  });

  describe('searchTags', () => {
    it('should find tags containing query (case insensitive)', () => {
      const tags = ['apple-pie', 'banana', 'apple-juice'];
      const result = searchTags('apple', tags);
      expect(result).toEqual(['apple-pie', 'apple-juice']);
    });

    it('should handle empty query', () => {
      const tags = ['apple', 'banana'];
      const result = searchTags('', tags);
      expect(result).toEqual(['apple', 'banana']);
    });
  });

  describe('isValidTag', () => {
    it('should return true for valid tags', () => {
      expect(isValidTag('valid-tag')).toBe(true);
      expect(isValidTag('a')).toBe(true);
    });

    it('should return false for empty or whitespace tags', () => {
      expect(isValidTag('')).toBe(false);
      expect(isValidTag('   ')).toBe(false);
    });

    it('should return false for tags exceeding max length', () => {
      const longTag = 'a'.repeat(51);
      expect(isValidTag(longTag)).toBe(false);
    });
  });

  describe('sanitizeTag', () => {
    it('should trim whitespace', () => {
      expect(sanitizeTag('  tag  ')).toBe('tag');
    });

    it('should convert to lowercase when specified', () => {
      expect(sanitizeTag('TAG', true)).toBe('tag');
      expect(sanitizeTag('Tag', false)).toBe('Tag');
    });
  });
});
