import { packageSummaries } from '@/lib/engine/registry'
import { ThemeCards } from '@/components/ThemeCards'
import { ThemeToggle } from '@/components/ThemeToggle'

/** 首页 = 主题课程库。服务端遍历 content/ 发现全部主题（R8：新增 JSON 自动上架），SSG。 */
export default function Home() {
  const packages = packageSummaries()
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 h-14 border-b bg-card">
        <span className="font-semibold">互动技术教程</span>
        <ThemeToggle />
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold mb-1">选择一个主题开始学习</h1>
        <p className="text-sm text-muted-foreground mb-6">左讲解 · 右可运行沙箱 · 进度存在本地，随时继续。</p>
        <ThemeCards packages={packages} />
      </main>
    </div>
  )
}
