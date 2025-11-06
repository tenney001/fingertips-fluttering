import { describe, it, expect } from 'vitest';
import { compareChars, normalizeKey, isValidInput } from '../src/utils/charComparator';

describe('Character Comparator', () => {
  describe('compareChars', () => {
    it('should return true when characters match (case insensitive)', () => {
      expect(compareChars('a', 'a', false)).toBe(true);
      expect(compareChars('A', 'a', false)).toBe(true);
      expect(compareChars('a', 'A', false)).toBe(true);
    });

    it('should return true when characters match (case sensitive)', () => {
      expect(compareChars('a', 'a', true)).toBe(true);
      expect(compareChars('A', 'A', true)).toBe(true);
    });

    it('should return false when characters do not match (case insensitive)', () => {
      expect(compareChars('a', 'b', false)).toBe(false);
      expect(compareChars('A', 'b', false)).toBe(false);
    });

    it('should return false when characters do not match (case sensitive)', () => {
      expect(compareChars('a', 'A', true)).toBe(false);
      expect(compareChars('A', 'a', true)).toBe(false);
      expect(compareChars('a', 'b', true)).toBe(false);
    });

    it('should return false for empty inputs', () => {
      expect(compareChars('', 'a', false)).toBe(false);
      expect(compareChars('a', '', false)).toBe(false);
      expect(compareChars('', '', false)).toBe(false);
    });
  });

  describe('normalizeKey', () => {
    it('should normalize space keys', () => {
      expect(normalizeKey('Space')).toBe(' ');
      expect(normalizeKey('Spacebar')).toBe(' ');
      expect(normalizeKey(' ')).toBe(' ');
    });

    it('should return other keys as-is', () => {
      expect(normalizeKey('a')).toBe('a');
      expect(normalizeKey('Enter')).toBe('Enter');
    });
  });

  describe('isValidInput', () => {
    it('should return true for alphabetic characters', () => {
      expect(isValidInput('a')).toBe(true);
      expect(isValidInput('z')).toBe(true);
      expect(isValidInput('A')).toBe(true);
      expect(isValidInput('Z')).toBe(true);
    });

    it('should return true for space', () => {
      expect(isValidInput(' ')).toBe(true);
    });

    it('should return false for non-alphabetic characters', () => {
      expect(isValidInput('1')).toBe(false);
      expect(isValidInput('!')).toBe(false);
      expect(isValidInput('@')).toBe(false);
      expect(isValidInput('')).toBe(false);
    });
  });
});
