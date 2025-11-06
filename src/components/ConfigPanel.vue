<template>
  <div class="config-panel">
    <h3>游戏设置</h3>

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
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/config';
import { useGameStore } from '@/stores/game';

const configStore = useConfigStore();
const gameStore = useGameStore();

/**
 * 处理大小写配置变化
 */
function onCaseSensitiveChange() {
  configStore.updateCaseSensitive(configStore.caseSensitive);
  gameStore.updateCaseSensitivity(configStore.caseSensitive);
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
