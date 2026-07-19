#!/usr/bin/env node
/**
 * R8 门禁① —— 引擎零主题分支静态扫描。
 *
 * R8 成败判据：新增一个主题 JSON 即可跑通，引擎代码零改动。
 * 其物理保证之一是「引擎/组件代码里不允许出现主题字面量分支」
 * （如 `if (lang === 'react')` / `case 'vue'`）——一切主题差异必须外移到数据。
 *
 * 本脚本扫描 src/lib/engine 与 src/components 下的 .ts/.tsx，命中主题字面量
 * 作为条件分支即失败。内容 JSON（content/）是数据、不扫；__tests__ 是测试、不扫。
 *
 * 用法：node scripts/r8-guard.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOTS = ['src/lib/engine', 'src/components']
const THEMES = 'react|vue|vanilla|javascript|angular|svelte|solid|preact'
// 主题字面量出现在比较/分支上下文才算违规（纯 import React、类型名等不算）
const PATTERNS = [
  new RegExp(`(?:===|!==|==|!=|case)\\s*['"\`](${THEMES})['"\`]`, 'i'),
  new RegExp(`['"\`](${THEMES})['"\`]\\s*(?:===|!==|==|!=)`, 'i'),
]

function walk(dir) {
  let files = []
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return files // 目录不存在（如 components 尚未建）→ 跳过
  }
  for (const name of entries) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      if (name === '__tests__' || name === 'node_modules') continue
      files = files.concat(walk(p))
    } else if (['.ts', '.tsx'].includes(extname(p))) {
      files.push(p)
    }
  }
  return files
}

const violations = []
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      const trimmed = line.trim()
      // 跳过注释行：JSDoc/块注释（* 开头）、行注释（// 开头）、块注释起始（/* 开头）
      if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return
      const code = line.replace(/\/\/.*$/, '') // 去行尾注释
      for (const re of PATTERNS) {
        if (re.test(code)) violations.push(`${file}:${i + 1}  ${line.trim()}`)
      }
    })
  }
}

if (violations.length) {
  console.error('❌ R8 门禁①失败：引擎/组件里检测到主题字面量分支（应外移到数据）')
  violations.forEach((v) => console.error('   ' + v))
  console.error('\n   主题差异必须走 TutorialPackage 数据，引擎不得写死主题。')
  process.exit(1)
}
console.log('✅ R8 门禁①通过：引擎/组件零主题分支')
