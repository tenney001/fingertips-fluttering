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

/**
 * 用户配置管理 Store
 */
export const useConfigStore = defineStore('config', () => {
  // State
  const caseSensitive = ref(DEFAULT_CONFIG.caseSensitive);
  const soundEnabled = ref(DEFAULT_CONFIG.soundEnabled);
  const autoStart = ref(DEFAULT_CONFIG.autoStart);
  const defaultDuration = ref(DEFAULT_CONFIG.defaultDuration);

  // Actions
  /**
   * 更新大小写配置
   * @param enabled 是否启用大小写敏感
   */
  function updateCaseSensitive(enabled: boolean) {
    caseSensitive.value = enabled;
    saveConfig();
  }

  /**
   * 更新音效配置
   * @param enabled 是否启用音效
   */
  function updateSoundEnabled(enabled: boolean) {
    soundEnabled.value = enabled;
    saveConfig();
  }

  /**
   * 更新自动开始配置
   * @param enabled 是否启用自动开始
   */
  function updateAutoStart(enabled: boolean) {
    autoStart.value = enabled;
    saveConfig();
  }

  /**
   * 更新默认时长配置
   * @param duration 默认时长（秒）
   */
  function updateDefaultDuration(duration: number) {
    defaultDuration.value = duration;
    saveConfig();
  }

  /**
   * 保存配置到 localStorage
   */
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

  /**
   * 从 localStorage 加载配置
   */
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
