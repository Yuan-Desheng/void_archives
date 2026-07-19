import { describe, it, expect } from 'vitest'
import { TutorialPackageSchema } from '../schema'

const minimalReact = {
  id: 'react',
  status: 'active',
  meta: {
    title: 'React 入门',
    description: '跟着可运行沙箱学 React',
    language: 'react',
    defaultCode: 'export default function App(){ return <h1>Hi</h1> }',
    dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0' },
  },
  chapters: [
    {
      id: 'ch-jsx',
      title: 'JSX 与组件',
      order: 1,
      steps: [
        {
          id: 'st-first',
          title: '第一个组件',
          description: 'React 组件就是返回 JSX 的函数。',
          order: 1,
          files: { '/App.js': 'export default function App(){ return <h1>Hi</h1> }' },
        },
      ],
    },
  ],
}

describe('TutorialPackageSchema', () => {
  it('接受合法的 React 教程包', () => {
    const r = TutorialPackageSchema.safeParse(minimalReact)
    expect(r.success).toBe(true)
  })

  it('接受任意新主题 id（R8：不枚举限定，vue 无需改 Schema）', () => {
    const vue = { ...minimalReact, id: 'vue', meta: { ...minimalReact.meta, language: 'vue' } }
    expect(TutorialPackageSchema.safeParse(vue).success).toBe(true)
  })

  it('接受省略可选字段（status/dependencies/order/files/solution 都可选）', () => {
    const bare = {
      id: 'js',
      meta: { title: 'JS', description: '', language: 'vanilla', defaultCode: '' },
      chapters: [{ id: 'c1', title: 'C1', steps: [{ id: 's1', title: 'S1', description: '' }] }],
    }
    expect(TutorialPackageSchema.safeParse(bare).success).toBe(true)
  })

  it('拒绝缺失 meta.language（沙箱 template 必需）', () => {
    const bad = { ...minimalReact, meta: { ...minimalReact.meta, language: undefined } }
    expect(TutorialPackageSchema.safeParse(bad).success).toBe(false)
  })

  it('拒绝空章节里的空步骤数组', () => {
    const bad = { ...minimalReact, chapters: [{ id: 'c', title: 'C', steps: [] }] }
    expect(TutorialPackageSchema.safeParse(bad).success).toBe(false)
  })

  it('拒绝步骤缺 id', () => {
    const bad = structuredClone(minimalReact)
    // @ts-expect-error 故意删必填字段测校验
    delete bad.chapters[0].steps[0].id
    expect(TutorialPackageSchema.safeParse(bad).success).toBe(false)
  })
})
