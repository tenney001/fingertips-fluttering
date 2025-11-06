import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GameState, GameStatus } from '@/types';
import { generateSequence, generateFromText, generateMixedSequence } from '@/utils/sequenceGenerator';
import { GAME_CONFIG } from '@/utils/config';

/**
 * 游戏状态管理 Store
 */
export const useGameStore = defineStore('game', () => {
  // State
  const status = ref<GameStatus>('idle');
  const sequence = ref<string[]>([]);
  const timeRemaining = ref(GAME_CONFIG.duration);
  const startTime = ref<number | null>(null);
  const endTime = ref<number | null>(null);
  const caseSensitive = ref(GAME_CONFIG.caseSensitive);
  const timerId = ref<number | null>(null);
  const preparationTime = ref(3); // 3秒准备倒计时
  const useImportedText = ref(GAME_CONFIG.useImportedText); // V1.1新增：是否使用导入文本
  const importedText = ref(GAME_CONFIG.importedText); // V1.1新增：导入的文本内容
  const mixedMode = ref(GAME_CONFIG.mixedMode); // V1.1新增：混合模式

  // Getters - 当前字母始终是序列第一个元素
  const currentChar = computed(() => sequence.value[0] || '');
  const progress = computed(() => {
    // 进度基于当前序列长度和已处理数量
    const total = 200; // 固定总长度
    const processed = (200 - sequence.value.length);
    return (processed / total) * 100;
  });
  const isRunning = computed(() => status.value === 'running');
  const canStart = computed(() => status.value === 'idle' || status.value === 'finished');
  const isPreparing = computed(() => status.value === 'preparing');

  /**
   * 根据当前模式生成序列
   */
  function generateCurrentSequence(): string[] {
    if (useImportedText.value && importedText.value) {
      if (mixedMode.value) {
        // 混合模式
        return generateMixedSequence(importedText.value, GAME_CONFIG.sequenceLength, caseSensitive.value);
      } else {
        // 纯文本模式
        const textSeq = generateFromText(importedText.value, caseSensitive.value);
        // 如果文本不足200字符，补充随机字母
        if (textSeq.length < GAME_CONFIG.sequenceLength) {
          const remaining = GAME_CONFIG.sequenceLength - textSeq.length;
          const randomSeq = generateSequence(remaining, caseSensitive.value);
          return [...textSeq, ...randomSeq];
        }
        return textSeq;
      }
    }
    // 默认随机模式
    return generateSequence(GAME_CONFIG.sequenceLength, caseSensitive.value);
  }

  // Actions
  /**
   * 初始化游戏
   */
  function initializeGame() {
    sequence.value = generateCurrentSequence();
    timeRemaining.value = GAME_CONFIG.duration;
    status.value = 'idle';
  }

  /**
   * 开始游戏 - 添加3秒准备倒计时
   */
  function startGame() {
    if (!canStart.value) return;

    // 设置准备状态
    status.value = 'preparing';
    preparationTime.value = 3;
    sequence.value = generateCurrentSequence();
    timeRemaining.value = GAME_CONFIG.duration;

    // 3秒倒计时准备阶段
    const prepInterval = setInterval(() => {
      preparationTime.value--;
      if (preparationTime.value <= 0) {
        clearInterval(prepInterval);
        // 准备阶段结束，开始正式游戏
        status.value = 'running';
        startTime.value = Date.now();
        startTimer();
      }
    }, 1000);
  }

  /**
   * 暂停游戏
   */
  function pauseGame() {
    if (status.value !== 'running') return;
    status.value = 'paused';
    stopTimer();
  }

  /**
   * 继续游戏
   */
  function resumeGame() {
    if (status.value !== 'paused') return;
    status.value = 'running';
    startTimer();
  }

  /**
   * 结束游戏
   */
  function endGame() {
    status.value = 'finished';
    endTime.value = Date.now();
    stopTimer();
  }

  /**
   * 重新开始游戏
   */
  function restartGame() {
    stopTimer();
    initializeGame();
    startGame();
  }

  /**
   * 启动定时器
   */
  function startTimer() {
    stopTimer();
    timerId.value = window.setInterval(() => {
      timeRemaining.value--;
      if (timeRemaining.value <= 0) {
        endGame();
      }
    }, 1000);
  }

  /**
   * 停止定时器
   */
  function stopTimer() {
    if (timerId.value) {
      clearInterval(timerId.value);
      timerId.value = null;
    }
  }

  /**
   * 推进序列 - 队列出栈模式
   * 正确按键后，第一个字母出队，新字母入队到末尾
   */
  function advanceSequence() {
    if (sequence.value.length === 0) return;

    // 移除第一个字母（已完成的）
    sequence.value.shift();

    // 添加一个新字母到末尾，保持队列长度
    if (sequence.value.length < GAME_CONFIG.sequenceLength) {
      const newSequence = generateSequence(1, caseSensitive.value);
      sequence.value.push(newSequence[0]);
    }
  }

  /**
   * 更新大小写敏感配置
   * @param enabled 是否启用大小写敏感
   */
  function updateCaseSensitivity(enabled: boolean) {
    caseSensitive.value = enabled;
    // 如果游戏未开始，重新生成序列
    if (status.value === 'idle' || status.value === 'finished') {
      sequence.value = generateCurrentSequence();
    }
  }

  /**
   * 导入文本内容（V1.1新增）
   * @param text 文本内容
   * @param mode 模式：'text-only' 或 'mixed'
   */
  function importTextContent(text: string, mode: 'text-only' | 'mixed') {
    importedText.value = text;
    useImportedText.value = true;
    mixedMode.value = mode === 'mixed';
    // 如果游戏未开始，重新生成序列
    if (status.value === 'idle' || status.value === 'finished') {
      sequence.value = generateCurrentSequence();
    }
  }

  /**
   * 清除导入文本，恢复随机模式（V1.1新增）
   */
  function clearImportedText() {
    importedText.value = '';
    useImportedText.value = false;
    mixedMode.value = false;
    // 如果游戏未开始，重新生成序列
    if (status.value === 'idle' || status.value === 'finished') {
      sequence.value = generateCurrentSequence();
    }
  }

  return {
    // State
    status,
    sequence,
    timeRemaining,
    caseSensitive,
    preparationTime,
    useImportedText,
    importedText,
    mixedMode,
    // Getters
    currentChar,
    progress,
    isRunning,
    canStart,
    isPreparing,
    // Actions
    initializeGame,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    restartGame,
    advanceSequence,
    updateCaseSensitivity,
    importTextContent,
    clearImportedText
  };
});
