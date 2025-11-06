/**
 * 本地存储组合式函数
 */
export function useStorage() {
  const HIGH_SCORE_KEY = 'typingGameHighScore';
  const CONFIG_KEY = 'typingGameConfig';

  /**
   * 保存最高分
   * @param score 分数
   */
  function saveHighScore(score: number) {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  }

  /**
   * 加载最高分
   * @returns 最高分
   */
  function loadHighScore(): number {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved) : 0;
  }

  /**
   * 保存配置
   * @param config 配置对象
   */
  function saveConfig(config: Record<string, any>) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  /**
   * 加载配置
   * @returns 配置对象或null
   */
  function loadConfig(): Record<string, any> | null {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  /**
   * 清除所有数据
   */
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
