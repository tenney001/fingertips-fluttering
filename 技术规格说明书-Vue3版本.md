# 指尖飞舞 - Vue3技术规格说明书

## 文档信息
- **版本**: v1.0 (Vue3 + TypeScript + Vite)
- **创建日期**: 2024-11-06
- **技术栈**: Vue 3 + TypeScript + Vite + Pinia + SCSS
- **目标读者**: 前端开发工程师、架构师

---

## 1. 项目初始化

### 1.1 创建项目

```bash
# 使用Vite创建Vue3+TypeScript项目
npm create vite@latest fingertips-fluttering -- --template vue-ts

cd fingertips-fluttering

# 安装依赖
npm install

# 安装Vue生态相关包
npm install pinia

# 安装开发工具
npm install -D @vitejs/plugin-vue vue-tsc vite-plugin-pages vite-plugin-vue-layouts
```

### 1.2 package.json配置

```json
{
  "name": "fingertips-fluttering",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.7"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vue-tsc": "^1.8.27"
  }
}
```

### 1.3 vite.config.ts配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname
    }
  }
})
```

### 1.4 tsconfig.json配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 2. 项目架构设计

### 2.1 目录结构

```
src/
├── main.ts                 # 应用入口
├── App.vue                # 根组件
├── assets/                # 静态资源
│   ├── styles/
│   │   ├── _variables.scss # SCSS变量
│   │   ├── _mixins.scss   # 混合宏
│   │   └── main.scss      # 全局样式
│   └── sounds/            # 音效文件
│       ├── correct.mp3
│       └── wrong.mp3
├── components/            # Vue组件
│   ├── GameBoard.vue     # 游戏主面板
│   ├── ScoreBoard.vue    # 分数显示
│   ├── Timer.vue         # 倒计时
│   ├── SequenceView.vue  # 字母序列
│   ├── VirtualKeyboard.vue # 虚拟键盘
│   └── ConfigPanel.vue   # 配置面板 (大小写设置)
├── stores/                # Pinia状态管理
│   ├── game.ts           # 游戏状态Store
│   ├── score.ts          # 计分Store
│   └── config.ts         # 配置Store
├── composables/           # 组合式函数
│   ├── useGame.ts        # 游戏逻辑
│   ├── useKeyboard.ts    # 键盘处理
│   ├── useScore.ts       # 计分系统
│   └── useStorage.ts     # 本地存储
├── types/                 # TypeScript类型定义
│   ├── game.ts           # 游戏相关类型
│   ├── config.ts         # 配置相关类型
│   └── index.ts          # 公共类型
├── utils/                 # 工具函数
│   ├── config.ts         # 游戏配置
│   ├── sequenceGenerator.ts # 序列生成器
│   ├── charComparator.ts # 字符比较
│   └── helpers.ts        # 通用工具
├── language/              # 多语种模块 (V1.0预留)
│   ├── LanguageManager.ts
│   ├── configs/
│   │   └── english.ts
│   └── index.ts
└── public/                # 公共资源
```

### 2.2 架构说明

```
┌─────────────────────────────────────────┐
│              Vue 3 App                  │
├─────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐       │
│  │ Components  │ │   Stores    │       │
│  │   (Vue)     │ │   (Pinia)   │       │
│  └─────────────┘ └─────────────┘       │
├─────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐       │
│  │ Composables │ │   Utils     │       │
│  │  (Logic)    │ │ (Helpers)   │       │
│  └─────────────┘ └─────────────┘       │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │  LanguageManager (V1.0预留扩展)      ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│           Browser APIs                  │
│  - localStorage                         │
│  - Web Audio API                        │
│  - Keyboard Events                      │
└─────────────────────────────────────────┘
```

---

## 3. 类型定义 (types/)

### 3.1 游戏相关类型 (types/game.ts)

```typescript
// 游戏状态
export type GameStatus = 'idle' | 'running' | 'paused' | 'finished';

// 游戏状态接口
export interface GameState {
  status: GameStatus;
  sequence: string[];
  currentIndex: number;
  timeRemaining: number;
  startTime: number | null;
  endTime: number | null;
  caseSensitive: boolean;  // V1.0新增：大小写配置
}

// 计分相关接口
export interface ScoreState {
  currentScore: number;
  highScore: number;
  correctCount: number;
  wrongCount: number;
  combo: number;
  comboMax: number;
}

// 按键事件接口
export interface KeyPressEvent {
  key: string;
  timestamp: number;
}

// 字符比较结果
export interface ComparisonResult {
  isCorrect: boolean;
  expected: string;
  actual: string;
}

// 游戏配置接口
export interface GameConfig {
  duration: number;
  scoreCorrect: number;
  scoreWrong: number;
  sequenceLength: number;
  caseSensitive: boolean;
  soundEnabled: boolean;
}
```

### 3.2 配置类型 (types/config.ts)

```typescript
// 语言配置
export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  characters: string;
  keyboardLayout: string;
  fontFamily: string;
  textDirection: 'ltr' | 'rtl';
  caseSensitive: boolean;
}

// 用户配置
export interface UserConfig {
  language: 'english';
  caseSensitive: boolean;  // 大小写配置
  soundEnabled: boolean;
  autoStart: boolean;
  defaultDuration: number;
}
```

---

## 4. 工具函数 (utils/)

### 4.1 游戏配置 (utils/config.ts)

```typescript
import type { GameConfig } from '@/types';

export const GAME_CONFIG: GameConfig = {
  duration: 120,
  scoreCorrect: 10,
  scoreWrong: -5,
  sequenceLength: 50,
  caseSensitive: false,  // 默认忽略大小写
  soundEnabled: true
};

// 配置默认值
export const DEFAULT_CONFIG: Partial<GameConfig> = {
  caseSensitive: false,
  soundEnabled: true
};
```

### 4.2 序列生成器 (utils/sequenceGenerator.ts)

```typescript
import { GAME_CONFIG } from './config';
import type { LanguageConfig } from '@/types';

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

    // 生成随机字母
    const asciiCode = 97 + Math.floor(Math.random() * 26); // 'a' to 'z'
    char = String.fromCharCode(asciiCode);

    // 根据配置决定是否生成大写
    if (caseSensitive && Math.random() > 0.5) {
      char = char.toUpperCase();
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
```

### 4.3 字符比较器 (utils/charComparator.ts)

```typescript
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
```

---

## 5. Pinia状态管理 (stores/)

### 5.1 游戏状态Store (stores/game.ts)

```typescript
// stores/game.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GameState, GameStatus } from '@/types';
import { generateSequence } from '@/utils/sequenceGenerator';
import { GAME_CONFIG } from '@/utils/config';

export const useGameStore = defineStore('game', () => {
  // State
  const status = ref<GameStatus>('idle');
  const sequence = ref<string[]>([]);
  const currentIndex = ref(0);
  const timeRemaining = ref(GAME_CONFIG.duration);
  const startTime = ref<number | null>(null);
  const endTime = ref<number | null>(null);
  const caseSensitive = ref(GAME_CONFIG.caseSensitive);
  const timerId = ref<number | null>(null);

  // Getters
  const currentChar = computed(() => sequence.value[currentIndex.value] || '');
  const progress = computed(() => (currentIndex.value / sequence.value.length) * 100);
  const isRunning = computed(() => status.value === 'running');
  const canStart = computed(() => status.value === 'idle' || status.value === 'finished');

  // Actions
  function initializeGame() {
    sequence.value = generateSequence();
    currentIndex.value = 0;
    timeRemaining.value = GAME_CONFIG.duration;
    status.value = 'idle';
  }

  function startGame() {
    if (!canStart.value) return;

    status.value = 'running';
    startTime.value = Date.now();
    sequence.value = generateSequence(GAME_CONFIG.sequenceLength, caseSensitive.value);
    currentIndex.value = 0;
    timeRemaining.value = GAME_CONFIG.duration;

    startTimer();
  }

  function pauseGame() {
    if (status.value !== 'running') return;
    status.value = 'paused';
    stopTimer();
  }

  function resumeGame() {
    if (status.value !== 'paused') return;
    status.value = 'running';
    startTimer();
  }

  function endGame() {
    status.value = 'finished';
    endTime.value = Date.now();
    stopTimer();
  }

  function restartGame() {
    stopTimer();
    initializeGame();
    startGame();
  }

  function startTimer() {
    stopTimer();
    timerId.value = window.setInterval(() => {
      timeRemaining.value--;
      if (timeRemaining.value <= 0) {
        endGame();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerId.value) {
      clearInterval(timerId.value);
      timerId.value = null;
    }
  }

  function advanceSequence() {
    currentIndex.value++;
    if (currentIndex.value >= sequence.value.length) {
      // 生成新序列
      sequence.value = [...sequence.value.slice(1), ...generateSequence(1, caseSensitive.value)];
      currentIndex.value = 0;
    }
  }

  function updateCaseSensitivity(enabled: boolean) {
    caseSensitive.value = enabled;
    // 如果游戏未开始，重新生成序列
    if (status.value === 'idle' || status.value === 'finished') {
      sequence.value = generateSequence(GAME_CONFIG.sequenceLength, enabled);
    }
  }

  return {
    // State
    status,
    sequence,
    currentIndex,
    timeRemaining,
    caseSensitive,
    // Getters
    currentChar,
    progress,
    isRunning,
    canStart,
    // Actions
    initializeGame,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    restartGame,
    advanceSequence,
    updateCaseSensitivity
  };
});
```

### 5.2 计分Store (stores/score.ts)

```typescript
// stores/score.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ScoreState } from '@/types';
import { GAME_CONFIG } from '@/utils/config';
import { useStorage } from '@/composables/useStorage';

export const useScoreStore = defineStore('score', () => {
  // State
  const currentScore = ref(0);
  const highScore = ref(0);
  const correctCount = ref(0);
  const wrongCount = ref(0);
  const combo = ref(0);
  const comboMax = ref(0);

  // Getters
  const totalAttempts = computed(() => correctCount.value + wrongCount.value);
  const accuracy = computed(() => {
    if (totalAttempts.value === 0) return 100;
    return Math.round((correctCount.value / totalAttempts.value) * 100);
  });

  const wpm = computed(() => {
    // 简化版WPM计算
    const minutes = GAME_CONFIG.duration / 60;
    return Math.round(correctCount.value / 5 / minutes);
  });

  // Initialize from storage
  const { loadHighScore } = useStorage();
  highScore.value = loadHighScore();

  // Actions
  function recordCorrect() {
    correctCount.value++;
    combo.value++;
    comboMax.value = Math.max(comboMax.value, combo.value);

    let score = GAME_CONFIG.scoreCorrect;

    // 连击奖励
    if (combo.value >= 10) score += 20;
    if (combo.value >= 20) score += 50;
    if (combo.value >= 30) score += 100;

    currentScore.value += score;
    checkHighScore();
  }

  function recordWrong() {
    wrongCount.value++;
    combo.value = 0;
    currentScore.value = Math.max(0, currentScore.value + GAME_CONFIG.scoreWrong);
  }

  function checkHighScore() {
    if (currentScore.value > highScore.value) {
      highScore.value = currentScore.value;
      const { saveHighScore } = useStorage();
      saveHighScore(highScore.value);
    }
  }

  function reset() {
    currentScore.value = 0;
    correctCount.value = 0;
    wrongCount.value = 0;
    combo.value = 0;
    comboMax.value = 0;
  }

  return {
    // State
    currentScore,
    highScore,
    correctCount,
    wrongCount,
    combo,
    comboMax,
    // Getters
    totalAttempts,
    accuracy,
    wpm,
    // Actions
    recordCorrect,
    recordWrong,
    reset
  };
});
```

### 5.3 配置Store (stores/config.ts)

```typescript
// stores/config.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserConfig } from '@/types';

const DEFAULT_CONFIG: UserConfig = {
  language: 'english',
  caseSensitive: false,
  soundEnabled: true,
  autoStart: false,
  defaultDuration: 120
};

export const useConfigStore = defineStore('config', () => {
  // State
  const caseSensitive = ref(DEFAULT_CONFIG.caseSensitive);
  const soundEnabled = ref(DEFAULT_CONFIG.soundEnabled);
  const autoStart = ref(DEFAULT_CONFIG.autoStart);
  const defaultDuration = ref(DEFAULT_CONFIG.defaultDuration);

  // Actions
  function updateCaseSensitive(enabled: boolean) {
    caseSensitive.value = enabled;
    saveConfig();
  }

  function updateSoundEnabled(enabled: boolean) {
    soundEnabled.value = enabled;
    saveConfig();
  }

  function updateAutoStart(enabled: boolean) {
    autoStart.value = enabled;
    saveConfig();
  }

  function updateDefaultDuration(duration: number) {
    defaultDuration.value = duration;
    saveConfig();
  }

  function saveConfig() {
    const config: UserConfig = {
      language: 'english',
      caseSensitive: caseSensitive.value,
      soundEnabled: soundEnabled.value,
      autoStart: autoStart.value,
      defaultDuration: defaultDuration.value
    };
    localStorage.setItem('typingGameConfig', JSON.stringify(config));
  }

  function loadConfig() {
    const saved = localStorage.getItem('typingGameConfig');
    if (saved) {
      try {
        const config: UserConfig = JSON.parse(saved);
        caseSensitive.value = config.caseSensitive ?? DEFAULT_CONFIG.caseSensitive;
        soundEnabled.value = config.soundEnabled ?? DEFAULT_CONFIG.soundEnabled;
        autoStart.value = config.autoStart ?? DEFAULT_CONFIG.autoStart;
        defaultDuration.value = config.defaultDuration ?? DEFAULT_CONFIG.defaultDuration;
      } catch (e) {
        console.error('Failed to load config:', e);
      }
    }
  }

  return {
    // State
    caseSensitive,
    soundEnabled,
    autoStart,
    defaultDuration,
    // Actions
    updateCaseSensitive,
    updateSoundEnabled,
    updateAutoStart,
    updateDefaultDuration,
    saveConfig,
    loadConfig
  };
});
```

---

## 6. 组合式函数 (composables/)

### 6.1 键盘处理 (composables/useKeyboard.ts)

```typescript
// composables/useKeyboard.ts
import { onMounted, onUnmounted, ref } from 'vue';
import { compareChars, normalizeKey, isValidInput } from '@/utils/charComparator';
import { useGameStore } from '@/stores/game';
import { useScoreStore } from '@/stores/score';

export function useKeyboard() {
  const gameStore = useGameStore();
  const scoreStore = useScoreStore();
  const isListening = ref(false);
  const lastKeyTime = ref(0);

  function handleKeyPress(event: KeyboardEvent) {
    if (!gameStore.isRunning || !isListening.value) return;

    // 防止重复触发
    const now = Date.now();
    if (now - lastKeyTime.value < 30) return;
    lastKeyTime.value = now;

    const key = normalizeKey(event.key);

    // 检查是否为有效输入
    if (!isValidInput(key)) return;

    event.preventDefault();

    // 比较字符
    const isCorrect = compareChars(key, gameStore.currentChar, gameStore.caseSensitive);

    if (isCorrect) {
      scoreStore.recordCorrect();
      gameStore.advanceSequence();
      playCorrectSound();
      triggerCorrectFeedback();
    } else {
      scoreStore.recordWrong();
      playWrongSound();
      triggerWrongFeedback();
    }
  }

  function startListening() {
    isListening.value = true;
    document.addEventListener('keydown', handleKeyPress);
  }

  function stopListening() {
    isListening.value = false;
    document.removeEventListener('keydown', handleKeyPress);
  }

  // 音效播放
  function playCorrectSound() {
    if (!gameStore.soundEnabled) return;
    const audio = new Audio('/sounds/correct.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  function playWrongSound() {
    if (!gameStore.soundEnabled) return;
    const audio = new Audio('/sounds/wrong.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  // 视觉反馈
  function triggerCorrectFeedback() {
    // CSS动画触发逻辑
    document.dispatchEvent(new CustomEvent('correct-feedback'));
  }

  function triggerWrongFeedback() {
    // CSS动画触发逻辑
    document.dispatchEvent(new CustomEvent('wrong-feedback'));
  }

  onMounted(() => {
    startListening();
  });

  onUnmounted(() => {
    stopListening();
  });

  return {
    isListening,
    startListening,
    stopListening
  };
}
```

### 6.2 本地存储 (composables/useStorage.ts)

```typescript
// composables/useStorage.ts
export function useStorage() {
  const HIGH_SCORE_KEY = 'typingGameHighScore';
  const CONFIG_KEY = 'typingGameConfig';

  function saveHighScore(score: number) {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  }

  function loadHighScore(): number {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved) : 0;
  }

  function saveConfig(config: Record<string, any>) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  function loadConfig(): Record<string, any> | null {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  function clearAll() {
    localStorage.removeItem(HIGH_SCORE_KEY);
    localStorage.removeItem(CONFIG_KEY);
  }

  return {
    saveHighScore,
    loadHighScore,
    saveConfig,
    loadConfig,
    clearAll
  };
}
```

---

## 7. Vue组件 (components/)

### 7.1 游戏主面板 (components/GameBoard.vue)

```vue
<template>
  <div class="game-board">
    <!-- 顶部信息区 -->
    <header class="game-header">
      <h1 class="title">🌸 指尖飞舞</h1>
      <div class="high-score">
        最高分: <span class="score">{{ scoreStore.highScore }}</span>
      </div>
    </header>

    <!-- 配置面板 -->
    <ConfigPanel />

    <!-- 分数和时间 -->
    <ScoreBoard />

    <!-- 字母序列 -->
    <SequenceView />

    <!-- 虚拟键盘 -->
    <VirtualKeyboard />

    <!-- 控制按钮 -->
    <div class="controls">
      <button
        v-if="gameStore.canStart"
        @click="gameStore.startGame()"
        class="btn btn-primary"
      >
        {{ gameStore.status === 'idle' ? '开始练习' : '重新开始' }}
      </button>
      <button
        v-else-if="gameStore.isRunning"
        @click="gameStore.pauseGame()"
        class="btn btn-secondary"
      >
        暂停
      </button>
      <button
        v-else-if="gameStore.status === 'paused'"
        @click="gameStore.resumeGame()"
        class="btn btn-primary"
      >
        继续
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import { useScoreStore } from '@/stores/score';
import ScoreBoard from './ScoreBoard.vue';
import SequenceView from './SequenceView.vue';
import VirtualKeyboard from './VirtualKeyboard.vue';
import ConfigPanel from './ConfigPanel.vue';

const gameStore = useGameStore();
const scoreStore = useScoreStore();

// 初始化游戏
gameStore.initializeGame();
</script>

<style scoped lang="scss">
.game-board {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #E8E8E8;

  .title {
    font-size: 2.5em;
    color: #4A90E2;
    margin: 0;
  }

  .high-score {
    font-size: 1.2em;
    color: #666;

    .score {
      color: #F5A623;
      font-weight: bold;
      font-size: 1.4em;
    }
  }
}

.controls {
  margin-top: 30px;
  display: flex;
  gap: 15px;
  justify-content: center;
}
</style>
```

### 7.2 配置面板 (components/ConfigPanel.vue)

```vue
<template>
  <div class="config-panel">
    <h3>游戏设置</h3>

    <div class="config-item">
      <label>
        <input
          type="checkbox"
          v-model="configStore.caseSensitive"
          @change="onCaseSensitiveChange"
        />
        区分大小写
      </label>
      <span class="hint">
        {{ configStore.caseSensitive ? '区分大小写 (A ≠ a)' : '忽略大小写 (A = a)' }}
      </span>
    </div>

    <div class="config-item">
      <label>
        <input
          type="checkbox"
          v-model="configStore.soundEnabled"
          @change="configStore.updateSoundEnabled"
        />
        启用音效
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/config';
import { useGameStore } from '@/stores/game';

const configStore = useConfigStore();
const gameStore = useGameStore();

function onCaseSensitiveChange() {
  configStore.updateCaseSensitive(configStore.caseSensitive);
  gameStore.updateCaseSensitivity(configStore.caseSensitive);
}
</script>

<style scoped lang="scss">
.config-panel {
  background: #F5F7FA;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;

  h3 {
    margin: 0 0 15px 0;
    color: #4A90E2;
    font-size: 1.2em;
  }
}

.config-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1.1em;

    input[type="checkbox"] {
      margin-right: 10px;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }

  .hint {
    margin-left: 15px;
    font-size: 0.9em;
    color: #666;
  }
}
</style>
```

### 7.3 分数显示 (components/ScoreBoard.vue)

```vue
<template>
  <div class="score-board">
    <div class="score-item">
      <label>当前得分</label>
      <div class="value">{{ scoreStore.currentScore }}</div>
    </div>

    <div class="score-item">
      <label>剩余时间</label>
      <div class="value time" :class="{ warning: gameStore.timeRemaining <= 10 }">
        {{ formatTime(gameStore.timeRemaining) }}
      </div>
    </div>

    <div class="score-item">
      <label>准确率</label>
      <div class="value">{{ scoreStore.accuracy }}%</div>
    </div>

    <div class="score-item" v-if="scoreStore.combo > 0">
      <label>连击</label>
      <div class="value combo">{{ scoreStore.combo }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import { useScoreStore } from '@/stores/score';

const gameStore = useGameStore();
const scoreStore = useScoreStore();

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
</script>

<style scoped lang="scss">
.score-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.score-item {
  text-align: center;

  label {
    display: block;
    color: #666;
    font-size: 0.9em;
    margin-bottom: 8px;
  }

  .value {
    font-size: 2.5em;
    font-weight: bold;
    color: #4A90E2;

    &.time {
      &.warning {
        color: #D0021B;
        animation: pulse 1s infinite;
      }
    }

    &.combo {
      color: #F5A623;
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
```

### 7.4 字母序列显示 (components/SequenceView.vue)

```vue
<template>
  <div class="sequence-view">
    <div class="sequence-container">
      <div class="sequence">
        <span
          v-for="(char, index) in gameStore.sequence"
          :key="`${char}-${index}`"
          :class="getCharClass(index)"
        >
          {{ char }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();

function getCharClass(index: number) {
  return {
    'char': true,
    'char-current': index === gameStore.currentIndex,
    'char-completed': index < gameStore.currentIndex
  };
}
</script>

<style scoped lang="scss">
.sequence-view {
  margin: 30px 0;
}

.sequence-container {
  background: #F5F7FA;
  padding: 30px;
  border-radius: 10px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sequence {
  font-size: 2em;
  letter-spacing: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.char {
  display: inline-block;
  padding: 4px 8px;
  transition: all 0.2s ease;
  border-radius: 4px;

  &.char-current {
    background: #FFD93D;
    animation: pulse 1s infinite;
  }

  &.char-completed {
    opacity: 0.3;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>
```

### 7.5 虚拟键盘 (components/VirtualKeyboard.vue)

```vue
<template>
  <div class="virtual-keyboard">
    <!-- 键盘标签 -->
    <h3 class="keyboard-title">键位提示</h3>
    <p class="keyboard-hint">
      当前需要按: <span class="target-key">{{ currentChar || '点击开始游戏' }}</span>
    </p>

    <!-- 虚拟键盘网格 -->
    <div class="keyboard-grid">
      <button
        v-for="key in keyboardKeys"
        :key="key"
        :class="getKeyClass(key)"
        :disabled="!gameStore.isRunning"
      >
        <!-- 键位显示 -->
        <span class="key-label">{{ key }}</span>

        <!-- 当前高亮指示器 -->
        <span
          v-if="key === currentChar.toLowerCase()"
          class="highlight-indicator"
        >
          ✨
        </span>
      </button>
    </div>

    <!-- 辅助信息 -->
    <div class="keyboard-footer">
      <p class="footer-hint">
        💡 小贴士：看橙色高亮的键位，就是你现在要按的键！
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();

// 标准QWERTY键盘布局
const keyboardKeys = 'qwertyuiopasdfghjklzxcvbnm'.split('');

// 当前应按键位 (大小写不敏感)
const currentChar = computed(() => gameStore.currentChar.toLowerCase());

/**
 * 获取键位的CSS类
 * @param key 键位字符
 * @returns CSS类名对象
 */
function getKeyClass(key: string) {
  return {
    'key': true,
    'key-current': key === currentChar.value,
    'key-pressed': false  // V2.0可扩展：记录按键历史
  };
}
</script>

<style scoped lang="scss">
.virtual-keyboard {
  margin: 30px 0;
  padding: 20px;
  background: #F5F7FA;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

// 标题和提示
.keyboard-title {
  text-align: center;
  color: #4A90E2;
  font-size: 1.3em;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.keyboard-hint {
  text-align: center;
  color: #666;
  font-size: 1.1em;
  margin: 0 0 20px 0;

  .target-key {
    display: inline-block;
    padding: 4px 12px;
    background: #FFD93D;
    border-radius: 6px;
    font-weight: bold;
    color: #333;
    font-size: 1.3em;
    min-width: 40px;
    text-align: center;
  }
}

// 键盘网格布局
.keyboard-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;
  max-width: 650px;
  margin: 0 auto;
  padding: 10px;
}

// 单个键位
.key {
  position: relative;
  padding: 18px 12px;
  background: linear-gradient(to bottom, #F0F0F0, #E0E0E0);
  border: 2px solid #D0D0D0;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1.3em;
  color: #333;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;

  // 3D效果
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);

  // 悬停效果
  &:hover:not(:disabled) {
    background: linear-gradient(to bottom, #E8E8E8, #D8D8D8);
    transform: translateY(-2px);
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  // 按下效果
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.1),
      inset 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  // 当前应按键位高亮
  &.key-current {
    background: linear-gradient(to bottom, #F5A623, #E89512);
    border-color: #D8850A;
    color: white;
    transform: scale(1.2);
    z-index: 10;
    animation: pulse-glow 1.5s ease-in-out infinite;

    // 更强的阴影
    box-shadow:
      0 0 20px rgba(245, 166, 35, 0.8),
      0 4px 12px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);

    // 高亮指示器动画
    .highlight-indicator {
      animation: sparkle 1s ease-in-out infinite;
    }
  }

  // 游戏未开始时禁用
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

// 键位标签
.key-label {
  display: block;
  text-align: center;
}

// 高亮指示器 (✨ 符号)
.highlight-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 1.2em;
  pointer-events: none;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

// 底部提示
.keyboard-footer {
  margin-top: 20px;
  text-align: center;
}

.footer-hint {
  color: #7ED321;
  font-size: 0.95em;
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

// 动画效果
@keyframes pulse-glow {
  0%, 100% {
    box-shadow:
      0 0 20px rgba(245, 166, 35, 0.8),
      0 4px 12px rgba(0, 0, 0, 0.3);
  }
  50% {
    box-shadow:
      0 0 30px rgba(245, 166, 35, 1),
      0 6px 16px rgba(0, 0, 0, 0.4);
  }
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .keyboard-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
  }

  .key {
    padding: 15px 10px;
    font-size: 1.1em;
  }

  .keyboard-title {
    font-size: 1.1em;
  }

  .keyboard-hint {
    font-size: 1em;

    .target-key {
      font-size: 1.2em;
    }
  }
}

@media (max-width: 480px) {
  .keyboard-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 6px;
    padding: 5px;
  }

  .key {
    padding: 12px 8px;
    font-size: 1em;
  }
}
</style>
```

### 7.6 增强功能说明

**虚拟键盘核心价值 (针对8岁儿童设计):**

1. **视觉引导**
   - 橙色高亮当前应按键位
   - 闪烁动画吸引注意力
   - ✨ 符号强化视觉提示

2. **游戏化元素**
   - 3D按键效果 (立体感)
   - 悬停反馈 (hover效果)
   - 脉动光晕动画

3. **友好提示**
   - "当前需要按" 文字说明
   - 小贴士 (💡 图标)
   - 彩色目标键位背景

4. **响应式适配**
   - 手机端自动调整布局
   - 7列/6列网格自适应
   - 键位大小动态缩放

5. **无障碍支持**
   - 禁用状态清晰可见
   - 高对比度颜色
   - 大尺寸可点击区域

**为什么这些设计很重要？**
- 降低认知负担 - 小朋友只需看橙色高亮
- 提供即时反馈 - 每一步都有视觉引导
- 增强成就感 - 成功按键有奖励感
- 减少挫败感 - 清晰的提示避免盲目尝试

---

## 8. 根组件 (App.vue)

```vue
<template>
  <div id="app">
    <GameBoard />
  </div>
</template>

<script setup lang="ts">
import GameBoard from './components/GameBoard.vue';
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

#app {
  width: 100%;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &.btn-primary {
    background: #4A90E2;
    color: white;

    &:hover {
      background: #357ABD;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(74, 144, 226, 0.4);
    }
  }

  &.btn-secondary {
    background: #7ED321;
    color: white;

    &:hover {
      background: #6BB91C;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(126, 211, 33, 0.4);
    }
  }
}
</style>
```

---

## 9. 入口文件 (main.ts)

```typescript
// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/styles/main.scss';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
```

---

## 10. 样式系统 (SCSS)

### 10.1 变量文件 (assets/styles/_variables.scss)

```scss
// 颜色
$primary-color: #4A90E2;
$secondary-color: #7ED321;
$warning-color: #F5A623;
$error-color: #D0021B;
$background-light: #F5F7FA;
$text-dark: #333;
$text-light: #666;

// 间距
$spacing-xs: 5px;
$spacing-sm: 10px;
$spacing-md: 15px;
$spacing-lg: 20px;
$spacing-xl: 30px;

// 边框半径
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 10px;
$border-radius-xl: 20px;

// 阴影
$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
$shadow-md: 0 5px 15px rgba(0, 0, 0, 0.2);
$shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.3);

// 动画
$transition-fast: 0.2s ease;
$transition-normal: 0.3s ease;
$transition-slow: 0.5s ease;
```

### 10.2 混合宏 (assets/styles/_mixins.scss)

```scss
// 响应式断点
@mixin mobile {
  @media (max-width: 768px) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: 769px) and (max-width: 1024px) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: 1025px) {
    @content;
  }
}

// 按钮样式
@mixin button-style($bg-color, $hover-color) {
  background: $bg-color;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: all $transition-normal;

  &:hover {
    background: $hover-color;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
}

// 卡片样式
@mixin card-style {
  background: white;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-lg;
  padding: $spacing-xl;
}
```

### 10.3 全局样式 (assets/styles/main.scss)

```scss
@import './_variables.scss';
@import './_mixins.scss';

// 重置样式
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

// 根元素
html, body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// 通用类
.text-center {
  text-align: center;
}

.text-primary {
  color: $primary-color;
}

.text-warning {
  color: $warning-color;
}

.text-error {
  color: $error-color;
}

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

// 反馈动画
@keyframes correct-flash {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: $secondary-color;
    opacity: 0.3;
  }
  100% {
    background-color: transparent;
  }
}

@keyframes wrong-shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
```

---

## 11. 多语种架构 (language/)

### 11.1 语言管理器 (language/LanguageManager.ts)

```typescript
// language/LanguageManager.ts
import type { LanguageConfig } from '@/types';
import { ENGLISH_CONFIG } from './configs/english';

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

  getConfig(): LanguageConfig {
    return this.currentConfig;
  }

  // 切换语言
  switchLanguage(languageCode: string): boolean {
    try {
      this.currentConfig = this.loadConfig(languageCode);
      return true;
    } catch (e) {
      console.error('Failed to switch language:', e);
      return false;
    }
  }
}
```

### 11.2 英语配置 (language/configs/english.ts)

```typescript
// language/configs/english.ts
import type { LanguageConfig } from '@/types';

export const ENGLISH_CONFIG: LanguageConfig = {
  code: 'en',
  name: 'English',
  nativeName: 'English',
  characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  keyboardLayout: 'qwertyuiopasdfghjklzxcvbnm',
  fontFamily: 'Arial, sans-serif',
  textDirection: 'ltr',
  caseSensitive: false
};
```

---

## 12. 开发工具配置

### 12.1 VSCode推荐插件

```json
// .vscode/extensions.json
{
  "recommendations": [
    "vue.volar",
    "vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}
```

### 12.2 Prettier配置 (.prettierrc)

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

### 12.3 ESLint配置 (.eslintrc.cjs)

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
}
```

---

## 13. 构建与部署

### 13.1 开发模式

```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run type-check
```

### 13.2 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 13.3 Vite构建优化

```typescript
// vite.config.ts 优化配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'pinia']
  }
})
```

---

## 14. 性能优化建议

### 14.1 Vue3优化

1. **使用Composition API**
   - 更好的逻辑复用
   - 更小的打包体积
   - 更高效的响应式系统

2. **使用`defineComponent`类型提示**
   - 完整的TypeScript支持
   - 更好的IDE体验

3. **组件懒加载**
```typescript
// 路由懒加载
const GameBoard = () => import('@/components/GameBoard.vue');
```

### 14.2 Vite优化

1. **预构建优化**
```typescript
// vite.config.ts
optimizeDeps: {
  include: ['vue', 'pinia']
}
```

2. **分包策略**
```typescript
rollupOptions: {
  output: {
    manualChunks: {
      vendor: ['vue', 'pinia'],
      ui: ['@vue/runtime-dom']
    }
  }
}
```

### 14.3 内存优化

1. **及时清理定时器**
```typescript
// 在Pinia store中使用
import { onUnmounted } from 'vue';

function startTimer() {
  timerId.value = window.setInterval(() => {
    // ...
  }, 1000);

  onUnmounted(() => {
    if (timerId.value) {
      clearInterval(timerId.value);
    }
  });
}
```

2. **事件监听清理**
```typescript
// composables中使用onUnmounted
import { onMounted, onUnmounted } from 'vue';

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress);
});
```

---

## 15. 测试策略

### 15.1 单元测试 (Vitest)

```bash
npm install -D vitest @vue/test-utils
```

```typescript
// tests/composables/useGame.test.ts
import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGameStore } from '@/stores/game';

describe('useGame', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize game', () => {
    const gameStore = useGameStore();
    gameStore.initializeGame();

    expect(gameStore.status).toBe('idle');
    expect(gameStore.sequence.length).toBeGreaterThan(0);
  });

  it('should start game', () => {
    const gameStore = useGameStore();
    gameStore.initializeGame();
    gameStore.startGame();

    expect(gameStore.status).toBe('running');
  });
});
```

### 15.2 E2E测试 (Playwright)

```bash
npm install -D @playwright/test
```

```typescript
// tests/e2e/game.spec.ts
import { test, expect } from '@playwright/test';

test('game flow', async ({ page }) => {
  await page.goto('/');

  await page.click('text=开始练习');
  await page.keyboard.press('a');

  expect(await page.textContent('.score')).toContain('10');
});
```

---

## 16. 错误处理

### 16.1 全局错误捕获

```typescript
// main.ts
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info);
  // 发送到错误监控服务
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

### 16.2 Store错误处理

```typescript
// stores/game.ts
import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', () => {
  // ...

  function handleError(error: unknown) {
    console.error('Game error:', error);
    // 重置到安全状态
    status.value = 'idle';
    stopTimer();
  }

  // ...
});
```

---

## 17. 开发工作流

### 17.1 Git提交规范

```bash
# 功能开发
git commit -m "feat: add case sensitivity configuration"

# Bug修复
git commit -m "fix: resolve keyboard event handling issue"

# 文档更新
git commit -m "docs: update API documentation"
```

### 17.2 代码规范检查

```bash
# ESLint检查
npm run lint

# 自动修复
npm run lint -- --fix

# TypeScript类型检查
npm run type-check
```

---

## 18. 部署配置

### 18.1 GitHub Pages部署

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 18.2 Netlify部署

```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 总结

本技术规格说明书详细描述了基于**Vue3 + TypeScript + Vite**的技术实现方案，主要特点：

### ✅ 技术优势

1. **Vue3 Composition API**
   - 更好的逻辑复用
   - 完整的TypeScript支持
   - 更高效的响应式系统

2. **Pinia状态管理**
   - Vue3官方推荐
   - TypeScript原生支持
   - 极简API设计

3. **Vite构建工具**
   - 极速热更新
   - 优化的打包策略
   - 现代浏览器优化

4. **完整类型系统**
   - 编译时类型检查
   - 更好的IDE支持
   - 减少运行时错误

### 📦 项目结构

```
src/
├── components/    # Vue组件 (SFC)
├── stores/        # Pinia状态管理
├── composables/   # 组合式函数
├── types/         # TypeScript类型
├── utils/         # 工具函数
└── language/      # 多语种模块
```

### 🎯 V1.0核心功能

1. **虚拟键盘显示** - 完整QWERTY布局，**帮助小朋友熟悉键位位置**
2. **当前键位高亮** - 实时高亮应按键位，**引导小朋友正确操作**
3. **大小写配置** - 支持区分/忽略大小写
4. **完整游戏流程** - 开始→暂停→结束→重启
5. **实时反馈** - 分数、时间、准确率、连击
6. **本地存储** - 最高分持久化
7. **多语种架构** - 预留扩展8种语言

### 👶 儿童友好设计

**为什么虚拟键盘是P0核心？**
- 小朋友对键盘布局不熟悉
- 需要视觉引导确定按键位置
- 降低学习成本，提高成功率
- 增强练习信心和兴趣

### 🚀 性能优化

1. **分包策略** - vendor库独立打包
2. **懒加载** - 组件按需加载
3. **Tree Shaking** - 移除未使用代码
4. **预构建** - 优化依赖加载

### 📚 开发工具链

1. **Vite** - 开发服务器
2. **TypeScript** - 类型检查
3. **ESLint** - 代码规范
4. **Prettier** - 代码格式化
5. **Vitest** - 单元测试
6. **Playwright** - E2E测试

---

*技术规格版本: v1.0 (Vue3 + TypeScript + Vite)*
*最后更新: 2024-11-06*
*开发周期: 6天*
*状态: 可开始编码实现*
