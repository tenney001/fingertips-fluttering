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

  // ========== 音效性能优化 - 方案一 ==========
  // 1. 复用 AudioContext（只创建一次）
  let audioContext: AudioContext | null = null;
  const getAudioContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
  };

  // 2. 音效节流（50ms）
  const SOUND_THROTTLE = 50; // 最小间隔50ms
  let lastSoundTime = 0;

  // 3. 活跃音频节点跟踪（避免内存泄漏）
  const activeOscillators: OscillatorNode[] = [];

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
   * 优化：复用AudioContext + 节流机制
   */
  function playCorrectSound() {
    if (!configStore.soundEnabled) return;

    // 音效节流 - 防止频繁触发
    const now = Date.now();
    if (now - lastSoundTime < SOUND_THROTTLE) {
      return; // 跳过此次音效
    }
    lastSoundTime = now;

    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // 正确音效 - 清脆的上扬音调
      const duration = 0.08; // 缩短持续时间减少资源占用
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + duration);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.type = 'sine';
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);

      // 跟踪活跃节点，释放资源
      activeOscillators.push(oscillator);
      oscillator.addEventListener('ended', () => {
        const index = activeOscillators.indexOf(oscillator);
        if (index > -1) {
          activeOscillators.splice(index, 1);
        }
      });
    } catch (e) {
      // 静默处理
      console.log('Audio not supported');
    }
  }

  /**
   * 播放错误音效 - 使用Web Audio API生成
   * 优化：复用AudioContext + 节流机制
   */
  function playWrongSound() {
    if (!configStore.soundEnabled) return;

    // 音效节流 - 防止频繁触发
    const now = Date.now();
    if (now - lastSoundTime < SOUND_THROTTLE) {
      return; // 跳过此次音效
    }
    lastSoundTime = now;

    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // 错误音效 - 低沉的下落音调
      const duration = 0.15; // 缩短持续时间减少资源占用
      oscillator.frequency.setValueAtTime(400, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.type = 'square';
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);

      // 跟踪活跃节点，释放资源
      activeOscillators.push(oscillator);
      oscillator.addEventListener('ended', () => {
        const index = activeOscillators.indexOf(oscillator);
        if (index > -1) {
          activeOscillators.splice(index, 1);
        }
      });
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
    // 清理音频资源
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    activeOscillators.length = 0;
  });

  return {
    isListening,
    startListening,
    stopListening
  };
}
