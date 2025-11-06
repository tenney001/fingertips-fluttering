<template>
  <div class="config-panel">
    <h3>游戏设置</h3>

    <!-- 文本导入区域 -->
    <div class="import-section">
      <div class="section-header">
        <h4>📝 文本导入</h4>
        <button
          v-if="!gameStore.useImportedText"
          class="btn-import"
          @click="showImportModal = true"
        >
          导入文本
        </button>
      </div>

      <div v-if="gameStore.useImportedText" class="imported-info">
        <div class="imported-badge">
          <span class="icon">✅</span>
          <span class="text">
            <strong>已导入文本</strong>
            <small v-if="gameStore.mixedMode">
              混合模式（文本+随机）
            </small>
            <small v-else>
              纯文本模式
            </small>
          </span>
        </div>
        <div class="import-actions">
          <button class="btn-text" @click="showImportModal = true">
            重新导入
          </button>
          <button class="btn-text danger" @click="onClearImportedText">
            清除
          </button>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="config-item">
      <label>
        <input
          type="checkbox"
          v-model="configStore.caseSensitive"
          @change="onCaseSensitiveChange"
        />
        区分大小写
      </label>
      <span class="hint">
        {{ configStore.caseSensitive ? '区分大小写 (A ≠ a)' : '忽略大小写 (A = a)' }}
      </span>
    </div>

    <div class="config-item">
      <label>
        <input
          type="checkbox"
          v-model="configStore.soundEnabled"
          @change="configStore.updateSoundEnabled"
        />
        启用音效
      </label>
    </div>

    <!-- 文本导入弹窗 -->
    <TextImportModal
      :show="showImportModal"
      @close="showImportModal = false"
      @import="onImportText"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useGameStore } from '@/stores/game';
import TextImportModal from './TextImportModal.vue';

const configStore = useConfigStore();
const gameStore = useGameStore();
const showImportModal = ref(false);

/**
 * 处理大小写配置变化
 */
function onCaseSensitiveChange() {
  configStore.updateCaseSensitive(configStore.caseSensitive);
  gameStore.updateCaseSensitivity(configStore.caseSensitive);
}

/**
 * 处理文本导入
 */
function onImportText(text: string, mode: 'text-only' | 'mixed') {
  gameStore.importTextContent(text, mode);
  showImportModal.value = false;
}

/**
 * 清除导入的文本
 */
function onClearImportedText() {
  if (confirm('确定要清除已导入的文本吗？将恢复随机字母模式。')) {
    gameStore.clearImportedText();
  }
}
</script>

<style scoped lang="scss">
.config-panel {
  background: #F5F7FA;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;

  h3 {
    margin: 0 0 15px 0;
    color: #4A90E2;
    font-size: 1.2em;
  }
}

// 文本导入区域
.import-section {
  margin-bottom: 20px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    h4 {
      margin: 0;
      color: #333;
      font-size: 1.1em;
    }
  }

  .btn-import {
    padding: 8px 16px;
    background: #4A90E2;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95em;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
      background: #357ABD;
    }
  }

  .imported-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 12px 15px;
    border-radius: 8px;
    border: 1px solid #E0E0E0;
  }

  .imported-badge {
    display: flex;
    align-items: center;
    gap: 10px;

    .icon {
      font-size: 20px;
    }

    .text {
      display: flex;
      flex-direction: column;

      strong {
        color: #333;
        font-size: 1em;
      }

      small {
        color: #666;
        font-size: 0.85em;
        margin-top: 2px;
      }
    }
  }

  .import-actions {
    display: flex;
    gap: 8px;
  }

  .btn-text {
    padding: 6px 12px;
    background: white;
    color: #4A90E2;
    border: 1px solid #4A90E2;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9em;
    transition: all 0.2s;

    &:hover {
      background: #F0F7FF;
    }

    &.danger {
      color: #D0021B;
      border-color: #D0021B;

      &:hover {
        background: #FFEBEE;
      }
    }
  }
}

.divider {
  height: 1px;
  background: #E0E0E0;
  margin: 20px 0;
}

.config-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1.1em;

    input[type="checkbox"] {
      margin-right: 10px;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }

  .hint {
    margin-left: 15px;
    font-size: 0.9em;
    color: #666;
  }
}
</style>
