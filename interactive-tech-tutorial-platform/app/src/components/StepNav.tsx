'use client'

/** 上一步/下一步 + 当前步/总步数（R2，对标 Vue3 的 1/15；永不阻塞 D4） */
export function StepNav({
  index,
  total,
  onPrev,
  onNext,
}: {
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  const btn =
    'px-4 py-2 rounded-md text-sm border border-border transition disabled:opacity-40 disabled:cursor-not-allowed'
  return (
    <div className="flex items-center justify-between gap-3">
      <button className={btn} onClick={onPrev} disabled={index === 0}>
        ← 上一步
      </button>
      <span className="text-xs text-muted font-mono">
        {index + 1} / {total}
      </span>
      <button
        className="px-4 py-2 rounded-md text-sm bg-primary text-primary-fg transition disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={onNext}
        disabled={index === total - 1}
      >
        下一步 →
      </button>
    </div>
  )
}
