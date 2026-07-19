# 互动式技术教程平台 · 原型中心

## 快速开始

### 如何打开原型
1. **本地浏览**：双击 `index.html` 文件，在默认浏览器打开
2. **在线预览**：如部署到 Web 服务，直接访问地址
3. **开发服务**：可用 `python -m http.server 8000` 或 `npx http-server` 在本地启动服务

## 系统概述

**互动式技术教程平台** 是一个以内容与引擎分离为核心的自主学习工具。通过 JSON 配置驱动，实现"左讲解 + 右可运行沙箱"的对称式学习体验。

**设计理念**：
- 📝 **内容独立**：课程内容与平台引擎分离，使用 JSON 定义课程结构、讲解和交互
- 🎯 **即学即用**：在线代码沙箱支持实时编辑、执行、查看结果，无需切换工具
- 📊 **进度可视**：完整的学习进度追踪，支持中断恢复、推荐系统
- 🎨 **自适应**：响应式设计全面适配桌面、平板、手机；深色/浅色模式无缝切换
- ♿ **易用设计**：Gov 风格极简设计，清晰的信息架构，无障碍支持

## 视觉风格

### 设计系统
- **风格**：**Gov**（政府/企业级）— 极简、高效、信息密度高
- **配色系统**：
  - **Primary（蓝色）**：#3B5BDB（浅色）/ #6478E8（深色）- 主操作
  - **Accent（青绿色）**：#0EA5B7（浅色）/ #2EC2CC（深色）- 强调
  - **Neutral（灰度）**：适应浅色/深色模式切换
- **字体**：Inter + Noto Sans SC（中英文混排）
- **圆角**：8px（lg）/ 12px（xl）
- **阴影**：最小化，仅在交互提示时出现

### 模式支持
- **浅色模式**（Light）：清爽背景，高对比文字
- **深色模式**（Dark）：护眼背景，自适应文字
- 系统自动检测设备偏好，用户可手动切换（见"外观设置面板"）

## 模块与页面清单

### 【主题课程库】 `theme-library__*`
| 页面 | 文件 | 功能 |
|------|------|------|
| 主题选择页 | `theme-library__theme-selection.html` | 浏览全部课程、分类筛选、搜索、难度级别选择 |
| 章节大纲面板 | `theme-library__chapter-outline.html` | 展示课程章节列表、进度百分比、评分、时长 |

### 【学习工作台】 `learning-workspace__*`
| 页面 | 文件 | 功能 |
|------|------|------|
| 学习工作台（核心页） | `learning-workspace__workspace.html` | 主交互界面：讲解(左) + 沙箱(右)，分隔线可折叠 |

### 【代码沙箱】 `code-sandbox__*`
| 页面 | 文件 | 功能 |
|------|------|------|
| 沙箱主面板（桌面右栏） | `code-sandbox__sandbox-panel.html` | 编辑器、控制台输出、运行/重置按钮 |
| 移动端沙箱 Tab 视图 | `code-sandbox__sandbox-mobile-tab.html` | 响应式：编辑/输出 Tab 切换 |
| 沙箱异常态视图 | `code-sandbox__sandbox-error-state.html` | 错误状态、超时提示、调试日志展示 |

### 【学习进度】 `learning-progress__*`
| 页面 | 文件 | 功能 |
|------|------|------|
| 进度指示器（嵌入式规范） | `learning-progress__progress-indicators.html` | 进度条、里程碑、完成度组件规范 |
| 继续学习提示与入口 | `learning-progress__continue-learning.html` | 上次位置恢复、推荐课程、快速入口 |

### 【外观与主题】 `appearance-theme__*`
| 页面 | 文件 | 功能 |
|------|------|------|
| 外观设置面板 | `appearance-theme__theme-switcher-panel.html` | 深/浅模式切换、字体大小、高对比度选项 |
| 响应式与移动端切换示例页 | `appearance-theme__responsive-showcase.html` | 各断点布局演示、移动端优化展示 |

## 功能定义与规范文档

详见 `specs/` 目录：
- **`00-需求提取与范围界定.md`**：项目背景、用户故事、MVP 范围、关键假设
- `01-*.md`：各模块的功能详细定义
- `02-*.md`：交互流程、状态管理、API 契约

## 开发工作流

### 本地预览
```bash
# 方式 1：直接打开
open prototype/index.html

# 方式 2：启动本地服务（推荐）
cd prototype
python -m http.server 8000
# 访问 http://localhost:8000
```

### 新增页面
1. 在 `prototype/` 下新建 `[module-name]__[page-name].html`
2. 复用共享的 HEAD（Tailwind + 样式）
3. 在 `index.html` 中的对应模块组添加卡片链接

### 样式复用
所有页面共享以下 CSS 变量（可在 `<style>` 中使用）：
```css
--color-bg           /* 背景色 */
--color-surface      /* 卡片/表面色 */
--color-border       /* 边框色 */
--color-text         /* 文字色 */
--color-text-muted   /* 辅助文字 */
--color-primary      /* 主色 */
--color-accent       /* 强调色 */
--radius-lg          /* 8px 圆角 */
--radius-xl          /* 12px 圆角 */
```

## 下一步

- [ ] 完善各模块原型页面
- [ ] 用户验证与反馈收集
- [ ] 确认交互细节和动画效果
- [ ] 移交设计稿给开发团队
- [ ] 启动 Phase 2：功能原型 → 高保真设计
