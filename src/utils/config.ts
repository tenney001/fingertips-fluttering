import type { GameConfig } from '@/types';

export const GAME_CONFIG: GameConfig = {
  duration: 120,
  scoreCorrect: 10,
  scoreWrong: -5,
  sequenceLength: 200,  // 增加序列长度，避免中途补充
  caseSensitive: false,  // 默认忽略大小写
  soundEnabled: true,
  useImportedText: false,  // V1.1新增：默认使用随机模式
  importedText: '',  // V1.1新增：导入的文本内容
  mixedMode: false  // V1.1新增：默认不使用混合模式
};

// 配置默认值
export const DEFAULT_CONFIG: Partial<GameConfig> = {
  caseSensitive: false,
  soundEnabled: true,
  useImportedText: false,
  importedText: '',
  mixedMode: false
};
