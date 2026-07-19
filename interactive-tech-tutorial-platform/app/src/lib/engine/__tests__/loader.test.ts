import { describe, it, expect } from 'vitest'
import {
  loadPackage,
  flattenSteps,
  totalSteps,
  indexOfStep,
  PackageValidationError,
} from '../loader'

const pkg = {
  id: 'react',
  meta: { title: 'R', description: '', language: 'react', defaultCode: '' },
  chapters: [
    {
      id: 'ch2',
      title: '第二章',
      order: 2,
      steps: [
        { id: 's2b', title: 'b', description: '', order: 2 },
        { id: 's2a', title: 'a', description: '', order: 1 },
      ],
    },
    {
      id: 'ch1',
      title: '第一章',
      order: 1,
      steps: [{ id: 's1', title: '1', description: '' }],
    },
  ],
}

describe('loadPackage', () => {
  it('校验通过并按 order 排序章节与步骤', () => {
    const p = loadPackage(pkg)
    expect(p.chapters.map((c) => c.id)).toEqual(['ch1', 'ch2'])
    expect(p.chapters[1].steps.map((s) => s.id)).toEqual(['s2a', 's2b'])
  })

  it('非法数据抛 PackageValidationError（Loader 是唯一守门人）', () => {
    expect(() => loadPackage({ id: 'x' })).toThrow(PackageValidationError)
  })

  it('order 缺省时退回声明顺序（稳定）', () => {
    const noOrder = {
      id: 'x',
      meta: { title: 'X', description: '', language: 'vanilla', defaultCode: '' },
      chapters: [
        { id: 'a', title: 'A', steps: [{ id: 's1', title: '1', description: '' }] },
        { id: 'b', title: 'B', steps: [{ id: 's2', title: '2', description: '' }] },
      ],
    }
    expect(loadPackage(noOrder).chapters.map((c) => c.id)).toEqual(['a', 'b'])
  })
})

describe('flattenSteps / totalSteps / indexOfStep', () => {
  it('拍平成线性序列并连续编号', () => {
    const flat = flattenSteps(loadPackage(pkg))
    expect(flat.map((f) => f.step.id)).toEqual(['s1', 's2a', 's2b'])
    expect(flat.map((f) => f.index)).toEqual([0, 1, 2])
    expect(flat[1].chapterId).toBe('ch2')
  })

  it('totalSteps 跨章节求和', () => {
    expect(totalSteps(loadPackage(pkg))).toBe(3)
  })

  it('indexOfStep 定位；不存在返回 -1', () => {
    const p = loadPackage(pkg)
    expect(indexOfStep(p, 's2a')).toBe(1)
    expect(indexOfStep(p, 'ghost')).toBe(-1)
  })
})
