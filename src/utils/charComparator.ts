import { GAME_CONFIG } from './config';

/**
 * 比较按键与期望字符
 * @param key 按键字符
 * @param expected 期望字符
 * @param caseSensitive 是否区分大小写
 * @returns 比较结果
 */
export function compareChars(
  key: string,
  expected: string,
  caseSensitive: boolean = GAME_CONFIG.caseSensitive
): boolean {
  if (!key || !expected) return false;

  if (caseSensitive) {
    return key === expected;
  } else {
    return key.toLowerCase() === expected.toLowerCase();
  }
}

/**
 * 标准化字符 (处理特殊按键)
 * @param key 原始按键
 * @returns 标准化后的字符
 */
export function normalizeKey(key: string): string {
  // 转换特殊键
  const keyMap: Record<string, string> = {
    'Space': ' ',
    'Spacebar': ' ',
    ' ': ' '
  };

  return keyMap[key] || key;
}

/**
 * 检查是否为有效输入字符
 * @param key 按键字符
 * @returns 是否有效
 */
export function isValidInput(key: string): boolean {
  return /^[a-zA-Z\s]$/.test(key);
}
