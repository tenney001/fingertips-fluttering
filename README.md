# 指尖飞舞 - 儿童英文打字练习应用

一个专为8岁儿童设计的Vue3英文打字练习应用，通过游戏化的方式帮助小朋友提升打字速度和准确率。

## 🌟 核心特性

### ✅ V1.0 已实现功能

- **虚拟键盘显示** - 完整的QWERTY布局键盘，帮助小朋友熟悉键位位置
- **当前键位高亮** - 橙色脉动高亮显示当前应按键位，引导正确操作
- **大小写配置** - 支持区分/忽略大小写（默认忽略）
- **实时计分系统** - 正确+10分，错误-5分，连击奖励机制
- **2分钟倒计时** - 固定时长练习，培养时间管理意识
- **历史最高分** - 本地存储最高分记录，激励持续练习
- **暂停/继续** - 支持游戏暂停和恢复
- **响应式设计** - 适配手机、平板、桌面设备

### 🎨 儿童友好设计

- **清晰视觉引导** - 橙色高亮、闪烁动画吸引注意力
- **3D按键效果** - 立体感设计，增强互动感
- **实时反馈** - 正确/错误即时提示
- **小贴士提示** - "看橙色高亮的键位"等友好提醒
- **色彩丰富** - 渐变背景，温暖配色

### 🏗️ 技术架构

- **Vue 3** - Composition API，性能优异
- **TypeScript** - 完整类型支持，减少运行时错误
- **Pinia** - Vue3官方推荐状态管理
- **Vite** - 极速构建工具
- **SCSS** - 模块化样式系统

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
```

### 类型检查

```bash
npm run type-check
```

## 📱 使用说明

### 开始练习

1. 打开应用，页面显示"开始练习"按钮
2. 点击按钮开始2分钟倒计时
3. 查看虚拟键盘上的橙色高亮键位
4. 在真实键盘上按下对应的键
5. 正确输入会加分，错误输入会扣分

### 配置设置

点击"游戏设置"区域进行配置：

- **区分大小写** - 启用后，A和a将被视为不同字符
- **启用音效** - 打开/关闭按键音效

### 计分规则

- **正确输入** - +10分
- **错误输入** - -5分（最低0分）
- **连击奖励**：
  - 连续10次正确：额外+20分
  - 连续20次正确：额外+50分
  - 连续30次正确：额外+100分

### 进度指标

- **当前得分** - 实时显示当前得分
- **剩余时间** - 倒计时显示
- **准确率** - 计算公式：正确次数 / 总次数
- **连击数** - 连续正确输入次数

## 🎯 项目结构

```
src/
├── components/          # Vue组件
│   ├── GameBoard.vue   # 游戏主面板
│   ├── ScoreBoard.vue  # 分数显示
│   ├── SequenceView.vue # 字母序列
│   ├── VirtualKeyboard.vue # 虚拟键盘
│   └── ConfigPanel.vue # 配置面板
├── stores/              # Pinia状态管理
│   ├── game.ts         # 游戏状态
│   ├── score.ts        # 计分系统
│   └── config.ts       # 用户配置
├── composables/         # 组合式函数
│   ├── useKeyboard.ts  # 键盘处理
│   └── useStorage.ts   # 本地存储
├── types/               # TypeScript类型定义
│   ├── game.ts         # 游戏相关类型
│   └── config.ts       # 配置相关类型
├── utils/               # 工具函数
│   ├── config.ts       # 游戏配置
│   ├── sequenceGenerator.ts # 序列生成器
│   └── charComparator.ts # 字符比较
├── language/            # 多语种模块（预留）
│   ├── LanguageManager.ts
│   └── configs/
│       └── english.ts  # 英语配置
└── assets/              # 静态资源
    └── styles/          # 样式文件
```

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 测试覆盖范围

- ✅ 序列生成器测试
- ✅ 字符比较器测试
- ✅ 游戏状态管理测试
- ✅ 语言管理器测试

## 🌍 多语种扩展

项目预留了完整的多语种扩展架构，支持未来添加：

- 🇨🇳 中文拼音
- 🇯🇵 日语假名
- 🇰🇷 韩语
- 🇪🇸 西班牙语
- 🇫🇷 法语
- 🇩🇪 德语
- 🇷🇺 俄语
- 🇸🇦 阿拉伯语（RTL支持）

详细扩展计划请参考：[多语种扩展路线图](需求规格说明书-V1.0-MVP.md#14-多语种扩展路线图)

## 📈 性能指标

- **首次加载** - < 2秒
- **键盘响应** - < 30ms
- **构建大小**：
  - CSS: ~6KB (gzipped: 1.8KB)
  - JS: ~75KB (gzipped: 30KB)
  - 总计: ~81KB (gzipped: 32KB)

## 🔧 技术亮点

### Composition API
- 更好的逻辑复用
- 完整的TypeScript支持
- 更高效的响应式系统

### Pinia状态管理
- Vue3官方推荐
- TypeScript原生支持
- 极简API设计

### Vite构建优化
- 极速热更新
- 优化分包策略（vendor独立打包）
- Tree Shaking优化

### 性能优化
- 组件懒加载
- 响应式缓存
- 事件防抖处理

## 📝 开发规范

### 代码风格

- 使用ESLint + Prettier
- TypeScript严格模式
- Vue3 Composition API
- JSDoc注释规范

### 提交规范

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update documentation"
git commit -m "test: add test cases"
```

## 🎓 学习资源

- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 指南](https://www.typescriptlang.org/docs/)
- [Pinia 状态管理](https://pinia.vuejs.org/)
- [Vite 构建工具](https://vitejs.dev/)
- [SCSS 语法](https://sass-lang.com/documentation)

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发流程

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

- **Claude Code** - 初始开发

## 🙏 致谢

感谢所有为开源社区做出贡献的开发者们！

---

## 📞 反馈与支持

如有问题或建议，请提交 [Issue](../../issues)

## 🎉 特别鸣谢

感谢使用"指尖飞舞"，希望这个小应用能帮助更多的小朋友爱上英文打字！

---

**让打字变得有趣！** 🌸
