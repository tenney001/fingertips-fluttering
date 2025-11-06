import { onMounted, onUnmounted, ref } from 'vue';
import { compareChars, normalizeKey, isValidInput } from '@/utils/charComparator';
import { useGameStore } from '@/stores/game';
import { useScoreStore } from '@/stores/score';
import { useConfigStore } from '@/stores/config';

/**
 * 键盘处理组合式函数
 */
export function useKeyboard() {
  const gameStore = useGameStore();
  const scoreStore = useScoreStore();
  const configStore = useConfigStore();
  const isListening = ref(false);
  const lastKeyTime = ref(0);

  /**
   * 处理按键事件
   */
  function handleKeyPress(event: KeyboardEvent) {
    // 支持快捷键操作
    if (handleShortcuts(event)) {
      return; // 快捷键已处理，退出
    }

    // 只有在游戏运行时才响应按键，准备阶段不响应
    if (!gameStore.isRunning || gameStore.isPreparing || !isListening.value) return;

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

  /**
   * 处理快捷键
   */
  function handleShortcuts(event: KeyboardEvent): boolean {
    // Enter键开始游戏
    if (event.key === 'Enter') {
      if (gameStore.canStart) {
        gameStore.startGame();
        event.preventDefault();
        return true;
      }
    }

    // 移除Space键暂停功能 - 游戏开始后不能暂停
    return false;
  }

  /**
   * 开始监听键盘
   */
  function startListening() {
    isListening.value = true;
    document.addEventListener('keydown', handleKeyPress);
  }

  /**
   * 停止监听键盘
   */
  function stopListening() {
    isListening.value = false;
    document.removeEventListener('keydown', handleKeyPress);
  }

  /**
   * 播放正确音效 - 使用Web Audio API生成
   */
  function playCorrectSound() {
    if (!configStore.soundEnabled) return;

    try {
      // 使用Web Audio API生成音效
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 正确音效 - 清脆的上扬音调
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.type = 'sine';
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // 静默处理
      console.log('Audio not supported');
    }
  }

  /**
   * 播放错误音效 - 使用Web Audio API生成
   */
  function playWrongSound() {
    if (!configStore.soundEnabled) return;

    try {
      // 使用Web Audio API生成音效
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 错误音效 - 低沉的下落音调
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.type = 'square';
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      // 静默处理
      console.log('Audio not supported');
    }
  }

  /**
   * 触发正确反馈动画
   */
  function triggerCorrectFeedback() {
    document.dispatchEvent(new CustomEvent('correct-feedback'));
  }

  /**
   * 触发错误反馈动画
   */
  function triggerWrongFeedback() {
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
