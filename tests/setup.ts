// Jest setup file for E2E tests

// 设置全局超时
jest.setTimeout(30000);

// 控制台日志配置
beforeAll(async () => {
  console.log('🚀 启动 E2E 测试环境');
});

afterAll(async () => {
  console.log('✅ E2E 测试完成');
});
