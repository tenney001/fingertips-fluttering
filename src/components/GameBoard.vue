<template>
  <div class="game-board">
    <!-- 顶部信息区 -->
    <header class="game-header">
      <h1 class="title">🌸 指尖飞舞</h1>
      <div class="header-actions">
        <button class="btn-settings" @click="showSettings = !showSettings">
          ⚙️ 设置
        </button>
        <div class="high-score">
          最高分: <span class="score">{{ scoreStore.highScore }}</span>
        </div>
      </div>
    </header>

    <!-- 设置弹窗 -->
    <div v-if="showSettings" class="settings-modal" @click.self="showSettings = false">
      <div class="settings-content">
        <ConfigPanel />
        <button class="btn-close" @click="showSettings = false">关闭</button>
      </div>
    </div>

    <!-- 分数和时间 -->
    <ScoreBoard />

    <!-- 字母序列 - 多行显示，最左侧高亮 -->
    <SequenceView />

    <!-- 虚拟键盘 - 优先显示 -->
    <VirtualKeyboard />

    <!-- 控制按钮 -->
    <div class="controls">
      <!-- 准备倒计时显示 -->
      <div v-if="gameStore.isPreparing" class="preparation-countdown">
        <h2 class="countdown-text">游戏将在 {{ gameStore.preparationTime }} 秒后开始</h2>
      </div>

      <button
        v-if="gameStore.canStart"
        @click="gameStore.startGame()"
        class="btn btn-primary"
      >
        {{ gameStore.status === 'idle' ? '开始练习 (Enter)' : '重新开始' }}
      </button>
      <!-- 游戏开始后隐藏暂停/继续按钮 -->
    </div>

    <!-- 结果弹窗 - 游戏结束时显示 -->
    <ResultModal />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '@/stores/game';
import { useScoreStore } from '@/stores/score';
import { useKeyboard } from '@/composables/useKeyboard';
import ScoreBoard from './ScoreBoard.vue';
import VirtualKeyboard from './VirtualKeyboard.vue';
import SequenceView from './SequenceView.vue';
import ResultModal from './ResultModal.vue';
import ConfigPanel from './ConfigPanel.vue';

const gameStore = useGameStore();
const scoreStore = useScoreStore();

// 启用键盘监听
useKeyboard();

// 设置弹窗状态
const showSettings = ref(false);

// 初始化游戏
gameStore.initializeGame();
</script>

<style scoped lang="scss">
.game-board {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #E8E8E8;

  .title {
    font-size: 2em;
    color: #4A90E2;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 20px;

    .btn-settings {
      padding: 8px 16px;
      background: #E8E8E8;
      border: none;
      border-radius: 20px;
      font-size: 1em;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #D0D0D0;
      }
    }

    .high-score {
      font-size: 1.1em;
      color: #666;

      .score {
        color: #F5A623;
        font-weight: bold;
        font-size: 1.3em;
      }
    }
  }
}

// 设置弹窗
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.settings-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  max-width: 400px;
  width: 90%;

  h3 {
    margin: 0 0 20px 0;
    color: #4A90E2;
    font-size: 1.3em;
  }
}

.setting-item {
  margin-bottom: 20px;

  label {
    display: flex;
    align-items: center;
    font-size: 1.1em;
    cursor: pointer;

    input[type="checkbox"] {
      margin-right: 10px;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }

  .hint {
    display: block;
    margin-top: 5px;
    margin-left: 30px;
    font-size: 0.9em;
    color: #666;
  }
}

.btn-close {
  width: 100%;
  padding: 10px;
  background: #4A90E2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #357ABD;
  }
}

.controls {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  height: 80px; // 固定高度，防止布局抖动
  justify-content: center; // 内容居中
}

// 准备倒计时样式
.preparation-countdown {
  padding: 20px 40px;
  background: linear-gradient(135deg, #FFD93D 0%, #F5A623 100%);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(245, 166, 35, 0.4);
  animation: glow 2s ease-in-out infinite;

  .countdown-text {
    margin: 0;
    font-size: 1.8em;
    color: white;
    font-weight: bold;
    text-align: center;
    animation: countdown-pulse 1s ease-in-out infinite;
  }
}

@keyframes countdown-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(255, 217, 61, 0.6);
  }
}

// 响应式
@media (max-width: 768px) {
  .game-board {
    padding: 15px;
  }

  .game-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;

    .title {
      font-size: 1.8em;
    }

    .header-actions {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>
