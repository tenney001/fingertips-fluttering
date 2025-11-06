import { GAME_CONFIG } from './config';

/**
 * 生成随机字母序列
 * @param length 序列长度
 * @param caseSensitive 是否区分大小写
 * @returns 字母序列
 */
export function generateSequence(
  length: number = GAME_CONFIG.sequenceLength,
  caseSensitive: boolean = GAME_CONFIG.caseSensitive
): string[] {
  const sequence: string[] = [];
  let lastChar: string = '';

  for (let i = 0; i < length; i++) {
    let char: string;
    let attempts = 0;

    // 15%概率生成空格，85%概率生成字母
    if (Math.random() < 0.15 && lastChar !== ' ') {
      char = ' ';
      sequence.push(char);
      lastChar = char;
      continue;
    }

    // 生成随机字母
    const asciiCode = 97 + Math.floor(Math.random() * 26); // 'a' to 'z'
    char = String.fromCharCode(asciiCode);

    // 根据配置决定大小写显示：
    // - 默认不区分大小写：生成大写字母（视觉上更清晰）
    // - 区分大小写：50%概率生成大小写
    if (!caseSensitive) {
      char = char.toUpperCase(); // 默认显示大写
    } else if (Math.random() > 0.5) {
      char = char.toUpperCase(); // 区分大小写时随机大小写
    }

    // 避免连续重复
    do {
      attempts++;
    } while (attempts < 5 && isTooSimilar(char, lastChar));

    sequence.push(char);
    lastChar = char;
  }

  return sequence;
}

/**
 * 判断字符是否过于相似 (避免连续3个重复)
 */
function isTooSimilar(current: string, last: string): boolean {
  return current === last || current === last.repeat(2);
}

/**
 * 从文本生成序列 (V2.0功能)
 * @param text 输入文本
 * @param caseSensitive 大小写配置
 * @returns 过滤后的字符序列
 */
export function generateFromText(
  text: string,
  caseSensitive: boolean = GAME_CONFIG.caseSensitive
): string[] {
  return text
    .split('')
    .filter(char => /[a-zA-Z]/.test(char))
    .map(char => caseSensitive ? char : char.toLowerCase());
}

/**
 * 生成键盘布局序列
 * @param layout 键盘布局字符串
 * @param current 当前目标字符
 * @returns 高亮布局的HTML字符串
 */
export function generateKeyboardLayout(
  layout: string,
  current: string
): { char: string; isCurrent: boolean }[] {
  return layout.split('').map(char => ({
    char,
    isCurrent: char.toLowerCase() === current.toLowerCase()
  }));
}
