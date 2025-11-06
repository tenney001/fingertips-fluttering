import type { LanguageConfig } from '@/types';
import { ENGLISH_CONFIG } from './configs/english';

/**
 * 语言管理器 - 统一管理多语种支持
 * V1.0: 仅支持英语
 * V2.0+: 支持动态切换语言
 */
export class LanguageManager {
  private currentConfig: LanguageConfig;

  constructor(languageCode: 'english' = 'english') {
    this.currentConfig = this.loadConfig(languageCode);
  }

  private loadConfig(languageCode: string): LanguageConfig {
    switch (languageCode) {
      case 'english':
        return ENGLISH_CONFIG;
      // V2.0+ 添加更多语言
      // case 'chinese':
      //   return CHINESE_CONFIG;
      // case 'japanese':
      //   return JAPANESE_CONFIG;
      default:
        return ENGLISH_CONFIG;
    }
  }

  /**
   * 获取当前语言配置
   */
  getConfig(): LanguageConfig {
    return this.currentConfig;
  }

  /**
   * 切换语言
   * @param languageCode 语言代码
   * @returns 切换是否成功
   */
  switchLanguage(languageCode: string): boolean {
    try {
      this.currentConfig = this.loadConfig(languageCode);
      return true;
    } catch (e) {
      console.error('Failed to switch language:', e);
      return false;
    }
  }

  /**
   * 生成字符序列
   * @param length 序列长度
   * @returns 字符序列
   */
  generateSequence(length: number = 50): string[] {
    const sequence: string[] = [];
    let lastChar = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.currentConfig.characters.length);
      const char = this.currentConfig.characters[randomIndex];

      // 避免连续重复
      if (char !== lastChar && char !== lastChar.repeat(2)) {
        sequence.push(char);
        lastChar = char;
      } else {
        i--; // 重试
      }
    }

    return sequence;
  }

  /**
   * 验证按键
   * @param pressedKey 按键
   * @param expectedChar 期望字符
   * @returns 是否正确
   */
  validateKey(pressedKey: string, expectedChar: string): boolean {
    if (!this.currentConfig.caseSensitive) {
      return pressedKey.toLowerCase() === expectedChar.toLowerCase();
    }
    return pressedKey === expectedChar;
  }

  /**
   * 获取键盘布局
   */
  getKeyboardLayout(): string {
    return this.currentConfig.keyboardLayout;
  }

  /**
   * 获取字体
   */
  getFontFamily(): string {
    return this.currentConfig.fontFamily;
  }

  /**
   * 获取文本方向
   */
  getTextDirection(): 'ltr' | 'rtl' {
    return this.currentConfig.textDirection;
  }
}
