import { describe, it, expect, beforeEach } from 'vitest'
import {
  readProgress,
  visitStep,
  completeStep,
  resetPackage,
  displayState,
  completion,
  STORAGE_KEY,
} from '../progress'
import { loadPackage } from '../loader'

const pkg = loadPackage({
  id: 'react',
  meta: { title: 'R', description: '', language: 'react', defaultCode: '' },
  chapters: [
    {
      id: 'c1',
      title: 'C1',
      steps: [
        { id: 's1', title: '1', description: '' },
        { id: 's2', title: '2', description: '' },
      ],
    },
    { id: 'c2', title: 'C2', steps: [{ id: 's3', title: '3', description: '' }] },
  ],
})

beforeEach(() => window.localStorage.clear())

describe('localStorage 读写', () => {
  it('空态返回 {}', () => {
    expect(readProgress()).toEqual({})
  })

  it('visitStep 记断点，completeStep 记完成集合', () => {
    visitStep('react', 's1')
    const p = completeStep('react', 's1')
    expect(p.currentStepId).toBe('s1')
    expect(p.completedStepIds).toEqual(['s1'])
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!).react.currentStepId).toBe('s1')
  })

  it('completeStep 去重、只增不减', () => {
    completeStep('react', 's1')
    completeStep('react', 's1') // 重复
    const p = completeStep('react', 's2')
    expect(p.completedStepIds).toEqual(['s1', 's2'])
  })

  it('损坏数据不崩，按空态兜底', () => {
    window.localStorage.setItem(STORAGE_KEY, '{ not json')
    expect(readProgress()).toEqual({})
  })

  it('resetPackage 真删该包进度', () => {
    completeStep('react', 's1')
    resetPackage('react')
    expect(readProgress().react).toBeUndefined()
  })
})

describe('displayState 派生（永不 locked）', () => {
  it('current 优先于 done', () => {
    const p = { currentStepId: 's1', completedStepIds: ['s1'], lastVisitedAt: '' }
    expect(displayState('s1', p)).toBe('current')
  })
  it('完成集合内为 done，其余 idle', () => {
    const p = { currentStepId: 's3', completedStepIds: ['s1'], lastVisitedAt: '' }
    expect(displayState('s1', p)).toBe('done')
    expect(displayState('s2', p)).toBe('idle')
  })
  it('无进度全 idle', () => {
    expect(displayState('s1', null)).toBe('idle')
  })
})

describe('completion 完成度', () => {
  it('已完成/总步数百分比', () => {
    const p = { currentStepId: 's2', completedStepIds: ['s1', 's2'], lastVisitedAt: '' }
    expect(completion(pkg, p)).toEqual({ done: 2, total: 3, percent: 67 })
  })
  it('忽略 JSON 里已不存在的旧 stepId', () => {
    const p = { currentStepId: null, completedStepIds: ['s1', 'ghost'], lastVisitedAt: '' }
    expect(completion(pkg, p).done).toBe(1)
  })
  it('无进度为 0', () => {
    expect(completion(pkg, null)).toEqual({ done: 0, total: 3, percent: 0 })
  })
})
