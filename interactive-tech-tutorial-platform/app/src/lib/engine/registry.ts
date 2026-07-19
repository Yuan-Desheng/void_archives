import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadPackage } from './loader'
import { totalSteps } from './loader'
import type { TutorialPackage } from './schema'

/**
 * 内容登记处 —— 服务端遍历 content/ 下所有教程包 JSON，逐个走 Loader 校验。
 *
 * R8 落点：这里用文件系统遍历发现主题，代码里没有任何主题名的字面量或分支；
 * 放进一个新的 *.json 就会被自动发现、校验、上架，引擎/页面零改动。
 */

const CONTENT_DIR = join(process.cwd(), 'src', 'content')

/** content/ 下全部教程包（每个都过 zod 校验并归一排序）。 */
export function allPackages(): TutorialPackage[] {
  const files = readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort() // 稳定展示顺序，纯按文件名，不按主题名
  return files.map((f) =>
    loadPackage(JSON.parse(readFileSync(join(CONTENT_DIR, f), 'utf8'))),
  )
}

/** 按 id 取单个教程包；不存在返回 null（路由 404 用）。 */
export function getPackage(id: string): TutorialPackage | null {
  return allPackages().find((p) => p.id === id) ?? null
}

/** 卡片摘要 —— 可序列化传给客户端组件（完成度/CTA 在客户端读 localStorage 算）。 */
export interface PackageSummary {
  id: string
  title: string
  description: string
  status: 'active' | 'maintenance' | 'draft'
  chapterCount: number
  totalSteps: number
  allStepIds: string[]
}

export function packageSummaries(): PackageSummary[] {
  return allPackages().map((p) => ({
    id: p.id,
    title: p.meta.title,
    description: p.meta.description,
    status: p.status ?? 'active',
    chapterCount: p.chapters.length,
    totalSteps: totalSteps(p),
    allStepIds: p.chapters.flatMap((c) => c.steps.map((s) => s.id)),
  }))
}
