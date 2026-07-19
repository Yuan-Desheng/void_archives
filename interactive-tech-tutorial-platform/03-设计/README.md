# ITTP 设计说明书

## 如何打开

双击 `index.html`，在默认浏览器中打开即可（纯静态 HTML，Tailwind CDN + Google Fonts + Mermaid 均走 CDN，需联网）。也可在本目录起本地服务：

```bash
cd design
python -m http.server 8000
# 访问 http://localhost:8000
```

## 视觉风格

**gov**（与 `manifest.proto.json` 的 `handoff.styleKey` 一致）：shadcn 灰阶克制视觉、Noto Sans SC + JetBrains Mono、亮/暗双主题、禁止仪表盘式炫彩配色。全部页面共享同一份内联头部片段（Tailwind config + CSS 变量 + 排版/表格/代码块/引用块样式 + 导航栏 + Mermaid 初始化），风格统一、可独立打开。

## 文档清单

| 编号 | 文档 | HTML | 对应 specs 源文件 |
|------|------|------|------|
| 00 | 系统设计总览 | `00-overview.html` | `specs/00-系统设计总览.md` |
| 01 | 总体架构设计 | `01-architecture.html` | `specs/01-architecture.md` |
| 02 | 数据流设计 | `02-dataflow.html` | `specs/02-dataflow.md` |
| 03 | 数据库设计 | `03-database.html` | `specs/03-database.md` |
| 04 | 接口/API 设计 | `04-api.html` | `specs/04-api.md` |
| 05 | 安全设计 | `05-security.html` | `specs/05-security.md` |
| 06 | 运维与部署设计 | `06-ops.html` | `specs/06-ops.md` |
| 07 | 非功能性/性能与容量设计 | `07-nfr.html` | `specs/07-nfr.md` |
| 08 | 集成/对接设计 | `08-integration.html` | `specs/08-integration.md` |

`index.html` 为说明书首页：系统概述 + 设计全景/文档地图（Mermaid）+ 全部文档的卡片导航，不对应独立的 specs 源文件。

## 上游依赖

本设计基于以下原型目录与原始需求，均为唯一真源：

- **原型目录（当前基线）**：`../02-原型-v2/`（含 `specs/`、`manifest.proto.json`、各模块高保真页面）—— 2026-07-17 决策 D4 范式转向后的版本，忠于 Vue3「左讲解+右沙箱、靠内容引导、全程不拦人」，已砍 R3/R4/R5（高亮/等待/聚光灯）。
- 已废弃的旧版原型：`../02-原型/`（范式转向前的 guided-tour/lesson-reader 版本，仅作历史存档，不作为设计输入）。
- 原始需求：`../01-需求/`
- 关键会议决策：`../99-会议与决策/`
