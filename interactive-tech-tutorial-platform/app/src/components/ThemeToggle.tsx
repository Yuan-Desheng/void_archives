'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** 亮/暗切换 + localStorage 记忆（D5：亮暗双主题）。默认跟随系统偏好 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('ittp:theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'dark' : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('ittp:theme', next ? 'dark' : 'light')
  }

  return (
    <Button variant="outline" size="icon" onClick={toggle} aria-label="切换主题">
      {dark ? <Moon /> : <Sun />}
    </Button>
  )
}
