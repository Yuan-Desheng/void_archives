import type { TutorialPackage } from './schema'
import { totalSteps } from './loader'

/**
 * 学习进度 —— 一期纯前端，存 localStorage（D6：无后端/无跨端同步）。
 * key `ittp:progress`，结构 { [packageId]: PackageProgress }。
 */

export interface PackageProgress {
  currentStepId: string | null
  completedStepIds: string[] // 去重、只增（仅整体重置清空）
  lastVisitedAt: string // ISO
}

export type ProgressMap = Record<string, PackageProgress>

export const STORAGE_KEY = 'ittp:progress'

const empty = (): PackageProgress => ({
  currentStepId: null,
  completedStepIds: [],
  lastVisitedAt: new Date().toISOString(),
})

/** SSR 安全：服务端无 localStorage → 返回空 */
export function readProgress(): ProgressMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressMap) : {}
  } catch {
    return {} // 损坏数据不崩，按空态兜底
  }
}

export function readPackageProgress(packageId: string): PackageProgress | null {
  return readProgress()[packageId] ?? null
}

function write(map: ProgressMap): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* 隐私模式/配额满：静默失败，不阻塞学习 */
  }
}

/** 进入某步：更新断点 + 记访问时间（不改完成集合） */
export function visitStep(packageId: string, stepId: string): PackageProgress {
  const map = readProgress()
  const p = map[packageId] ?? empty()
  const next: PackageProgress = {
    ...p,
    currentStepId: stepId,
    lastVisitedAt: new Date().toISOString(),
  }
  map[packageId] = next
  write(map)
  return next
}

/** 标记完成：并集去重、只增不减（对齐设计 F3） */
export function completeStep(packageId: string, stepId: string): PackageProgress {
  const map = readProgress()
  const p = map[packageId] ?? empty()
  const set = new Set(p.completedStepIds)
  set.add(stepId)
  const next: PackageProgress = { ...p, completedStepIds: [...set], lastVisitedAt: new Date().toISOString() }
  map[packageId] = next
  write(map)
  return next
}

/** 从头开始：清空该包进度（真删，非留墓碑） */
export function resetPackage(packageId: string): void {
  const map = readProgress()
  delete map[packageId]
  write(map)
}

export type DisplayState = 'done' | 'current' | 'idle'

/**
 * 大纲节点显示态派生（不落库，实时算）。
 * current 优先于 done；永不 'locked'（D4：不拦人）。
 */
export function displayState(stepId: string, p: PackageProgress | null): DisplayState {
  if (!p) return 'idle'
  if (stepId === p.currentStepId) return 'current'
  if (p.completedStepIds.includes(stepId)) return 'done'
  return 'idle'
}

export interface Completion {
  done: number
  total: number
  percent: number
}

/** 完成度：已完成步数 / 总步数（总步数读 JSON） */
export function completion(pkg: TutorialPackage, p: PackageProgress | null): Completion {
  const total = totalSteps(pkg)
  const validIds = new Set(
    pkg.chapters.flatMap((c) => c.steps.map((s) => s.id)),
  )
  // 只计仍存在于 JSON 里的已完成步（JSON 已删的旧 stepId 忽略）
  const done = p ? p.completedStepIds.filter((id) => validIds.has(id)).length : 0
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  return { done, total, percent }
}
