<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>📝 导入文本内容</h2>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="modal-body">
        <p class="description">
          可以上传.txt/.md文件或直接粘贴文本内容进行打字练习。文本将转换为字母序列（保留空格）。
        </p>

        <!-- 文件上传区域 -->
        <div class="upload-section">
          <h3>方式一：上传文件</h3>
          <div
            class="file-drop-zone"
            :class="{ 'dragover': isDragOver }"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop="handleFileDrop"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".txt,.md,.text"
              style="display: none"
              @change="handleFileSelect"
            />
            <div class="drop-content">
              <span class="icon">📁</span>
              <p>拖拽文件到此处，或</p>
              <button class="btn-secondary" @click="triggerFileSelect">
                点击选择文件
              </button>
              <p class="hint">支持 .txt, .md, .text 格式</p>
            </div>
          </div>
        </div>

        <div class="divider">
          <span>或者</span>
        </div>

        <!-- 文本粘贴区域 -->
        <div class="paste-section">
          <h3>方式二：粘贴文本</h3>
          <textarea
            ref="textArea"
            v-model="importText"
            placeholder="在此粘贴你的文本内容..."
            class="text-input"
            rows="8"
          ></textarea>
        </div>

        <!-- 验证结果 -->
        <div v-if="validationMessage" class="validation-message" :class="{ 'error': !isValid, 'success': isValid }">
          {{ validationMessage }}
        </div>

        <!-- 文本预览 -->
        <div v-if="importText && isValid" class="preview-section">
          <h3>文本预览（前100个字符）</h3>
          <div class="preview-content">
            {{ importText.substring(0, 100) }}{{ importText.length > 100 ? '...' : '' }}
          </div>
          <div class="preview-stats">
            总长度：{{ importText.length }} 字符 |
            字母数：{{ letterCount }} |
            预计可生成：{{ Math.min(letterCount, 200) }} 个练习字符
          </div>
        </div>

        <!-- 模式选择 -->
        <div v-if="importText && isValid" class="mode-section">
          <h3>生成模式</h3>
          <div class="mode-options">
            <label class="mode-option">
              <input type="radio" v-model="mode" value="text-only" />
              <span class="mode-label">
                <strong>纯文本模式</strong>
                <small>仅使用导入的文本内容（如果文本不足200字符，将自动补充随机字母）</small>
              </span>
            </label>

            <label class="mode-option">
              <input type="radio" v-model="mode" value="mixed" />
              <span class="mode-label">
                <strong>混合模式</strong>
                <small>70% 文本内容 + 30% 随机字母，让练习更有挑战性</small>
              </span>
            </label>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="close">取消</button>
        <button
          class="btn-primary"
          :disabled="!isValid"
          @click="confirmImport"
        >
          开始导入
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { validateImportedText, readFileContent } from '@/utils/sequenceGenerator';

interface Props {
  show: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'import', text: string, mode: 'text-only' | 'mixed'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 响应式数据
const importText = ref('');
const isDragOver = ref(false);
const mode = ref<'text-only' | 'mixed'>('text-only');
const fileInput = ref<HTMLInputElement | null>(null);
const textArea = ref<HTMLTextAreaElement | null>(null);

// 验证结果
const validation = computed(() => validateImportedText(importText.value));
const isValid = computed(() => validation.value.valid);
const validationMessage = computed(() => validation.value.message);
const letterCount = computed(() => validation.value.letterCount);

// 关闭弹窗
function close() {
  resetForm();
  emit('close');
}

// 重置表单
function resetForm() {
  importText.value = '';
  mode.value = 'text-only';
  isDragOver.value = false;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

// 触发文件选择
function triggerFileSelect() {
  fileInput.value?.click();
}

// 处理文件选择
async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    await loadFile(file);
  }
}

// 处理文件拖拽
async function handleFileDrop(event: DragEvent) {
  isDragOver.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    await loadFile(file);
  }
}

// 加载文件
async function loadFile(file: File) {
  try {
    const content = await readFileContent(file);
    importText.value = content;

    // 自动聚焦到文本区域
    if (textArea.value) {
      textArea.value.focus();
    }
  } catch (error) {
    console.error('文件加载失败:', error);
    alert('文件读取失败，请重试');
  }
}

// 确认导入
function confirmImport() {
  if (!isValid.value || !importText.value.trim()) {
    return;
  }

  emit('import', importText.value, mode.value);
  close();
}

// 监听文本变化，自动聚焦
watch(() => props.show, (newShow) => {
  if (newShow && textArea.value) {
    setTimeout(() => textArea.value?.focus(), 100);
  }
});
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 20px 25px;
  border-bottom: 1px solid #E0E0E0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.5em;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 28px;
    color: #999;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background: #F0F0F0;
      color: #666;
    }
  }
}

.modal-body {
  padding: 25px;
  overflow-y: auto;
  flex: 1;

  .description {
    background: #F5F7FA;
    padding: 12px 15px;
    border-radius: 6px;
    color: #666;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  h3 {
    font-size: 1.1em;
    margin: 0 0 12px 0;
    color: #4A90E2;
  }
}

// 文件上传区域
.upload-section {
  margin-bottom: 20px;
}

.file-drop-zone {
  border: 2px dashed #D0D0D0;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;

  &.dragover {
    border-color: #4A90E2;
    background: #F0F7FF;
  }

  .drop-content {
    .icon {
      font-size: 48px;
      display: block;
      margin-bottom: 10px;
    }

    p {
      margin: 8px 0;
      color: #666;
    }

    .hint {
      font-size: 0.85em;
      color: #999;
    }
  }
}

// 分隔线
.divider {
  text-align: center;
  margin: 25px 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #E0E0E0;
  }

  span {
    background: white;
    padding: 0 20px;
    color: #999;
    position: relative;
    z-index: 1;
  }
}

// 文本输入区域
.paste-section {
  margin-bottom: 20px;

  .text-input {
    width: 100%;
    padding: 15px;
    border: 2px solid #E0E0E0;
    border-radius: 8px;
    font-size: 1em;
    font-family: 'Courier New', monospace;
    resize: vertical;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #4A90E2;
    }
  }
}

// 验证消息
.validation-message {
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 0.95em;

  &.success {
    background: #E8F5E9;
    color: #2E7D32;
    border: 1px solid #A5D6A7;
  }

  &.error {
    background: #FFEBEE;
    color: #C62828;
    border: 1px solid #EF9A9A;
  }
}

// 预览区域
.preview-section {
  background: #F5F7FA;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;

  .preview-content {
    background: white;
    padding: 12px;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
    font-size: 0.95em;
    margin-bottom: 10px;
    border: 1px solid #E0E0E0;
  }

  .preview-stats {
    font-size: 0.9em;
    color: #666;
    text-align: center;
  }
}

// 模式选择
.mode-section {
  margin-bottom: 20px;

  .mode-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mode-option {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    border: 2px solid #E0E0E0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #4A90E2;
    }

    input[type="radio"] {
      margin-top: 4px;
      cursor: pointer;
    }

    .mode-label {
      flex: 1;
      cursor: pointer;

      strong {
        display: block;
        color: #333;
        margin-bottom: 4px;
      }

      small {
        display: block;
        color: #666;
        line-height: 1.5;
      }
    }
  }
}

.modal-footer {
  padding: 20px 25px;
  border-top: 1px solid #E0E0E0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-primary {
  background: #4A90E2;
  color: white;

  &:hover:not(:disabled) {
    background: #357ABD;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #D0D0D0;

  &:hover {
    background: #F0F0F0;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
