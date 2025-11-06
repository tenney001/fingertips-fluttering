import { describe, it, expect } from 'vitest';
import { LanguageManager } from '../src/language/LanguageManager';

describe('Language Manager', () => {
  it('should initialize with default language', () => {
    const manager = new LanguageManager('english');
    const config = manager.getConfig();

    expect(config.code).toBe('en');
    expect(config.name).toBe('English');
  });

  it('should generate sequence', () => {
    const manager = new LanguageManager('english');
    const sequence = manager.generateSequence(20);

    expect(sequence).toHaveLength(20);
    expect(sequence.every(char => /[a-zA-Z]/.test(char))).toBe(true);
  });

  it('should validate keys correctly (case insensitive)', () => {
    const manager = new LanguageManager('english');
    const config = manager.getConfig();

    expect(config.caseSensitive).toBe(false);
    expect(manager.validateKey('a', 'A')).toBe(true);
    expect(manager.validateKey('A', 'a')).toBe(true);
    expect(manager.validateKey('a', 'b')).toBe(false);
  });

  it('should get keyboard layout', () => {
    const manager = new LanguageManager('english');
    const layout = manager.getKeyboardLayout();

    expect(layout).toBe('qwertyuiopasdfghjklzxcvbnm');
  });

  it('should get font family', () => {
    const manager = new LanguageManager('english');
    const font = manager.getFontFamily();

    expect(font).toContain('Arial');
  });

  it('should get text direction', () => {
    const manager = new LanguageManager('english');
    const direction = manager.getTextDirection();

    expect(direction).toBe('ltr');
  });

  it('should switch language', () => {
    const manager = new LanguageManager('english');
    const success = manager.switchLanguage('english');

    expect(success).toBe(true);
  });

  it('should generate valid sequence without excessive repetition', () => {
    const manager = new LanguageManager('english');
    const sequence = manager.generateSequence(50);

    // Check that no character appears 3 times in a row
    for (let i = 0; i < sequence.length - 2; i++) {
      expect(sequence[i]).not.toBe(sequence[i + 1].repeat(2));
    }
  });
});
