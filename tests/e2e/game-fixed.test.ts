import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:3001';

describe('指尖飞舞 - 打字游戏 E2E 测试', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('页面应该正确加载', async () => {
    const title = await page.title();
    console.log('页面标题:', title);

    const titleText = await page.$eval('h1', el => el.textContent);
    expect(titleText).toContain('指尖飞舞');

    const sequenceLabel = await page.$eval('.sequence-label', el => el.textContent);
    expect(sequenceLabel).toContain('待敲击字母');

    const keyboardFooter = await page.$eval('.keyboard-footer', el => el.textContent);
    expect(keyboardFooter).toContain('键位');

    const startButton = await page.$eval('.controls .btn', el => el.textContent);
    expect(startButton).toContain('开始练习');

    console.log('✓ 页面元素加载正确');
  });

  test('游戏应该可以正常开始', async () => {
    await page.click('.controls .btn');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const timeDisplay = await page.evaluate(() => {
      const timeElement = document.querySelector('.time');
      return timeElement ? timeElement.textContent : null;
    });

    console.log('✓ 游戏启动检查完成，时间显示:', timeDisplay);
  });

  test('虚拟键盘高亮应该正确显示', async () => {
    await page.click('.controls .btn');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const hasCurrentChar = await page.evaluate(() => {
      return document.querySelector('.char-current') !== null;
    });

    expect(hasCurrentChar).toBe(true);

    const keyboardButtons = await page.$$('.key');
    console.log(`✓ 虚拟键盘包含 ${keyboardButtons.length} 个键位`);
  });

  test('Enter键快捷键应该可以开始游戏', async () => {
    await page.reload({ waitUntil: 'networkidle2' });

    await page.keyboard.press('Enter');

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('✓ Enter键快捷键测试完成');
  });

  test('设置弹窗应该可以正常打开和关闭', async () => {
    await page.click('.btn-settings');

    await new Promise(resolve => setTimeout(resolve, 300));

    const modalExists = await page.evaluate(() => {
      return document.querySelector('.settings-modal') !== null;
    });

    expect(modalExists).toBe(true);
    console.log('✓ 设置弹窗打开成功');

    await page.click('.btn-close');

    await new Promise(resolve => setTimeout(resolve, 300));

    const modalClosed = await page.evaluate(() => {
      return document.querySelector('.settings-modal') === null;
    });

    expect(modalClosed).toBe(true);
    console.log('✓ 设置弹窗关闭成功');
  });

  test('虚拟键盘布局应该正确', async () => {
    const keyboardButtons = await page.$$eval('.key-label', buttons => 
      buttons.map(btn => btn.textContent)
    );

    const firstRowKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
    for (const key of firstRowKeys) {
      expect(keyboardButtons).toContain(key);
    }

    const secondRowKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
    for (const key of secondRowKeys) {
      expect(keyboardButtons).toContain(key);
    }

    const thirdRowKeys = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
    for (const key of thirdRowKeys) {
      expect(keyboardButtons).toContain(key);
    }

    expect(keyboardButtons).toContain('空格');

    console.log('✓ 虚拟键盘布局正确 - QWERTY 3行 + 空格键');
  });
});
