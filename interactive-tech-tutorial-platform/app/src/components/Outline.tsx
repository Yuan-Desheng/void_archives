'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { TutorialPackage } from '@/lib/engine/schema'
import { displayState, type PackageProgress } from '@/lib/engine/progress'
import { Input } from '@/components/ui/input'

/**
 * 章节 / 步骤大纲树（theme-library F6/F9/F10/F11）。
 * - F6 章节折叠/展开；F10 当前所在章节自动展开
 * - F9 章节级「已完成/总步数」统计
 * - F11 关键字检索：输入即收窄并高亮匹配的步骤，命中项所在章节自动展开
 * 节点显示态 done/current/idle，永不 locked（D4：不拦人）。
 */
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
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const searching = q.length > 0

  const currentChapterId = useMemo(
    () => pkg.chapters.find((ch) => ch.steps.some((s) => s.id === currentStepId))?.id ?? null,
    [pkg, currentStepId],
  )

  // 初始只展开当前章（F10）
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    currentChapterId ? { [currentChapterId]: true } : {},
  )

  // 切到别的章节时自动展开当前章，不折叠用户已手动展开的其它章
  useEffect(() => {
    if (currentChapterId) {
      setExpanded((e) => (e[currentChapterId] ? e : { ...e, [currentChapterId]: true }))
    }
  }, [currentChapterId])

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }))

  const anyMatch =
    !searching || pkg.chapters.some((ch) => ch.steps.some((s) => s.title.toLowerCase().includes(q)))

  return (
    <nav className="text-sm">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索步骤…"
        className="mb-3 h-8"
      />

      {pkg.chapters.map((ch) => {
        const matched = searching ? ch.steps.filter((s) => s.title.toLowerCase().includes(q)) : ch.steps
        if (searching && matched.length === 0) return null
        const total = ch.steps.length
        const done = progress ? ch.steps.filter((s) => progress.completedStepIds.includes(s.id)).length : 0
        const open = searching || !!expanded[ch.id]

        return (
          <div key={ch.id} className="mb-2">
            <button
              onClick={() => !searching && toggle(ch.id)}
              className="w-full flex items-center gap-1.5 mb-1 text-muted-foreground hover:text-foreground transition"
            >
              <span className="inline-block w-3 text-center text-xs">{open ? '▾' : '▸'}</span>
              <span className="flex-1 text-left text-xs font-semibold tracking-wide">{ch.title}</span>
              <span className="text-[10px] tabular-nums">{done}/{total}</span>
            </button>

            {open && (
              <ul className="space-y-0.5 pl-1">
                {matched.map((s) => {
                  const st = s.id === currentStepId ? 'current' : displayState(s.id, progress)
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => onJump(s.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 transition ${
                          st === 'current'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-accent'
                        }`}
                      >
                        <span
                          className={`inline-block w-3.5 shrink-0 text-center ${
                            st === 'done' ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {st === 'done' ? '✓' : st === 'current' ? '●' : '○'}
                        </span>
                        <span className="truncate">{highlight(s.title, q)}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}

      {!anyMatch && <div className="text-xs text-muted-foreground px-2 py-1">无匹配步骤</div>}
    </nav>
  )
}

/** 把标题里命中检索词的片段高亮（F11） */
function highlight(text: string, q: string): ReactNode {
  if (!q) return text
  const i = text.toLowerCase().indexOf(q)
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent text-primary font-semibold">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}
