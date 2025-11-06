import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ScoreState } from '@/types';
import { GAME_CONFIG } from '@/utils/config';

/**
 * 计分状态管理 Store
 */
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

  // 从 localStorage 初始化最高分
  highScore.value = loadHighScore();

  // Actions
  /**
   * 记录正确按键
   */
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

  /**
   * 记录错误按键
   */
  function recordWrong() {
    wrongCount.value++;
    combo.value = 0;
    currentScore.value = Math.max(0, currentScore.value + GAME_CONFIG.scoreWrong);
  }

  /**
   * 检查是否创造新记录
   */
  function checkHighScore() {
    if (currentScore.value > highScore.value) {
      highScore.value = currentScore.value;
      saveHighScore(highScore.value);
    }
  }

  /**
   * 重置计分
   */
  function reset() {
    currentScore.value = 0;
    correctCount.value = 0;
    wrongCount.value = 0;
    combo.value = 0;
    comboMax.value = 0;
  }

  /**
   * 保存最高分到 localStorage
   * @param score 最高分
   */
  function saveHighScore(score: number) {
    localStorage.setItem('typingGameHighScore', score.toString());
  }

  /**
   * 从 localStorage 加载最高分
   * @returns 最高分
   */
  function loadHighScore(): number {
    const saved = localStorage.getItem('typingGameHighScore');
    return saved ? parseInt(saved) : 0;
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
    reset,
    saveHighScore,
    loadHighScore
  };
});
