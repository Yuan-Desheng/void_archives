import { loadPackage } from '@/lib/engine/loader'
import { Workspace } from '@/components/Workspace'
import reactJson from '@/content/react.json'

/** 首页 = React 主题工作台。服务端 loadPackage 校验（R8 唯一入口），SSG 静态化 */
export default function Home() {
  const pkg = loadPackage(reactJson)
  return <Workspace pkg={pkg} />
}
