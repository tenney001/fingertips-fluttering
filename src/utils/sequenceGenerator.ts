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
  if (!text || text.trim().length === 0) {
    return generateSequence(GAME_CONFIG.sequenceLength, caseSensitive);
  }

  const sequence: string[] = [];
  const chars = text.split('');

  for (const char of chars) {
    // 保留字母
    if (/[a-zA-Z]/.test(char)) {
      // 保留原始大小写（不强制转换）
      // 仅在区分大小写模式下严格匹配，不区分时允许大小写都正确
      sequence.push(char);
    } else if (char === ' ' || char === '\n' || char === '\r') {
      // 保留空格和换行（转换为空格）
      sequence.push(' ');
    }
    // 跳过其他字符（标点符号、数字等）
  }

  return sequence;
}

/**
 * 验证导入的文本内容
 * @param text 输入文本
 * @returns 验证结果 { valid: boolean; message: string; letterCount: number }
 */
export function validateImportedText(text: string): { valid: boolean; message: string; letterCount: number } {
  if (!text || text.trim().length === 0) {
    return { valid: false, message: '文本内容不能为空', letterCount: 0 };
  }

  const letterCount = (text.match(/[a-zA-Z]/g) || []).length;

  if (letterCount < 10) {
    return {
      valid: false,
      message: `文本至少需要包含10个字母，当前只有${letterCount}个字母`,
      letterCount
    };
  }

  if (letterCount > 5000) {
    return {
      valid: false,
      message: `文本过长（${letterCount}个字母），建议不超过5000个字符`,
      letterCount
    };
  }

  return { valid: true, message: '文本验证通过', letterCount };
}

/**
 * 混合模式生成序列（70%导入文本 + 30%随机字母）
 * @param importedText 导入的文本
 * @param length 目标长度
 * @param caseSensitive 大小写配置
 * @returns 混合序列
 */
export function generateMixedSequence(
  importedText: string,
  length: number = GAME_CONFIG.sequenceLength,
  caseSensitive: boolean = GAME_CONFIG.caseSensitive
): string[] {
  const textSequence = generateFromText(importedText, caseSensitive);

  if (textSequence.length === 0) {
    return generateSequence(length, caseSensitive);
  }

  const result: string[] = [];
  let textIndex = 0;
  let randomIndex = 0;

  // 生成混合序列
  while (result.length < length) {
    // 70%概率使用导入文本
    if (Math.random() < 0.7 && textIndex < textSequence.length) {
      result.push(textSequence[textIndex]);
      textIndex++;
    } else {
      // 30%概率添加随机字母
      if (randomIndex === 0) {
        result.push(...generateSequence(1, caseSensitive));
        randomIndex = 3; // 每4个位置添加一个随机字符
      } else {
        randomIndex--;
      }
    }
  }

  return result;
}

/**
 * 从文件读取文本内容
 * @param file 文件对象
 * @returns Promise<string> 文件内容
 */
export function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsText(file, 'UTF-8');
  });
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
