# E2E 测试说明

## 概述

本项目使用 **Puppeteer** 和 **Jest** 进行端到端自动化测试，验证打字应用的所有核心功能。

## 测试框架

- **Puppeteer**: 浏览器自动化工具，模拟真实用户操作
- **Jest**: JavaScript 测试框架
- **TypeScript**: 类型安全的测试编写

## 测试覆盖范围

### ✅ 已实现的测试用例

1. **页面加载测试**
   - 检查页面标题
   - 验证主要UI元素（标题、序列显示、虚拟键盘、按钮）

2. **游戏启动测试**
   - 点击开始按钮启动游戏
   - 验证游戏状态变化
   - 检查虚拟键盘启用

3. **键盘输入测试**
   - 测试正确按键响应
   - 验证分数系统更新
   - 检查字符序列推进

4. **虚拟键盘高亮测试**
   - 验证当前目标键位高亮
   - 检查高亮指示器（✨）显示
   - 确认高亮跟随当前字符

5. **快捷键测试**
   - Enter键启动游戏
   - 验证快捷键响应

6. **设置弹窗测试**
   - 打开/关闭设置弹窗
   - 验证设置项显示

7. **计分系统测试**
   - 正确输入加分
   - 准确率计算
   - 分数实时更新

8. **虚拟键盘布局测试**
   - 验证QWERTY三行布局
   - 检查空格键位置和样式
   - 确认所有键位正确显示

9. **空格键功能测试**
   - 测试空格键输入响应
   - 验证空格字符显示（␣）
   - 分数变化验证

## 运行测试

### 前置要求

确保开发服务器已启动：

```bash
npm run dev
```

测试将访问 `http://localhost:3001`

### 运行所有E2E测试

```bash
npm run test:e2e
```

### 监听模式（开发时使用）

```bash
npm run test:e2e:watch
```

### 运行特定测试

```bash
# 运行特定测试文件
npx jest --config jest.config.ts tests/e2e/game.test.ts

# 运行特定测试用例
npx jest --config jest.config.ts --testNamePattern="页面应该正确加载"
```

## 测试输出示例

```
PASS  tests/e2e/game.test.ts
  指尖飞舞 - 打字游戏 E2E 测试
    ✓ 页面应该正确加载 (1500ms)
    ✓ 游戏应该可以正常开始 (2100ms)
    ✓ 键盘输入应该正确响应 (800ms)
    ✓ 虚拟键盘高亮应该正确显示 (1200ms)
    ✓ Enter键快捷键应该可以开始游戏 (900ms)
    ✓ 设置弹窗应该可以正常打开和关闭 (600ms)
    ✓ 计分系统应该正常工作 (1500ms)
    ✓ 虚拟键盘布局应该正确 (300ms)
    ✓ 空格键功能测试 (1200ms)

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

## 配置文件

### jest.config.ts
- 测试超时设置：30秒
- 测试文件匹配：`tests/**/*.test.ts`
- TypeScript转换配置

### tests/setup.ts
- 全局测试环境配置
- 自定义Expect匹配器
- 生命周期钩子

## 测试最佳实践

### 1. 测试独立性
- 每个测试用例独立运行
- 使用 `beforeEach` 初始化页面
- 使用 `afterEach` 清理资源

### 2. 等待策略
- 使用 `page.waitForSelector` 等待元素
- 使用 `page.waitForFunction` 等待条件
- 适当添加 `page.waitForTimeout` 延迟

### 3. 选择器优化
- 使用语义化选择器（`.class`, `#id`）
- 避免脆弱的XPath选择器
- 优先使用data-testid（推荐添加）

### 4. 错误处理
- 添加详细console.log输出
- 使用try-catch包装异步操作
- 设置合理的超时时间

## 添加新测试

### 创建测试文件

在 `tests/e2e/` 目录下创建新的测试文件：

```typescript
import puppeteer from 'puppeteer';

describe('新功能测试', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: 'new' });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3001');
  });

  test('测试用例描述', async () => {
    // 测试逻辑
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });
});
```

### 添加data-testid属性（推荐）

为UI元素添加测试ID，方便选择器使用：

```vue
<template>
  <div data-testid="game-board">
    <button data-testid="start-button">开始</button>
  </div>
</template>
```

使用时：

```typescript
await page.click('[data-testid="start-button"]');
```

## 常见问题

### Q: 测试运行失败，提示连接被拒绝

**A:** 确保开发服务器已启动：
```bash
npm run dev
```

### Q: 测试超时

**A:** 增加超时时间或检查网络条件：
```typescript
test('超时测试', async () => {
  // 代码
}, 60000); // 60秒
```

### Q: 元素未找到

**A:** 检查选择器是否正确，确保元素已渲染：
```typescript
await page.waitForSelector('.your-selector', { timeout: 5000 });
```

## 持续集成

可以将E2E测试集成到CI/CD流程中：

```yaml
# GitHub Actions 示例
- name: Run E2E Tests
  run: |
    npm run build
    npm run dev &
    sleep 5
    npm run test:e2e
```

## 参考资源

- [Puppeteer 官方文档](https://pptr.dev/)
- [Jest 官方文档](https://jestjs.io/)
- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)

---

**注意**: E2E测试需要实际的浏览器环境，建议在本地开发时定期运行以确保应用质量。
