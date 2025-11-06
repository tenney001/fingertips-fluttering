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

    <div class="score-item">
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

/**
 * 格式化时间显示
 * @param seconds 秒数
 * @returns MM:SS 格式的时间字符串
 */
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
