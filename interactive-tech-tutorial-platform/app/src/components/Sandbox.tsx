'use client'

import { useEffect, useRef, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
  type SandpackPredefinedTemplate,
} from '@codesandbox/sandpack-react'
import { Button } from '@/components/ui/button'

/**
 * R10「给我看答案」——用 useSandpack 真快照当前编辑内容，
 * 填入 solution，可切回。必须在 SandpackProvider 内部才能拿到 sandpack 上下文。
 */
function AnswerControl({ solution }: { solution?: Record<string, string> }) {
  const { sandpack } = useSandpack()
  const [showing, setShowing] = useState(false)
  const snapshot = useRef<Record<string, string>>({})

  if (!solution || Object.keys(solution).length === 0) {
    return <span className="text-xs text-muted-foreground">本步暂无参考答案</span>
  }

  const toggle = () => {
    if (!showing) {
      // 快照用户当前所有文件
      snapshot.current = Object.fromEntries(
        Object.entries(sandpack.files).map(([p, f]) => [p, f.code]),
      )
      for (const [p, code] of Object.entries(solution)) sandpack.updateFile(p, code)
      setShowing(true)
    } else {
      for (const [p, code] of Object.entries(snapshot.current)) sandpack.updateFile(p, code)
      setShowing(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={toggle}>
      {showing ? '切回我的代码' : '给我看答案'}
    </Button>
  )
}

/** 观察 <html> 的 .dark class，让 Sandpack 主题跟随平台亮暗 */
function useIsDark() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const el = document.documentElement
    const update = () => setDark(el.classList.contains('dark'))
    update()
    const obs = new MutationObserver(update)
    obs.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return dark
}

export interface SandboxProps {
  language: string // meta.language → Sandpack template（数据驱动，非主题分支）
  files?: Record<string, string>
  solution?: Record<string, string>
  defaultCode: string
  dependencies?: Record<string, string>
}

export function Sandbox({ language, files, solution, defaultCode, dependencies }: SandboxProps) {
  const dark = useIsDark()
  const spFiles = files && Object.keys(files).length > 0 ? files : { '/App.js': defaultCode }
  return (
    <SandpackProvider
      template={language as SandpackPredefinedTemplate}
      files={spFiles}
      theme={dark ? 'dark' : 'light'}
      customSetup={dependencies ? { dependencies } : undefined}
      options={{ recompileMode: 'delayed', recompileDelay: 400 }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b bg-card">
        <span className="text-xs text-muted-foreground font-mono">沙箱</span>
        <AnswerControl solution={solution} />
      </div>
      <SandpackLayout style={{ flexDirection: 'column' }}>
        <SandpackCodeEditor
          showRunButton
          showLineNumbers
          style={{ height: 320, flex: 'none', width: '100%' }}
        />
        <SandpackPreview
          showOpenInCodeSandbox={false}
          style={{ height: 300, flex: 'none', width: '100%' }}
        />
      </SandpackLayout>
    </SandpackProvider>
  )
}
