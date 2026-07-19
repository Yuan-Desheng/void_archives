import { z } from 'zod'

/**
 * TutorialPackage Schema —— 引擎契约（R8 成败判据的形式化定义）。
 *
 * 「引擎能吃什么」由本 Schema 唯一定义。任何新主题 JSON（react.json / vue.json ...）
 * 只要通过本 Schema 校验，即保证可被引擎无差别渲染。引擎代码里不允许出现任何
 * `if (theme === 'react')` 之类的主题分支——一切主题差异都外移到符合本 Schema 的数据里。
 *
 * 依据：需求 5.2 Schema + 阶段③设计补充（status / meta.dependencies / order）。
 */

/** Sandpack 多文件：Record<文件路径, 文件内容> */
const FileMap = z.record(z.string(), z.string())

export const StepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(), // MDX/Markdown 讲解正文
  order: z.number().optional(),
  files: FileMap.optional(), // 该步初始代码
  solution: FileMap.optional(), // 答案代码（R10）
})

export const ChapterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  order: z.number().optional(),
  steps: z.array(StepSchema).min(1),
})

export const TutorialPackageSchema = z.object({
  id: z.string().min(1), // 主题标识，不枚举限定（R8：新主题零改动）
  status: z.enum(['active', 'maintenance', 'draft']).optional(),
  meta: z.object({
    title: z.string().min(1),
    description: z.string(),
    language: z.string().min(1), // Sandpack template：react / vanilla / vue ...
    defaultCode: z.string(),
    dependencies: z.record(z.string(), z.string()).optional(), // npm 依赖 {名:版本}
  }),
  chapters: z.array(ChapterSchema),
})

export type Step = z.infer<typeof StepSchema>
export type Chapter = z.infer<typeof ChapterSchema>
export type TutorialPackage = z.infer<typeof TutorialPackageSchema>
