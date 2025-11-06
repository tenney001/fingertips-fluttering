/**
 * 游戏状态类型定义
 */
export type GameStatus = 'idle' | 'preparing' | 'running' | 'paused' | 'finished';

/**
 * 游戏状态接口
 */
export interface GameState {
  status: GameStatus;
  sequence: string[];
  currentIndex: number;
  timeRemaining: number;
  startTime: number | null;
  endTime: number | null;
  caseSensitive: boolean;  // V1.0新增：大小写配置
  useImportedText: boolean;  // V1.1新增：是否使用导入文本
  importedText: string;  // V1.1新增：导入的文本内容
  mixedMode: boolean;  // V1.1新增：混合模式（文本+随机）
}

/**
 * 计分相关接口
 */
export interface ScoreState {
  currentScore: number;
  highScore: number;
  correctCount: number;
  wrongCount: number;
  combo: number;
  comboMax: number;
}

/**
 * 按键事件接口
 */
export interface KeyPressEvent {
  key: string;
  timestamp: number;
}

/**
 * 字符比较结果
 */
export interface ComparisonResult {
  isCorrect: boolean;
  expected: string;
  actual: string;
}

/**
 * 游戏配置接口
 */
export interface GameConfig {
  duration: number;
  scoreCorrect: number;
  scoreWrong: number;
  sequenceLength: number;
  caseSensitive: boolean;
  soundEnabled: boolean;
  useImportedText: boolean;  // V1.1新增：是否使用导入文本
  importedText: string;  // V1.1新增：导入的文本内容
  mixedMode: boolean;  // V1.1新增：混合模式（文本+随机）
}
