/**
 * CP配对计算工具
 * 数据来源：src/data/cp_matrix.json
 */

import cpMatrixJson from '../data/cp_matrix.json'

export type CpType = 'perfect' | 'good' | 'medium' | 'hard'

export interface CpResult {
  score: number
  type: CpType
  label: string
  summary: string
  cpName: string
  cpStory: string
  pros: string[]
  tips: string[]
  shareText: string
  signA: string
  signB: string
  signAName: string
  signBName: string
  signAEmoji: string
  signBEmoji: string
}

/** 获取星座列表 */
export const ALL_SIGNS = (cpMatrixJson as any).signs.map((s: any) => ({
  id: s.id,
  name: s.name,
  emoji: s.emoji,
}))

/** 计算CP匹配 */
export function calcCp(signA: string, signB: string): CpResult | null {
  const key1 = `${signA}-${signB}`
  const key2 = `${signB}-${signA}`

  const matrix = (cpMatrixJson as any).matrix
  const data = matrix[key1] || matrix[key2]

  if (!data) return null

  const signMeta = (cpMatrixJson as any).signs
  const metaA = signMeta.find((s: any) => s.id === signA)
  const metaB = signMeta.find((s: any) => s.id === signB)

  return {
    ...data,
    signA,
    signB,
    signAName: metaA?.name || signA,
    signBName: metaB?.name || signB,
    signAEmoji: metaA?.emoji || '',
    signBEmoji: metaB?.emoji || '',
  }
}

/** 获取CP分数对应的颜色 */
export function getCpColor(score: number): string {
  if (score >= 90) return '#FF6B9D'  // 天生一对-粉红
  if (score >= 75) return '#6BCB77'  // 甜蜜恋人-绿色
  if (score >= 55) return '#FFD93D'  // 磨合-黄色
  return '#FF8E8E'                    // 距离-红色
}

/** 获取CP类型标签 */
export function getCpLabelText(type: CpType): string {
  const map: Record<CpType, string> = {
    perfect: '💕 天生一对',
    good: '💑 甜蜜恋人',
    medium: '😐 慢慢磨合',
    hard: '😬 保持距离',
  }
  return map[type]
}

/** 获取等级名称 */
export function getCpLevelName(score: number): string {
  if (score >= 95) return '灵魂伴侣级'
  if (score >= 85) return '天生一对级'
  if (score >= 75) return '甜蜜恋人级'
  if (score >= 55) return '努力磨合级'
  return '保持距离级'
}
