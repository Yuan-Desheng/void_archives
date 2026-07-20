'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import type { TutorialPackage } from '@/lib/engine/schema'
import { flattenSteps } from '@/lib/engine/loader'
import {
  readPackageProgress,
  visitStep,
  completeStep,
  resetPackage,
  completion,
  type PackageProgress,
} from '@/lib/engine/progress'
import { MarkdownView } from './MarkdownView'
import { Sandbox } from './Sandbox'
import { Outline } from './Outline'
import { StepNav } from './StepNav'
import { ThemeToggle } from './ThemeToggle'

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 text-sm font-medium transition ${
        active ? 'text-primary border-b-2 border-primary' : 'text-muted border-b-2 border-transparent'
      }`}
    >
      {children}
    </button>
  )
}

/** 学习工作台：左讲解 + 右沙箱 + 大纲 + 步骤导航（Vue3 式，全程不拦人 D4） */
export function Workspace({ pkg }: { pkg: TutorialPackage }) {
  const flat = useMemo(() => flattenSteps(pkg), [pkg])
  const [idx, setIdx] = useState(0)
  const [progress, setProgress] = useState<PackageProgress | null>(null)
  const [ready, setReady] = useState(false)
  const [showResume, setShowResume] = useState(false)
  const [tab, setTab] = useState<'lesson' | 'sandbox'>('lesson') // 移动端讲解/代码 Tab（R7，默认讲解）

  // 初始化：读 localStorage 进度，定位到断点（F7 续学：非第一步则提示）
  useEffect(() => {
    const p = readPackageProgress(pkg.id)
    setProgress(p)
    if (p?.currentStepId) {
      const i = flat.findIndex((f) => f.step.id === p.currentStepId)
      if (i > 0) {
        setIdx(i)
        setShowResume(true)
      }
    }
    setReady(true)
  }, [pkg.id, flat])

  // F9 从头开始：二次确认后清空该包进度，回到第一步
  const restart = () => {
    if (!window.confirm('确定从头开始？这会清空本主题在本机的学习进度。')) return
    resetPackage(pkg.id)
    setProgress(null)
    setShowResume(false)
    setIdx(0)
  }

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
          <Link href="/" className="text-sm text-muted hover:text-fg transition shrink-0">
            ← 主题库
          </Link>
          <span className="font-semibold">{pkg.meta.title}</span>
          <span className="text-xs text-muted hidden sm:inline">
            {comp.done}/{comp.total} · {comp.percent}%
          </span>
        </div>
        <ThemeToggle />
      </header>

      {showResume && (
        <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-2 border-b border-border bg-surface-2 text-sm shrink-0">
          <span className="text-fg truncate">
            继续学习：{cur.chapterTitle} · {cur.step.title}
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={restart} className="text-muted hover:text-fg transition">
              从头开始
            </button>
            <button onClick={() => setShowResume(false)} className="text-primary font-medium">
              继续
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-0">
        <aside className="border-b md:border-b-0 md:border-r border-border bg-surface p-4 overflow-y-auto">
          <Outline pkg={pkg} currentStepId={cur.step.id} progress={progress} onJump={jumpToStepId} />
        </aside>

        <main className="flex flex-col min-w-0 min-h-0">
          {/* 移动端 Tab（<lg）：讲解 / 代码 二选一，避免窄屏被挤成两栏（R7） */}
          <div className="lg:hidden flex border-b border-border bg-surface shrink-0">
            <TabButton active={tab === 'lesson'} onClick={() => setTab('lesson')}>
              讲解
            </TabButton>
            <TabButton active={tab === 'sandbox'} onClick={() => setTab('sandbox')}>
              代码
            </TabButton>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 overflow-hidden">
            <section
              className={`${tab === 'lesson' ? 'flex' : 'hidden'} lg:flex flex-col p-5 md:p-6 overflow-y-auto lg:border-r border-border`}
            >
              <div className="text-xs text-muted mb-1">{cur.chapterTitle}</div>
              <h1 className="text-lg font-semibold mb-3">{cur.step.title}</h1>
              <MarkdownView>{cur.step.description}</MarkdownView>
            </section>
            <section className={`${tab === 'sandbox' ? 'block' : 'hidden'} lg:block min-w-0 overflow-auto`}>
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
