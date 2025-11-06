import { describe, it, expect } from 'vitest';
import { generateSequence, generateFromText } from '../src/utils/sequenceGenerator';

describe('Sequence Generator', () => {
  it('should generate sequence with default length', () => {
    const sequence = generateSequence();
    expect(sequence).toHaveLength(50);
    expect(sequence.every(char => /[a-zA-Z]/.test(char))).toBe(true);
  });

  it('should generate sequence with custom length', () => {
    const sequence = generateSequence(10);
    expect(sequence).toHaveLength(10);
  });

  it('should generate lowercase only by default', () => {
    const sequence = generateSequence(100, false);
    expect(sequence.every(char => char === char.toLowerCase())).toBe(true);
  });

  it('should generate mixed case when caseSensitive is true', () => {
    const sequence = generateSequence(100, true);
    const hasUpper = sequence.some(char => char === char.toUpperCase());
    const hasLower = sequence.some(char => char === char.toLowerCase());
    expect(hasUpper || hasLower).toBe(true);
  });

  it('should avoid 3 consecutive same characters', () => {
    const sequence = generateSequence(100, false);
    for (let i = 0; i < sequence.length - 2; i++) {
      expect(sequence[i]).not.toBe(sequence[i + 1]);
      expect(sequence[i]).not.toBe(sequence[i + 1].repeat(2));
    }
  });

  it('should generate from text', () => {
    const text = 'Hello World! 123';
    const sequence = generateFromText(text, false);
    expect(sequence.join('')).toBe('helloworld');
  });

  it('should preserve case when generating from text', () => {
    const text = 'Hello World';
    const sequence = generateFromText(text, true);
    expect(sequence).toEqual(['H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd']);
  });

  it('should filter non-alphabetic characters', () => {
    const text = 'a1b2c3!@#';
    const sequence = generateFromText(text, false);
    expect(sequence).toEqual(['a', 'b', 'c']);
  });
});
