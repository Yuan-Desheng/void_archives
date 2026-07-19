'use client'

import type { TutorialPackage } from '@/lib/engine/schema'
import { displayState, type PackageProgress } from '@/lib/engine/progress'

/** 章节 / 步骤大纲树（R2）。节点显示态 done/current/idle，永不 locked（D4） */
export function Outline({
  pkg,
  currentStepId,
  progress,
  onJump,
}: {
  pkg: TutorialPackage
  currentStepId: string
  progress: PackageProgress | null
  onJump: (stepId: string) => void
}) {
  return (
    <nav className="text-sm">
      {pkg.chapters.map((ch) => (
        <div key={ch.id} className="mb-4">
          <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
            {ch.title}
          </div>
          <ul className="space-y-0.5">
            {ch.steps.map((s) => {
              const st = s.id === currentStepId ? 'current' : displayState(s.id, progress)
              return (
                <li key={s.id}>
                  <button
                    onClick={() => onJump(s.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 transition ${
                      st === 'current'
                        ? 'bg-primary text-primary-fg'
                        : 'text-fg hover:bg-surface-2'
                    }`}
                  >
                    <span
                      className={`inline-block w-3.5 shrink-0 text-center ${
                        st === 'done' ? 'text-fg' : 'text-muted'
                      }`}
                    >
                      {st === 'done' ? '✓' : st === 'current' ? '●' : '○'}
                    </span>
                    <span className="truncate">{s.title}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
