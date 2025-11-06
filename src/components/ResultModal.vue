<template>
  <!-- 结果弹窗 -->
  <div class="result-modal-overlay" v-if="gameStore.status === 'finished'">
    <div class="result-modal">
      <!-- 撒花特效背景 -->
      <div class="confetti-container">
        <div
          v-for="i in 50"
          :key="i"
          class="confetti-piece"
          :style="getConfettiStyle(i)"
        >
          {{ confettiEmojis[i % confettiEmojis.length] }}
        </div>
      </div>

      <!-- 弹窗内容 -->
      <div class="modal-content">
        <h2 class="modal-title">🎉 练习完成！</h2>

        <!-- 统计信息 -->
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">总分</div>
            <div class="stat-value">{{ scoreStore.currentScore }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">正确数</div>
            <div class="stat-value correct">{{ scoreStore.correctCount }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">错误数</div>
            <div class="stat-value wrong">{{ scoreStore.wrongCount }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">准确率</div>
            <div class="stat-value">{{ scoreStore.accuracy }}%</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">WPM</div>
            <div class="stat-value">{{ scoreStore.wpm }}</div>
          </div>

          <div class="stat-item highlight">
            <div class="stat-label">最高分</div>
            <div class="stat-value">{{ scoreStore.highScore }}</div>
          </div>
        </div>

        <!-- 鼓励消息 -->
        <div class="encouragement">
          {{ getEncouragementMessage() }}
        </div>

        <!-- 操作按钮 -->
        <div class="modal-actions">
          <button @click="gameStore.initializeGame()" class="btn btn-primary">
            再玩一次
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import { useScoreStore } from '@/stores/score';

const gameStore = useGameStore();
const scoreStore = useScoreStore();

// 撒花表情符号
const confettiEmojis = ['🎉', '✨', '🎊', '🌟', '💫', '⭐', '🎈', '🎨'];

/**
 * 获取撒花特效样式
 */
function getConfettiStyle(_index: number) {
  const delay = Math.random() * 2;
  const duration = 3 + Math.random() * 2;
  const left = Math.random() * 100;
  const rotation = Math.random() * 360;
  const size = 1 + Math.random() * 0.5;

  return {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    left: `${left}%`,
    transform: `rotate(${rotation}deg) scale(${size})`,
    fontSize: `${20 + Math.random() * 20}px`
  };
}

/**
 * 获取鼓励消息
 */
function getEncouragementMessage(): string {
  const accuracy = scoreStore.accuracy;
  const wpm = scoreStore.wpm;

  if (accuracy >= 95 && wpm >= 40) {
    return '🌟 太棒了！你是真正的打字高手！';
  } else if (accuracy >= 90 && wpm >= 30) {
    return '🎯 表现优秀！继续保持！';
  } else if (accuracy >= 80 && wpm >= 20) {
    return '👍 做得不错！继续练习会更快！';
  } else if (accuracy >= 70) {
    return '💪 不错的开始！多练习会更好！';
  } else {
    return '🌱 继续加油！你会越来越棒的！';
  }
}
</script>

<style scoped lang="scss">
.result-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.result-modal {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease;
}

// 撒花特效容器
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  border-radius: 20px;
}

.confetti-piece {
  position: absolute;
  top: -50px;
  animation: confettiFall linear infinite;
  opacity: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

// 弹窗内容
.modal-content {
  position: relative;
  z-index: 1;
}

.modal-title {
  text-align: center;
  font-size: 2em;
  color: #4A90E2;
  margin: 0 0 30px 0;
  animation: bounce 1s ease infinite;
}

// 统计网格
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.stat-item {
  background: #F5F7FA;
  padding: 20px;
  border-radius: 12px;
  text-align: center;

  &.highlight {
    background: linear-gradient(135deg, #FFD93D 0%, #F5A623 100%);
    color: white;

    .stat-label,
    .stat-value {
      color: white;
    }
  }
}

.stat-label {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #4A90E2;

  &.correct {
    color: #7ED321;
  }

  &.wrong {
    color: #E85D5D;
  }
}

// 鼓励消息
.encouragement {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  font-size: 1.1em;
  margin-bottom: 25px;
  animation: glow 2s ease-in-out infinite;
}

// 操作按钮
.modal-actions {
  display: flex;
  justify-content: center;
}

.btn {
  padding: 12px 30px;
  font-size: 1.1em;
  font-weight: bold;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;

  &.btn-primary {
    background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
    }
  }
}

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes confettiFall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
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

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(102, 126, 234, 0.8);
  }
}

// 响应式
@media (max-width: 768px) {
  .result-modal {
    padding: 30px 20px;
  }

  .modal-title {
    font-size: 1.5em;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .stat-item {
    padding: 15px;
  }

  .stat-value {
    font-size: 1.5em;
  }

  .encouragement {
    font-size: 1em;
  }
}
</style>
