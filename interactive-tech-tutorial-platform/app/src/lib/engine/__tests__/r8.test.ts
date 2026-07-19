import { describe, it, expect } from 'vitest'
import { loadPackage, flattenSteps, totalSteps } from '../loader'

/**
 * R8 门禁② —— 新增主题零引擎改动。
 *
 * 证明：一个 vue 包与 react 包走的是**同一个** Loader / 同一套引擎路径，
 * 引擎代码里没有任何地方区分主题。只要 JSON 合法，vue 就能被无差别加载，
 * 无需改任何 .ts。这与门禁①（静态零主题分支）互补，从行为上验证 R8。
 */
const vueFixture = {
  id: 'vue',
  status: 'active',
  meta: {
    title: 'Vue 入门',
    description: '换个主题包，引擎零改动',
    language: 'vue', // Sandpack template 由数据决定，非代码分支
    defaultCode: '<template><h1>Hi</h1></template>',
    dependencies: { vue: '^3.4.0' },
  },
  chapters: [
    {
      id: 'ch-basics',
      title: '基础',
      order: 1,
      steps: [
        {
          id: 'st-tpl',
          title: '模板语法',
          description: 'Vue 用模板描述 UI。',
          files: { '/App.vue': '<template><h1>{{ msg }}</h1></template>' },
          solution: { '/App.vue': '<template><h1>Hi</h1></template>' },
        },
      ],
    },
  ],
}

describe('R8 门禁②：新增主题零引擎改动', () => {
  it('vue 包与 react 走同一 Loader，无差别加载', () => {
    const p = loadPackage(vueFixture)
    expect(p.id).toBe('vue')
    expect(p.meta.language).toBe('vue') // template 来自数据
    expect(totalSteps(p)).toBe(1)
  })

  it('引擎对 vue 步骤的拍平/导航与 react 完全一致', () => {
    const flat = flattenSteps(loadPackage(vueFixture))
    expect(flat[0].step.id).toBe('st-tpl')
    expect(flat[0].step.files?.['/App.vue']).toBeDefined()
    expect(flat[0].step.solution).toBeDefined()
  })
})
