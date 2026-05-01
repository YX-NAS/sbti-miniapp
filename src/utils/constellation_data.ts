/**
 * 星座运势数据访问层
 * 数据来源：src/data/constellation.json（静态数据）
 * 后期可扩展为后端API调用
 */

import constellationJson from '../data/constellation.json'

export type SignId = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
                     | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces'

export type PeriodType = 'today' | 'tomorrow' | 'week' | 'exam'

export interface LuckyInfo {
  luckyColor: string
  luckyNumber: number
  luckyItem: string
  matchSign: string
}

export interface ConstellationFortune {
  overallScore: number
  loveScore: number
  careerScore: number
  moneyScore: number
  healthScore: number
  luckyColor: string
  luckyNumber: number
  luckyItem: string
  matchSign: string
  shortComment: string
  overall: string
  love: string
  career: string
  money: string
  health: string
  examTip?: string
  examWishCount?: number
}

export interface ConstellationSign {
  id: SignId
  name: string
  emoji: string
  dateRange: string
  periods: {
    today: ConstellationFortune
    tomorrow: ConstellationFortune
    week: ConstellationFortune
    exam: ConstellationFortune
  }
}

/** 获取所有星座列表 */
export function getAllSigns(): { id: string; name: string; emoji: string; dateRange: string }[] {
  return (constellationJson as any).signs.map((s: any) => ({
    id: s.id,
    name: s.name,
    emoji: s.emoji,
    dateRange: s.dateRange,
  }))
}

/** 根据ID获取单个星座数据 */
export function getConstellationById(signId: string): ConstellationSign | undefined {
  return (constellationJson as any).signs.find((s: any) => s.id === signId) as ConstellationSign | undefined
}

/** 获取指定星座 + 指定时段的运势 */
export function getFortune(signId: string, period: PeriodType): ConstellationFortune | undefined {
  const sign = getConstellationById(signId)
  return sign?.periods[period] as ConstellationFortune | undefined
}

/** 获取五维评分（用于雷达条） */
export function getScores(signId: string, period: PeriodType): { label: string; key: string; value: number }[] | undefined {
  const fortune = getFortune(signId, period)
  if (!fortune) return undefined
  return [
    { label: '综合运势', key: 'overall', value: fortune.overallScore },
    { label: '爱情运势', key: 'love', value: fortune.loveScore },
    { label: '事业学业', key: 'career', value: fortune.careerScore },
    { label: '财富运势', key: 'money', value: fortune.moneyScore },
    { label: '健康运势', key: 'health', value: fortune.healthScore },
  ]
}

/** 获取幸运信息 */
export function getLuckyInfo(signId: string, period: PeriodType): LuckyInfo | undefined {
  const fortune = getFortune(signId, period)
  if (!fortune) return undefined
  return {
    luckyColor: fortune.luckyColor,
    luckyNumber: fortune.luckyNumber,
    luckyItem: fortune.luckyItem,
    matchSign: fortune.matchSign,
  }
}

/** 判断分值对应的颜色 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#6BCB77'   // 优秀-绿
  if (score >= 60) return '#4D96FF'   // 良好-蓝
  if (score >= 40) return '#FFD93D'   // 一般-黄
  return '#FF8E8E'                     // 较差-红
}

/** 获取分值对应的标签 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return '优秀'
  if (score >= 60) return '良好'
  if (score >= 40) return '一般'
  return '欠佳'
}
