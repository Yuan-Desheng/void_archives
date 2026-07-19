# Interactive Tech Tutorial Platform — app（一期纯前端）

内容与引擎分离、配置驱动的「左讲解 + 右可运行 Sandpack 沙箱」自主学习工具。
一期纯前端（无后端），进度存 localStorage。栈：Next.js 15 + React 19 + TS + Tailwind v4 + Sandpack。

## 前置

- Node ≥ 18.18（实测 22）
- **pnpm**（本项目用 pnpm；已在 `package.json` 的 `packageManager` 固定版本）
  用 Node 自带 corepack 免安装启用：`corepack enable`

## 运行

```bash
pnpm install          # 装依赖
pnpm run dev          # 开发，默认 http://localhost:3000
pnpm test             # 单元测试（vitest，27 例）
pnpm run r8           # R8 三门禁：零主题分支扫描 + 校验 + 测试
pnpm run build        # 生产构建（SSG）
```

打开 `http://localhost:3000` 即进入 React 教程工作台。

## R8 门禁（成败判据：新增一个主题 JSON 即可跑通，引擎零改动）

```bash
pnpm run r8
```
- 门禁① `scripts/r8-guard.mjs`：静态扫描 `src/lib/engine`、`src/components`，禁止主题字面量分支
- 门禁②：vue fixture 与 react 走同一 Loader，无差别加载
- 门禁③：`content/*.json` 全部通过 zod Schema 校验

新增主题 = 在 `src/content/` 放一个 `vue.json`（符合 `src/lib/engine/schema.ts`），**不改任何 .ts**。

## 目录

```
src/lib/engine/   # 引擎：schema(契约) / loader(R8唯一注入通道) / progress(localStorage)
src/content/      # 教程内容 JSON（唯一真源，随仓库）
src/components/   # UI：Workspace / Sandbox / Outline / StepNav / MarkdownView / ThemeToggle
scripts/          # R8 门禁①
```

## 故障排除

### `pnpm run build` 报 `Command failed: pnpm install`（本机特有）
根因：**全局 `~/.npmrc` 的 `registry=http://localhost:4873/`** 指向一个已失效的本地私有源。
pnpm 构建时的嵌套依赖检查会去访问它并失败。彻底修复（同时修好本机所有 npm/pnpm 项目）：

```bash
# 把全局 registry 改回公共镜像（或删掉那一行）
npm config set registry https://registry.npmmirror.com
```

临时绕过（不改全局，直接调 next 二进制、脱离 pnpm re-exec）：
```bash
node node_modules/next/dist/bin/next build
```

> 本项目已在 `.npmrc` 固定 registry 为 npmmirror、在 `pnpm-workspace.yaml` 关闭会崩的依赖预检，
> 但构建子进程仍可能读到全局坏 registry。根治请修全局 `~/.npmrc`。
