import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:3002';

describe('指尖飞舞 - 打字游戏 E2E 测试', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  });

  afterEach(async () => {
    await page.close();
  });

  test('页面应该正确加载', async () => {
    // 检查标题
    const title = await page.title();
    console.log('页面标题:', title);

    // 检查游戏主界面元素
    const titleText = await page.$eval('h1', el => el.textContent);
    expect(titleText).toContain('指尖飞舞');

    const sequenceLabel = await page.$eval('.sequence-label', el => el.textContent);
    expect(sequenceLabel).toContain('待敲击字母');

    const keyboardFooter = await page.$eval('.keyboard-footer', el => el.textContent);
    expect(keyboardFooter).toContain('小贴士');

    const startButton = await page.$eval('.controls .btn', el => el.textContent);
    expect(startButton).toContain('开始练习');

    console.log('✓ 页面元素加载正确');
  });

  test('游戏应该可以正常开始', async () => {
    // 点击开始按钮
    await page.click('.controls .btn');

    // 等待3秒准备阶段结束
    await new Promise(resolve => setTimeout(resolve, 3500));

    // 等待游戏开始，时间倒计时
    await page.waitForFunction(
      () => {
        const timeElement = document.querySelector('.score-item:nth-child(2) .value.time');
        if (!timeElement) return false;
        const timeText = timeElement.textContent || '';
        // 等待时间从 02:00 开始倒计时
        return timeText.startsWith('02:') || timeText.startsWith('01:') || timeText.startsWith('00:');
      },
      { timeout: 2000 }
    );

    // 检查虚拟键盘是否启用
    const disabledButtons = await page.$$('.key[disabled]');
    const enabledButtons = await page.$$('.key:not([disabled])');

    expect(enabledButtons.length).toBeGreaterThan(0);
    console.log(`✓ 游戏启动成功，启用键位数量: ${enabledButtons.length}`);
  });

  test('键盘输入应该正确响应', async () => {
    // 开始游戏
    await page.click('.controls .btn');

    // 等待3秒准备阶段结束
    await new Promise(resolve => setTimeout(resolve, 3500));

    // 等待当前字母显示
    await page.waitForSelector('.sequence-compact', { timeout: 2000 });

    // 获取当前应该按的字母
    const currentChar = await page.evaluate(() => {
      const current = document.querySelector('.char-current');
      if (!current) return null;
      const char = current.textContent;
      // 将空格符号转换为实际空格
      return char === '␣' ? ' ' : char;
    });

    if (currentChar) {
      console.log('当前字母:', currentChar);

      // 记录输入前的分数
      const scoreBefore = await page.$eval('.score-item:first-child .value', el => parseInt(el.textContent || '0'));

      // 按下正确的键
      await page.keyboard.press(currentChar);

      // 等待分数更新
      await page.waitForFunction(
        (prevScore) => {
          const scoreElement = document.querySelector('.score-item:first-child .value');
          return scoreElement && parseInt(scoreElement.textContent || '0') > prevScore;
        },
        { timeout: 1000 },
        scoreBefore
      );

      console.log(`✓ 正确按键 '${currentChar}' 响应正常`);
    }
  });

  test('虚拟键盘高亮应该正确显示', async () => {
    // 开始游戏
    await page.click('.controls .btn');

    // 等待3秒准备阶段结束
    await new Promise(resolve => setTimeout(resolve, 3500));

    // 等待游戏开始
    await page.waitForFunction(
      () => document.querySelector('.key-current') !== null,
      { timeout: 2000 }
    );

    // 检查是否有高亮的键
    const highlightedKeys = await page.$$('.key-current');
    expect(highlightedKeys.length).toBeGreaterThan(0);

    // 检查高亮指示器
    const hasIndicator = await page.evaluate(() => {
      const indicator = document.querySelector('.key-current .highlight-indicator');
      return indicator !== null;
    });

    expect(hasIndicator).toBe(true);
    console.log(`✓ 虚拟键盘高亮正常，高亮键位数量: ${highlightedKeys.length}`);
  });

  test('Enter键快捷键应该可以开始游戏', async () => {
    // 刷新页面确保游戏未开始
    await page.reload({ waitUntil: 'networkidle2' });

    // 按Enter键
    await page.keyboard.press('Enter');

    // 等待3秒准备阶段结束
    await new Promise(resolve => setTimeout(resolve, 3500));

    // 检查游戏是否开始（时间倒计时）
    await page.waitForFunction(
      () => {
        const timeElement = document.querySelector('.score-item:nth-child(2) .value.time');
        if (!timeElement) return false;
        const timeText = timeElement.textContent || '';
        return timeText.startsWith('02:') || timeText.startsWith('01:') || timeText.startsWith('00:');
      },
      { timeout: 2000 }
    );

    console.log('✓ Enter键快捷键启动游戏成功');
  });

  test('设置弹窗应该可以正常打开和关闭', async () => {
    // 点击设置按钮
    await page.click('.btn-settings');

    // 检查设置弹窗是否打开
    await page.waitForSelector('.settings-modal', { timeout: 1000 });

    // 检查设置内容
    const hasSetting = await page.evaluate(() => {
      const modal = document.querySelector('.settings-modal');
      return modal && modal.textContent?.includes('区分大小写');
    });

    expect(hasSetting).toBe(true);
    console.log('✓ 设置弹窗打开成功');

    // 点击关闭
    await page.click('.btn-close');

    // 检查弹窗是否关闭
    await page.waitForFunction(
      () => document.querySelector('.settings-modal') === null,
      { timeout: 1000 }
    );

    console.log('✓ 设置弹窗关闭成功');
  });

  test('计分系统应该正常工作', async () => {
    // 开始游戏
    await page.click('.controls .btn');

    // 等待3秒准备阶段结束
    await new Promise(resolve => setTimeout(resolve, 3500));

    // 等待游戏开始
    await page.waitForSelector('.sequence-compact', { timeout: 2000 });

    // 连续正确输入几个字符
    for (let i = 0; i < 5; i++) {
      const currentChar = await page.evaluate(() => {
        const current = document.querySelector('.char-current');
        if (!current) return null;
        const char = current.textContent;
        // 将空格符号转换为实际空格
        return char === '␣' ? ' ' : char;
      });

      if (currentChar) {
        await page.keyboard.press(currentChar);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // 检查分数是否增加
    const score = await page.$eval('.score-item:first-child .value', el => parseInt(el.textContent || '0'));
    expect(score).toBeGreaterThan(0);

    // 检查准确率
    const accuracyText = await page.$eval('.score-item:nth-child(3) .value', el => el.textContent);
    const accuracy = parseFloat((accuracyText || '0').replace('%', ''));
    expect(accuracy).toBeGreaterThanOrEqual(0);

    console.log(`✓ 计分系统正常 - 分数: ${score}, 准确率: ${accuracy}%`);
  });

  test('虚拟键盘布局应该正确', async () => {
    // 检查第一行键位
    const firstRowKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
    for (const key of firstRowKeys) {
      const exists = await page.evaluate((k) => {
        const buttons = Array.from(document.querySelectorAll('.key-label'));
        return buttons.some(btn => btn.textContent === k);
      }, key);
      expect(exists).toBe(true);
    }

    // 检查第二行键位
    const secondRowKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
    for (const key of secondRowKeys) {
      const exists = await page.evaluate((k) => {
        const buttons = Array.from(document.querySelectorAll('.key-label'));
        return buttons.some(btn => btn.textContent === k);
      }, key);
      expect(exists).toBe(true);
    }

    // 检查第三行键位
    const thirdRowKeys = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
    for (const key of thirdRowKeys) {
      const exists = await page.evaluate((k) => {
        const buttons = Array.from(document.querySelectorAll('.key-label'));
        return buttons.some(btn => btn.textContent === k);
      }, key);
      expect(exists).toBe(true);
    }

    // 检查空格键
    const spaceKeyExists = await page.evaluate(() => {
      const spaceLabel = document.querySelector('.space-label');
      return spaceLabel && spaceLabel.textContent === '空格';
    });
    expect(spaceKeyExists).toBe(true);

    console.log('✓ 虚拟键盘布局正确 - QWERTY 3行 + 空格键');
  });

  test('空格键功能测试', async () => {
    // 开始游戏
    await page.click('.controls .btn');

    // 等待3秒准备阶段结束
    await new Promise(resolve => setTimeout(resolve, 3500));

    // 等待游戏开始
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 查找当前字符是否为空格
    const isCurrentCharSpace = await page.evaluate(() => {
      const currentChar = document.querySelector('.char-current');
      return currentChar && currentChar.textContent === '␣';
    });

    if (isCurrentCharSpace) {
      // 记录按空格前的分数
      const scoreBefore = await page.$eval('.score-item:first-child .value', el => parseInt(el.textContent || '0'));

      // 按空格键
      await page.keyboard.press(' ');

      await new Promise(resolve => setTimeout(resolve, 500));

      // 检查分数变化
      const scoreAfter = await page.$eval('.score-item:first-child .value', el => parseInt(el.textContent || '0'));

      // 分数应该发生变化（正确或错误）
      expect(scoreAfter).not.toBe(scoreBefore);
      console.log(`✓ 空格键功能正常 - 分数从 ${scoreBefore} 变为 ${scoreAfter}`);
    } else {
      console.log('⏭ 当前字符不是空格，跳过测试');
    }
  });
});
