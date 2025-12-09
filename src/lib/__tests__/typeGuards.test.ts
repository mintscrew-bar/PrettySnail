import { describe, it, expect } from 'vitest';
import {
  isProductTag,
  isApiError,
  isValidEmail,
  isValidUrl,
  isValidHexColor,
} from '../typeGuards';
import type { ProductTag } from '@/types';

describe('typeGuards', () => {
  describe('isProductTag', () => {
    it('should return true for valid ProductTag', () => {
      const tag: ProductTag = { name: 'test', color: '#ff0000' };
      expect(isProductTag(tag)).toBe(true);
    });

    it('should return false for string', () => {
      expect(isProductTag('test')).toBe(false);
    });

    it('should return false for object missing name', () => {
      expect(isProductTag({ color: '#ff0000' })).toBe(false);
    });

    it('should return false for object missing color', () => {
      expect(isProductTag({ name: 'test' })).toBe(false);
    });

    it('should return false for null', () => {
      expect(isProductTag(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isProductTag(undefined)).toBe(false);
    });
  });

  describe('isApiError', () => {
    it('should return true for valid API error', () => {
      const error = {
        data: {
          error: 'Something went wrong',
          errorCode: 'API001',
        },
      };
      expect(isApiError(error)).toBe(true);
    });

    it('should return false for regular error', () => {
      const error = new Error('Regular error');
      expect(isApiError(error)).toBe(false);
    });

    it('should return false for object without data', () => {
      expect(isApiError({ error: 'test' })).toBe(false);
    });

    it('should return false for null', () => {
      expect(isApiError(null)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.kr')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs with protocol', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('just-text')).toBe(false);
    });
  });

  describe('isValidHexColor', () => {
    it('should return true for valid hex colors', () => {
      expect(isValidHexColor('#ff0000')).toBe(true);
      expect(isValidHexColor('#FF0000')).toBe(true);
      expect(isValidHexColor('#f00')).toBe(true);
      expect(isValidHexColor('#ABC')).toBe(true);
    });

    it('should return false for invalid hex colors', () => {
      expect(isValidHexColor('ff0000')).toBe(false); // missing #
      expect(isValidHexColor('#ff00')).toBe(false); // wrong length
      expect(isValidHexColor('#gggggg')).toBe(false); // invalid characters
      expect(isValidHexColor('')).toBe(false);
      expect(isValidHexColor('red')).toBe(false);
    });
  });
});
