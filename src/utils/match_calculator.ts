/**
 * 室友/搭档匹配计算工具
 * 数据来源：src/data/match_matrix.json
 */

import matchMatrixJson from '../data/match_matrix.json'

export type MatchType = 'perfect' | 'good' | 'medium' | 'hard'

export interface MatchResult {
  score: number
  type: MatchType
  label: string
  summary: string
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

/** 星座信息列表 */
export const ALL_SIGNS = (matchMatrixJson as any).signs.map((s: any) => ({
  id: s.id,
  name: s.name,
  emoji: s.emoji,
}))

/** 获取两个星座的匹配结果 */
export function calcMatch(signA: string, signB: string): MatchResult | null {
  // 保证 key 一致
  const key1 = `${signA}-${signB}`
  const key2 = `${signB}-${signA}`

  const matrix = (matchMatrixJson as any).matrix
  const data = matrix[key1] || matrix[key2]

  if (!data) return null

  // 获取星座名称和emoji
  const signMeta = (matchMatrixJson as any).signs
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

/** 获取分数对应的颜色 */
export function getMatchColor(score: number): string {
  if (score >= 80) return '#6BCB77'  // 完美-绿
  if (score >= 60) return '#4D96FF'  // 融洽-蓝
  if (score >= 40) return '#FFD93D'  // 磨合-黄
  return '#FF8E8E'                    // 距离-红
}

/** 获取匹配类型标签 */
export function getMatchLabelText(type: MatchType): string {
  const map: Record<MatchType, string> = {
    perfect: '💕 天生默契',
    good: '😊 相处融洽',
    medium: '😐 需要磨合',
    hard: '😬 保持距离',
  }
  return map[type]
}
