'use client'

import { useEffect, useMemo, useState } from 'react'
import type { TutorialPackage } from '@/lib/engine/schema'
import { flattenSteps } from '@/lib/engine/loader'
import {
  readPackageProgress,
  visitStep,
  completeStep,
  completion,
  type PackageProgress,
} from '@/lib/engine/progress'
import { MarkdownView } from './MarkdownView'
import { Sandbox } from './Sandbox'
import { Outline } from './Outline'
import { StepNav } from './StepNav'
import { ThemeToggle } from './ThemeToggle'

/** 学习工作台：左讲解 + 右沙箱 + 大纲 + 步骤导航（Vue3 式，全程不拦人 D4） */
export function Workspace({ pkg }: { pkg: TutorialPackage }) {
  const flat = useMemo(() => flattenSteps(pkg), [pkg])
  const [idx, setIdx] = useState(0)
  const [progress, setProgress] = useState<PackageProgress | null>(null)
  const [ready, setReady] = useState(false)

  // 初始化：读 localStorage 进度，定位到断点
  useEffect(() => {
    const p = readPackageProgress(pkg.id)
    setProgress(p)
    if (p?.currentStepId) {
      const i = flat.findIndex((f) => f.step.id === p.currentStepId)
      if (i >= 0) setIdx(i)
    }
    setReady(true)
  }, [pkg.id, flat])

  const cur = flat[idx]

  // 进入某步：记访问断点
  useEffect(() => {
    if (ready && cur) setProgress(visitStep(pkg.id, cur.step.id))
  }, [ready, pkg.id, cur?.step.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const jumpTo = (target: number) => {
    if (target < 0 || target >= flat.length || target === idx) return
    completeStep(pkg.id, flat[idx].step.id) // 经过即完成（不拦人）
    setIdx(target)
  }
  const jumpToStepId = (stepId: string) => {
    const i = flat.findIndex((f) => f.step.id === stepId)
    if (i >= 0) jumpTo(i)
  }

  const comp = completion(pkg, progress)

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-semibold">{pkg.meta.title}</span>
          <span className="text-xs text-muted hidden sm:inline">
            {comp.done}/{comp.total} · {comp.percent}%
          </span>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-0">
        <aside className="border-b md:border-b-0 md:border-r border-border bg-surface p-4 overflow-y-auto">
          <Outline pkg={pkg} currentStepId={cur.step.id} progress={progress} onJump={jumpToStepId} />
        </aside>

        <main className="flex flex-col min-w-0 min-h-0">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 overflow-hidden">
            <section className="p-5 md:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border">
              <div className="text-xs text-muted mb-1">{cur.chapterTitle}</div>
              <h1 className="text-lg font-semibold mb-3">{cur.step.title}</h1>
              <MarkdownView>{cur.step.description}</MarkdownView>
            </section>
            <section className="min-w-0 overflow-auto">
              <Sandbox
                key={cur.step.id}
                language={pkg.meta.language}
                files={cur.step.files}
                solution={cur.step.solution}
                defaultCode={pkg.meta.defaultCode}
                dependencies={pkg.meta.dependencies}
              />
            </section>
          </div>
          <div className="border-t border-border bg-surface px-4 md:px-6 py-3 shrink-0">
            <StepNav
              index={idx}
              total={flat.length}
              onPrev={() => jumpTo(idx - 1)}
              onNext={() => jumpTo(idx + 1)}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
