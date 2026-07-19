import { TutorialPackageSchema, type TutorialPackage, type Step } from './schema'

/**
 * Package Loader —— R8 的唯一注入通道。
 *
 * 引擎里所有主题差异只能经此进入：加载 JSON → zod 校验 → 按 order 归一排序 →
 * 收敛为类型安全的 TutorialPackage。不存在第二条注入主题信息的通道，
 * 因此新增 vue.json 走的是同一条数据路径，引擎代码无需感知。
 */

export class PackageValidationError extends Error {
  constructor(public issues: string[]) {
    super('TutorialPackage 校验失败:\n' + issues.join('\n'))
    this.name = 'PackageValidationError'
  }
}

/** 校验并归一化一个教程包；不合法直接抛错（Loader 是唯一守门人） */
export function loadPackage(raw: unknown): TutorialPackage {
  const r = TutorialPackageSchema.safeParse(raw)
  if (!r.success) {
    throw new PackageValidationError(
      r.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`),
    )
  }
  return sortPackage(r.data)
}

/** 章节与步骤按 order 稳定排序；order 缺省时退回声明顺序 */
function sortPackage(pkg: TutorialPackage): TutorialPackage {
  const stable = <T extends { order?: number }>(arr: T[]): T[] =>
    arr
      .map((item, i) => ({ item, key: item.order ?? i, i }))
      .sort((a, b) => a.key - b.key || a.i - b.i)
      .map((x) => x.item)

  return {
    ...pkg,
    chapters: stable(pkg.chapters).map((ch) => ({ ...ch, steps: stable(ch.steps) })),
  }
}

export interface FlatStep {
  chapterId: string
  chapterTitle: string
  step: Step
  /** 全包线性序号，从 0 起 —— 上一步/下一步导航的锚点 */
  index: number
}

/** 把 chapters[].steps[] 拍平成线性序列，供步骤导航（R2）无差别遍历 */
export function flattenSteps(pkg: TutorialPackage): FlatStep[] {
  const flat: FlatStep[] = []
  for (const ch of pkg.chapters) {
    for (const step of ch.steps) {
      flat.push({ chapterId: ch.id, chapterTitle: ch.title, step, index: flat.length })
    }
  }
  return flat
}

export function totalSteps(pkg: TutorialPackage): number {
  return pkg.chapters.reduce((n, ch) => n + ch.steps.length, 0)
}

/** 定位某 stepId 在线性序列中的位置；不存在返回 -1（JSON 已删的旧 stepId 静默忽略） */
export function indexOfStep(pkg: TutorialPackage, stepId: string): number {
  return flattenSteps(pkg).findIndex((f) => f.step.id === stepId)
}
