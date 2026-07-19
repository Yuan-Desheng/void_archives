'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { PackageSummary } from '@/lib/engine/registry'
import { readProgress, type ProgressMap } from '@/lib/engine/progress'

/** 主题课程库卡片列表（theme-library F1-F5）。完成度/CTA 在客户端读 localStorage 派生。 */
export function ThemeCards({ packages }: { packages: PackageSummary[] }) {
  const [progress, setProgress] = useState<ProgressMap>({})
  useEffect(() => setProgress(readProgress()), [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {packages.map((p) => (
        <Card key={p.id} pkg={p} progress={progress[p.id]} />
      ))}
    </div>
  )
}

function Card({
  pkg,
  progress,
}: {
  pkg: PackageSummary
  progress?: { currentStepId: string | null; completedStepIds: string[] }
}) {
  const disabled = pkg.status !== 'active' || pkg.totalSteps === 0
  const validDone = progress
    ? progress.completedStepIds.filter((id) => pkg.allStepIds.includes(id)).length
    : 0
  const percent = pkg.totalSteps === 0 ? 0 : Math.round((validDone / pkg.totalSteps) * 100)
  const allDone = pkg.totalSteps > 0 && validDone >= pkg.totalSteps
  const hasProgress = !!progress?.currentStepId
  const cta = allDone ? '重新学习' : hasProgress ? '继续学习' : '开始学习'
  const statusLabel = pkg.status === 'maintenance' ? '维护中' : pkg.totalSteps === 0 ? '内容筹备中' : null

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-base">{pkg.title}</h2>
        {statusLabel && (
          <span className="text-xs text-muted border border-border rounded px-1.5 py-0.5 shrink-0">
            {statusLabel}
          </span>
        )}
      </div>
      <p className="text-sm text-muted mt-1 line-clamp-2 min-h-[2.5rem]">{pkg.description}</p>
      <div className="text-xs text-muted mt-3">
        {pkg.chapterCount} 章 · {pkg.totalSteps} 步
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted">{validDone}/{pkg.totalSteps} · {percent}%</span>
        <span className={`text-sm font-medium ${disabled ? 'text-muted' : 'text-primary'}`}>
          {disabled ? '暂不可学' : cta + ' →'}
        </span>
      </div>
    </>
  )

  const cls =
    'block rounded-lg border border-border bg-surface p-4 transition ' +
    (disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary hover:shadow-sm')

  if (disabled) return <div className={cls}>{inner}</div>
  return (
    <Link href={`/learn/${pkg.id}`} className={cls}>
      {inner}
    </Link>
  )
}
