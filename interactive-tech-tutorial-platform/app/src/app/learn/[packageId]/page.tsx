import { notFound } from 'next/navigation'
import { allPackages, getPackage } from '@/lib/engine/registry'
import { Workspace } from '@/components/Workspace'

/** SSG：为每个教程包预生成一条 /learn/[id] 路由。 */
export function generateStaticParams() {
  return allPackages().map((p) => ({ packageId: p.id }))
}

/** 学习工作台路由。服务端 loadPackage 校验（R8 唯一入口）后交给 Workspace。 */
export default async function LearnPage({
  params,
}: {
  params: Promise<{ packageId: string }>
}) {
  const { packageId } = await params
  const pkg = getPackage(packageId)
  if (!pkg) notFound()
  return <Workspace pkg={pkg} />
}
