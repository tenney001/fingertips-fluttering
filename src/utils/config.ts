import type { GameConfig } from '@/types';

export const GAME_CONFIG: GameConfig = {
  duration: 120,
  scoreCorrect: 10,
  scoreWrong: -5,
  sequenceLength: 200,  // 增加序列长度，避免中途补充
  caseSensitive: false,  // 默认忽略大小写
  soundEnabled: true
};

// 配置默认值
export const DEFAULT_CONFIG: Partial<GameConfig> = {
  caseSensitive: false,
  soundEnabled: true
};
