# 交互式技术教程平台 - 高保真原型

## 快速开始

### 打开原型
直接在浏览器中双击打开 `index.html`，或使用 Web 服务器：

```bash
# 方式 1：直接打开
open prototype/index.html

# 方式 2：使用 Python 本地服务器
cd prototype && python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

## 视觉风格

采用 **深色系仪表盘风格**，具有以下特征：

- **配色方案**
  - 主色：蓝紫色（Primary #4C6FFF）
  - 辅色：青蓝色（Accent #22D3EE）
  - 强调色：金黄色（Spotlight #FDBA33）
  - 背景：深灰蓝色体系（Base #0A0C10 ~ Surface #12151C）

- **排版**
  - 标题字体：Inter + Noto Sans SC（中英文混排）
  - 代码字体：JetBrains Mono
  - 字号体系：48px（主标题）→ 24px（模块标题）→ 16px（卡片标题）→ 14px（正文）→ 13px（辅助文本）

- **组件风格**
  - 玻璃态卡片：半透明背景 + 细边框 + 悬停发光
  - 内聚光灯环：边框 + 阴影组合突出高亮区域
  - 平滑过渡：所有交互元素 200ms 标准缓动

- **响应式**
  - 默认最大宽度 1200px，边距 20px
  - 卡片网格：自适应 280px 最小列宽
  - 移动优先设计

## 模块与页面清单

### 1. 【教程与章节目录】
浏览主题包、查看课程结构和学习进度
- `tutorial-catalog__package-selection.html` - 主题包选择页
- `tutorial-catalog__chapter-tree.html` - 教程详情页（目录树+概览）
- `tutorial-catalog__learning-progress-overview.html` - 我的学习总览页

### 2. 【课程讲解与步骤导航】
阅读课程内容、查看学习进度
- `lesson-reader__catalog.html` - 教程包目录
- `lesson-reader__lesson.html` - 课程学习页
- `lesson-reader__my-progress.html` - 我的学习进度

### 3. 【引导引擎】
步骤引导、聚光灯高亮与交互工作台
- `guided-tour__tour-overlay.html` - 引导蒙层与聚光灯（全局叠加层）
- `guided-tour__tutorial-workspace.html` - 教程学习工作台（左讲解/右沙箱）
- `guided-tour__chapter-toc.html` - 章节/步骤目录树
- `guided-tour__tutorial-catalog.html` - 教程包（主题）选择页
- `guided-tour__my-progress.html` - 我的学习进度页

### 4. 【代码沙箱】
Sandpack 代码编辑与实时预览
- `code-sandbox__sandbox-panel.html` - 沙箱主面板（桌面右栏）
- `code-sandbox__sandbox-mobile-tab.html` - 移动端沙箱 Tab 视图
- `code-sandbox__sandbox-error-state.html` - 沙箱异常态视图

### 5. 【学习进度与账户】
认证、学习管理与进度指示器
- `learning-progress__auth-entry.html` - 登录入口与登录弹窗
- `learning-progress__my-learning.html` - 我的学习
- `learning-progress__progress-indicators.html` - 进度标记与同步状态（嵌入式规范）

## 功能定义文档

详细的需求、设计规范与功能定义存放在：

```
specs/
├── 00-需求提取与范围界定.md
├── 01-系统架构与模块定义.md
├── 02-教程包配置规范.md
├── 03-引导引擎设计.md
├── 04-代码沙箱集成.md
├── 05-学习进度与同步.md
└── ...
```

## 特色功能

### TutorialPackage 配置驱动
- 教程以结构化配置定义，内容与引擎分离
- 支持多主题扩展（首个 React，预留 Vue / JavaScript / 算法）

### 步骤引导与聚光灯
- 全局蒙层 + 聚光灯精准高亮用户操作目标
- 等待用户交互后自动推进

### 实时代码沙箱
- 集成 Sandpack，让学习者边读边动手
- 实时编译预览，代码与讲解同步

### 学习进度管理
- 完整的学习记录与进度同步
- 多平台一致的进度指示器

## 原型交互说明

所有页面均为 **视觉原型**，展示信息架构与界面设计。真实功能将在后续开发中实现：

- 点击卡片 `<a href>` 可导航到对应页面
- 所有链接均指向同一 `prototype/` 目录下的 HTML 文件
- 页面间通过导航栏 / 返回按钮保持连贯

## 本地开发

### 修改原型
- 直接编辑对应的 `.html` 文件
- 更新样式：修改 `<style>` 块中的 CSS 变量
- 共享的设计系统定义在 `index.html` 的 HEAD 中

### 预览效果
- 刷新浏览器即可看到变化
- 建议使用 Chrome/Firefox 的开发者工具调试响应式布局（DevTools → Toggle device toolbar）

## 技术栈

- **HTML5** - 结构化标记
- **Tailwind CSS** - 工具类样式 + 自定义配置
- **Google Fonts** - Inter / Noto Sans SC / JetBrains Mono
- **ECharts** - 数据可视化（预留）
- **原生 JavaScript** - 交互逻辑（后续补充）

## 下一步

1. **静态页面补全** - 逐个实现 15 个页面的高保真设计稿
2. **交互原型** - 添加页面间的导航与基础交互
3. **功能实现** - 基于原型开发前后端代码
4. **集成测试** - 验证 TutorialPackage 配置驱动与引导引擎运作

---

**最后更新**：2026-07-17
**状态**：原型导航页完成，等待各页面设计稿补充
