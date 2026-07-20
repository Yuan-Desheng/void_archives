'use client'

import { Button } from '@/components/ui/button'

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
  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="outline" onClick={onPrev} disabled={index === 0}>
        ← 上一步
      </Button>
      <span className="text-xs text-muted-foreground font-mono">
        {index + 1} / {total}
      </span>
      <Button onClick={onNext} disabled={index === total - 1}>
        下一步 →
      </Button>
    </div>
  )
}
