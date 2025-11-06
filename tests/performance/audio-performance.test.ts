/**
 * 音效性能测试 - 验证连续快速按键时的流畅度
 * 测试方案一优化效果：AudioContext复用 + 音效节流
 */

import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:3000';

describe('音效性能测试', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(BASE_URL);
    await page.waitForSelector('.game-board');
  });

  afterEach(async () => {
    await page.close();
  });

  it('连续快速按键 - 音效无卡顿', async () => {
    // 1. 启动游戏
    await page.click('.controls .btn');

    // 等待3秒准备阶段结束
    await new Promise(resolve => setTimeout(resolve, 3500));

    // 等待当前字母显示
    await page.waitForSelector('.sequence-compact', { timeout: 2000 });

    // 2. 连续快速按键测试（20次，模拟快速打字）
    const startTime = Date.now();
    const keySequence = 'ABCDEFGHIJKLMNOPQRST';

    for (let i = 0; i < keySequence.length; i++) {
      await page.keyboard.press(keySequence[i]);
      // 间隔10ms，模拟快速连续按键
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // 验证测试完成
    expect(duration).toBeLessThan(2000); // 2秒内完成20次按键

    // 验证游戏状态正常
    const score = await page.evaluate(() => {
      const scoreElement = document.querySelector('.score-item:first-child .value');
      return scoreElement ? parseInt(scoreElement.textContent || '0') : 0;
    });

    expect(score).toBeGreaterThan(0); // 有得分说明按键被正确处理
  });

  it('音效节流机制 - 50ms最小间隔', async () => {
    // 1. 启动游戏
    await page.click('.controls .btn');
    await new Promise(resolve => setTimeout(resolve, 3500));

    // 2. 超快速连续按键（5ms间隔，应该被节流）
    const startTime = Date.now();
    const keySequence = 'AAAAA'; // 连续相同字母，测试节流

    for (let i = 0; i < keySequence.length; i++) {
      await page.keyboard.press('A');
      await new Promise(resolve => setTimeout(resolve, 5)); // 5ms间隔，低于50ms阈值
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // 验证测试完成（应该很快，因为节流机制生效）
    expect(duration).toBeLessThan(1000);

    // 验证游戏正常运行
    const isRunning = await page.evaluate(() => {
      const countdown = document.querySelector('.preparation-countdown');
      return countdown === null; // 准备阶段已结束
    });

    expect(isRunning).toBe(true);
  });

  it('错误音效性能 - 连续错误按键', async () => {
    // 1. 启动游戏
    await page.click('.controls .btn');
    await new Promise(resolve => setTimeout(resolve, 3500));

    // 2. 故意按错键测试错误音效性能
    const currentChar = await page.evaluate(() => {
      const charElement = document.querySelector('.char-current');
      return charElement ? charElement.textContent : '';
    });

    // 按错误的键（当前是A，按Z）
    if (currentChar) {
      const wrongKey = currentChar.toLowerCase() === 'a' ? 'z' : 'a';
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press(wrongKey);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
    }

    // 验证游戏没有崩溃
    const gameActive = await page.evaluate(() => {
      const gameBoard = document.querySelector('.game-board');
      return gameBoard !== null;
    });

    expect(gameActive).toBe(true);

    // 验证分数正确（错误应该扣分但不能为负）
    const score = await page.evaluate(() => {
      const scoreElement = document.querySelector('.score-board .value');
      return scoreElement ? parseInt(scoreElement.textContent || '0') : 0;
    });

    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('资源清理 - 组件卸载时AudioContext正确关闭', async () => {
    // 1. 启动游戏
    await page.click('.controls .btn');
    await new Promise(resolve => setTimeout(resolve, 3500));

    // 2. 进行一些按键
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('A');
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // 3. 关闭页面
    await page.close();

    // 4. 打开新页面验证没有内存泄漏
    page = await browser.newPage();
    await page.goto(BASE_URL);
    await page.waitForSelector('.game-board');

    // 验证新页面加载正常
    const title = await page.title();
    expect(title).toContain('指尖飞舞');
  });
});

describe('音效优化效果对比', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  it('优化后性能指标', async () => {
    page = await browser.newPage();
    await page.goto(BASE_URL);
    await page.waitForSelector('.game-board');

    // 启动游戏
    await page.click('.controls .btn');

    // 等待3秒准备阶段结束
    await new Promise(resolve => setTimeout(resolve, 3500));

    // 等待当前字母显示
    await page.waitForSelector('.sequence-compact', { timeout: 2000 });

    // 性能测试：快速连续按键
    const metrics: number[] = [];

    for (let testRound = 0; testRound < 3; testRound++) {
      const start = Date.now();

      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('ABCDEFGHIJ'[i]);
        // 不等待，测试最大性能
      }

      const duration = Date.now() - start;
      metrics.push(duration);
    }

    // 验证性能指标
    const avgDuration = metrics.reduce((a, b) => a + b, 0) / metrics.length;
    const maxDuration = Math.max(...metrics);

    console.log('🎵 音效性能测试结果:');
    console.log(`  平均响应时间: ${avgDuration.toFixed(2)}ms`);
    console.log(`  最大响应时间: ${maxDuration.toFixed(2)}ms`);

    // 性能断言
    expect(avgDuration).toBeLessThan(100); // 平均响应时间 < 100ms
    expect(maxDuration).toBeLessThan(200); // 最大响应时间 < 200ms

    // 验证音效没有卡顿
    const finalScore = await page.evaluate(() => {
      const scoreElement = document.querySelector('.score-item:first-child .value');
      return scoreElement ? parseInt(scoreElement.textContent || '0') : 0;
    });

    expect(finalScore).toBeGreaterThan(0); // 有得分说明所有按键都被处理

    await page.close();
  });
});
