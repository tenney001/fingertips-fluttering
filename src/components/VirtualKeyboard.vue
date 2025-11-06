<template>
  <div class="virtual-keyboard">
    <!-- 键盘标签 -->
    <!-- <h3 class="keyboard-title">键位提示</h3>
    <p class="keyboard-hint">
      当前需要按: <span class="target-key">{{ currentChar || '点击开始游戏' }}</span>
    </p> -->

    <!-- 虚拟键盘网格 - 真实QWERTY布局 -->
    <div class="keyboard-layout">
      <!-- 第一行：q w e r t y u i o p -->
      <div class="keyboard-row">
        <button
          v-for="key in firstRow"
          :key="key"
          :class="getKeyClass(key)"
          :disabled="!gameStore.isRunning"
        >
          <span class="key-label">{{ key }}</span>
          <span
            v-if="key === currentChar.toLowerCase()"
            class="highlight-indicator"
          >
            ✨
          </span>
        </button>
      </div>

      <!-- 第二行：a s d f g h j k l -->
      <div class="keyboard-row">
        <button
          v-for="key in secondRow"
          :key="key"
          :class="getKeyClass(key)"
          :disabled="!gameStore.isRunning"
        >
          <span class="key-label">{{ key }}</span>
          <span
            v-if="key === currentChar.toLowerCase()"
            class="highlight-indicator"
          >
            ✨
          </span>
        </button>
      </div>

      <!-- 第三行：z x c v b n m -->
      <div class="keyboard-row keyboard-row-3">
        <button
          v-for="key in thirdRow"
          :key="key"
          :class="getKeyClass(key)"
          :disabled="!gameStore.isRunning"
        >
          <span class="key-label">{{ key }}</span>
          <span
            v-if="key === currentChar.toLowerCase()"
            class="highlight-indicator"
          >
            ✨
          </span>
        </button>
      </div>

      <!-- 空格键独立居中 -->
      <div class="keyboard-row keyboard-row-space">
        <button
          class="key key-space"
          :class="getKeyClass(' ')"
          :disabled="!gameStore.isRunning"
        >
          <span class="key-label space-label">空格</span>
          <span
            v-if="currentChar === ' '"
            class="highlight-indicator"
          >
            ✨
          </span>
        </button>
      </div>
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

// 真实QWERTY键盘布局 - 分行显示
const firstRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const secondRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const thirdRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

// 当前应按键位 (大小写不敏感)
const currentChar = computed(() => {
  const char = gameStore.currentChar;
  return char ? char.toLowerCase() : '';
});

/**
 * 获取键位的CSS类
 * @param key 键位字符
 * @returns CSS类名对象
 */
function getKeyClass(key: string) {
  return {
    'key': true,
    'key-current': key === currentChar.value,
    'key-space': key === ' ',
    'key-f': key === 'f',
    'key-j': key === 'j',
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

// 键盘布局容器
.keyboard-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px;
}

// 键盘行
.keyboard-row {
  display: flex;
  gap: 8px;
  justify-content: center;

  // 第一行有10个键
  &:nth-child(1) {
    padding-left: 20px; // 为Tab键位置留空
  }

  // 第二行有9个键，居中显示
  &:nth-child(2) {
    padding-left: 30px; // 为CapsLock键位置留空
  }

  // 第三行有7个字母键
  &.keyboard-row-3 {
    padding-left: 0px; // 为Shift键位置留空
  }

  // 空格键行独立居中
  &.keyboard-row-space {
    padding-left: 0;
    margin-top: 5px;
  }
}

// 单个键位
.key {
  position: relative;
  width: 45px;      // 固定宽度，形成正方形
  height: 45px;     // 固定高度，与宽度相等
  padding: 12px;    // 调整内边距适应正方形
  background: linear-gradient(to bottom, #F0F0F0, #E0E0E0);
  border: 2px solid #D0D0D0;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1.3em;
  color: #333;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;

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

  &.space-label {
    font-size: 0.9em;
  }
}

// 空格键样式
.key-space {
  min-width: 280px !important; // 加长空格键
  flex: 2; // 增加占比

  .key-label {
    font-size: 0.9em;
  }
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

// F和J键的标记线（模拟真实键盘）
.key-f::after,
.key-j::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: #333;
  border-radius: 1px;
}

// 响应式设计
@media (max-width: 768px) {
  .keyboard-row {
    gap: 6px;

    // 减少左边距
    &:nth-child(1) {
      padding-left: 15px;
    }

    &:nth-child(2) {
      padding-left: 25px;
    }

    &:nth-child(3) {
      padding-left: 40px;
    }
  }

  .key {
    width: 40px;   // 移动端稍微缩小
    height: 40px;
    padding: 10px;
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
  .keyboard-layout {
    gap: 6px;
    padding: 5px;
  }

  .keyboard-row {
    gap: 5px;

    &:nth-child(1) {
      padding-left: 10px;
    }

    &:nth-child(2) {
      padding-left: 18px;
    }

    &:nth-child(3) {
      padding-left: 30px;
    }
  }

  .key {
    width: 36px;   // 超小屏幕进一步缩小
    height: 36px;
    padding: 8px;
    font-size: 1em;
  }

  .key-space {
    min-width: 200px !important; // 调整空格键宽度（移动端）
  }
}
</style>
