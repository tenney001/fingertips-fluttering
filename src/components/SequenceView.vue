<template>
  <div class="sequence-view">
    <div class="sequence-header">
      <span class="sequence-label">待敲击字母:</span>
      <div class="sequence-container">
        <div class="sequence-compact">
          <span
            v-for="(char, index) in gameStore.sequence"
            :key="`${char}-${index}`"
            :class="{
              char: true,
              'char-current': index === 0,
              'char-before': index > 0
            }"
          >
            {{ char === ' ' ? '␣' : char }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();
</script>

<style scoped lang="scss">
.sequence-view {
  margin: 20px 0;
}

.sequence-header {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #F5F7FA;
  padding: 15px 200px;
  border-radius: 10px;
  overflow: hidden; // 隐藏滚动条
}

.sequence-label {
  font-size: 1.1em;
  color: #666;
  font-weight: bold;
  white-space: nowrap; // 标签不换行
  flex-shrink: 0; // 防止压缩
}

// 容器 - 固定高度，隐藏溢出
.sequence-container {
  flex: 1;
  overflow: hidden;
  height: 40px; // 固定高度
  display: flex;
  align-items: center;
}

// 序列内容 - 简洁显示，居中对齐
.sequence-compact {
  display: flex;
  gap: 1px; // 最小间距，最紧凑
  font-size: 1.2em; // 字体大小
  white-space: nowrap; // 不换行
  align-items: center;
}

.char {
  display: inline-block;
  min-width: 20px; // 最小宽度以保持对齐
  padding: 2px 1px; // 小量内边距
  text-align: center;
  border-radius: 3px;
  transition: all 0.2s ease;

  // 空格字符更明显
  &:empty::before {
    content: '␣';
    color: #999;
  }

  // 当前高亮的字符
  &.char-current {
    background: #FFD93D;
    animation: pulse 1s infinite;
    font-weight: bold;
  }

  // 已完成的字符
  &.char-before {
    opacity: 0.3; // 淡出已完成字符
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>
