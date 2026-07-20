# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

本仓库 = 「互动技术教程平台」(ITTP)。`interactive-tech-tutorial-platform/` 下同时放
**知识库文档**（六阶段研发流程产物：`01-需求/` `02-原型-v2/` `03-设计/` `04-评审记录/`
`99-会议与决策/` `开发计划.md`）与 **Next.js 应用**（`app/`）。应用是「左讲解 + 右可运行
Sandpack 沙箱」的自主学习工具，一期纯前端、进度存 localStorage。

## Commands

均在 `interactive-tech-tutorial-platform/app/` 下运行（包管理器 **pnpm**，`corepack enable`）：

```bash
pnpm install
pnpm run dev            # 开发，http://localhost:3000
pnpm test               # vitest，28 例
pnpm run r8             # R8 三门禁：零主题分支扫描 + zod 校验 + 全测试（成败判据）
pnpm run build          # 生产 SSG 构建
pnpm run lint           # eslint（flat config + eslint-config-next）
```

- **跑单个测试**：`node node_modules/vitest/vitest.mjs run src/lib/engine/__tests__/loader.test.ts`，
  或按名 `pnpm test -- -t "vue 包"`。
- **`pnpm run build` 本机可能报 ERR_PNPM（全局 `~/.npmrc` 指向失效的 localhost registry）**：
  改跑 `node node_modules/next/dist/bin/next build` 绕过 pnpm re-exec；根治是把全局 registry 改回公共镜像。
- 起服务冒烟统一用 `node node_modules/next/dist/bin/next start -p <port>`（后台 + 绝对路径）。

## Architecture

**核心是「内容 / 引擎 分离」，由 R8 门禁强制。这是理解整个项目的钥匙。**

- **内容** = `app/src/content/*.json`（`TutorialPackage`，随仓库的唯一真源）。
- **引擎** = `app/src/lib/engine/`：`schema.ts`(zod 契约) / `loader.ts`(唯一注入通道，zod 校验 +
  按 `order` 归一排序) / `progress.ts`(localStorage `ittp:progress`，SSR 安全)。
- **UI** = `app/src/components/`（Workspace 编排 / Sandbox / Outline / StepNav / MarkdownView /
  ThemeToggle / ThemeCards + `ui/` 下 shadcn 组件）。
- **R8 成败判据**：新增一个主题 JSON（如 `vue.json`）即可跑通，引擎/组件**零改动**。由三条门禁保证，
  跑 `pnpm run r8`：① `scripts/r8-guard.mjs` 静态扫描 `lib/engine`、`components`，禁止 `react|vue|…`
  主题字面量分支；② vue fixture 与 react 走同一 Loader；③ `content/*.json` 全过 zod。写引擎/组件代码
  **绝不能出现针对具体主题 id 的 if/switch**——主题差异一律外移到数据。
- **主题发现**：`registry.ts` 用 `fs` 遍历 `content/` 发现所有包（代码里无主题名），喂给首页 `/`
  的卡片列表和 `/learn/[packageId]` 的 SSG 路由（`generateStaticParams`）。
- **进度模型**：`displayState` 派生 `done/current/idle`，**永不 `locked`**——对应 D4「不拦人」范式。
- **范式边界（已定，勿违反）**：D4 砍掉聚光灯 / waitFor 阻塞 / 蒙层（原 R3/R4/R5）；
  D6 一期纯前端，**无后端 / 无数据库 / 无鉴权**（`03-设计/一期实现范围.md` 是开发唯一真源，
  specs 里 Postgres/Clerk/Route Handler 属二期，不实现）。
- **栈**：Next 15 App Router(RSC/SSG) + React 19 + TS + Tailwind v4 + shadcn/ui + zod +
  `@codesandbox/sandpack-react`。讲解渲染 = `react-markdown` + `rehype-highlight`。

## Gotchas

- eslint 插件靠 `app/pnpm-workspace.yaml` 的 `publicHoistPattern: ['*eslint*']` 提升到顶层，
  否则 pnpm 严格 node_modules 下 eslint-config-next 加载插件失败、build 时 lint 静默失效。
- Sandpack 的 `crypto.subtle` 需要**安全上下文**（localhost/https），用 LAN IP + http 打开会报
  `Cannot read properties of undefined (reading 'digest')`——不是代码 bug。
- 教程源笔记（小满zs）**不在本仓库**，在 Obsidian vault：`~/yuandesheng/ewige_wiederkunft/…`。
- git pre-commit 钩子扫 PII/敏感文件（`scripts/git-hooks/`）；调试截图别留 repo 根。

---

# 教程内容写作规范

> 以下是「教程内容」的写作准绳。写新篇目或改现有讲解，都按此执行。

## 目标

每篇教程要把一个主题**讲透**——完整覆盖 react.dev 官方对应章节 + 小满zs 笔记的关键内容，
让学习者读完这一篇就掌握该主题的**全部常用知识**，而非浅尝辄止。宁可长而全，不要短而浅。

## 素材来源与核对

- **官方为准**：`react.dev/learn` 与 `react.dev/reference` 对应页是准绳。
- **笔记作补充**：小满zs 笔记提供案例/角度，路径：
  - 索引 canvas：`~/yuandesheng/ewige_wiederkunft/Documents/I.P.A.R.A/学习领域/归档/卡片盒笔记主题索引卡/小满zs-react.canvas`
  - 篇目：`…/学习领域/收集/学习React【分类】主题.md`
- **冲突以官方现代写法为准**：弃用 `defaultProps`、类组件、`window` 事件 hack 等过时/反模式写法。
- **逐篇实跑**：每段代码必须在 Sandpack（react 模板，`/App.js`，jsx）真跑通，不照搬笔记原文。
- **去 PII**：笔记里的人名/公司/邮箱/手机换中性词（如「访客」「商品」），提交前扫一遍。

## 每篇 description 结构（详尽版）

按顺序，可按主题裁剪，但「逐个要点 + 常见误区 + 延伸 + 练习」不可省：

1. **场景切入**：从真实问题或「你眼前的代码」引出这个概念解决什么。
2. **核心概念**：讲透「是什么 / 为什么需要 / 心智模型」。
3. **基础用法** + 最小代码块。
4. **逐个要点**（覆盖官方该主题所有主要小节 + 笔记案例），每个要点配一个代码块。
   例：`useEffect` → 依赖数组三态各自时机 / 清理语义 / 4 类场景(订阅·定时器·请求·DOM) /
   竞态(ignore flag) / StrictMode 两次执行。
5. **注意事项 & 常见误区**：陷阱、反模式、易错点。
6. **进阶 / 相关 API / 何时用**：进阶用法、相关 Hook/API、与其它方案的对比。
7. **延伸阅读**：`> 深入：[react.dev — 标题](官方链接)`，链官方（平台已配新标签打开）。
8. **练习**：一句聚焦的动手指令，对应 `files` 里的 `TODO`。

**篇幅/详尽度基准**：每篇要**逐节覆盖官方对应页的所有小节** + 笔记要点，通常约
**1800–2500 字**、5–8 个代码块、多个 `##` 小标题、必要处用对比表。参照已定稿的基准篇
`st-first-component`（~2100 字，覆盖 Your First Component + Writing Markup 两页）与
`st-useeffect`（~1700 字）。**宁可长而全，不要短而浅**——不为简洁牺牲覆盖度。

## 排版

- `##` 小标题分区（详尽版鼓励多小节），`**` 加粗关键词。
- 代码块用 ```jsx（可跑、渐进、只留讲解需要的最小片段，不贴整段 App）。
- 差异/对比用 markdown 表格；步骤/清单用有序/无序列表。

## 拆分原则

- 一个主题内容过多（useEffect、useReducer、Router 系列等）时，**拆成多个 step 循序渐进**，
  而非硬塞一篇；拆后每 step 仍遵循上面结构，聚焦一个子概念 + 一个练习。
- 章节顺序、篇目依据 `01-需求/内容组织决策-Q3Q4.md`。

## 每篇/每章产出后必做

1. JSON 合法 → 2. R8 门禁① → 3. vitest 28 例 → 4. build 7/7 →
5. 浏览器抽查渲染（代码块高亮 / 延伸链接 / 练习 / 沙箱可跑 / 看答案 R10）→
6. 清理调试截图，逐章一个 commit。
