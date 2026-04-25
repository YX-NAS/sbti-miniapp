import Taro from '@tarojs/taro'

const EVENT_LOG_KEY = 'sbti_event_log'
const EVENT_SUMMARY_KEY = 'sbti_event_summary'
const MAX_LOG_SIZE = 200

type EventValue = string | number | boolean

export type AnalyticsPayload = Record<string, EventValue | undefined>

type AnalyticsEvent = {
  name: string
  payload: AnalyticsPayload
  createdAt: number
}

type AnalyticsSummary = Record<
  string,
  {
    count: number
    lastPayload: AnalyticsPayload
    lastAt: number
  }
>

export function trackEvent(name: string, payload: AnalyticsPayload = {}) {
  const createdAt = Date.now()
  const logs = (Taro.getStorageSync(EVENT_LOG_KEY) as AnalyticsEvent[] | undefined) || []
  const nextLogs = [...logs.slice(-(MAX_LOG_SIZE - 1)), { name, payload, createdAt }]
  const summary = (Taro.getStorageSync(EVENT_SUMMARY_KEY) as AnalyticsSummary | undefined) || {}

  summary[name] = {
    count: (summary[name]?.count || 0) + 1,
    lastPayload: payload,
    lastAt: createdAt,
  }

  Taro.setStorageSync(EVENT_LOG_KEY, nextLogs)
  Taro.setStorageSync(EVENT_SUMMARY_KEY, summary)
}

export function getEventSummary(): AnalyticsSummary {
  return (Taro.getStorageSync(EVENT_SUMMARY_KEY) as AnalyticsSummary | undefined) || {}
}

export function getEventLogs(): AnalyticsEvent[] {
  return (Taro.getStorageSync(EVENT_LOG_KEY) as AnalyticsEvent[] | undefined) || []
}

// ── 完整版转化漏斗分析 ──────────────────────────────
// 追踪三个关键指标：解锁率、完成率、分享率

export type FulltestFunnelStats = {
  type: string
  quickOpened: number        // 快测打开次数
  fulltestUnlocked: number   // 完整版解锁次数
  fulltestOpened: number     // 完整版进入次数（点击按钮）
  fulltestCompleted: number  // 完整版完成次数
  fulltestShared: number     // 完整版结果分享次数
  unlockRate: string         // 解锁率 = unlocked / quickOpened
  completionRate: string     // 完成率 = completed / opened
  shareRate: string          // 分享率 = shared / completed
}

export function getFulltestFunnelStats(type: string): FulltestFunnelStats {
  const summary = getEventSummary()

  const quickOpened = summary[`topic_test_opened`]
    ? (getEventLogs().filter(e => e.name === 'topic_test_opened' && e.payload?.type === type).length)
    : 0

  const fulltestUnlocked = summary['topic_test_full_unlocked']
    ? (getEventLogs().filter(e => e.name === 'topic_test_full_unlocked' && e.payload?.type === type).length)
    : 0

  const fulltestOpened = summary['topic_test_full_open_click']
    ? (getEventLogs().filter(e => e.name === 'topic_test_full_open_click' && e.payload?.type === type).length)
    : (summary[`${type}_full_opened`]?.count ?? 0) + (summary['catti_full_opened']?.count ?? 0)

  const fulltestCompleted = type === 'cat'
    ? (summary['catti_full_completed']?.count ?? 0)
    : type === 'tendency'
    ? (summary['student_tendency_full_completed']?.count ?? 0)
    : 0

  const fulltestShared = type === 'cat'
    ? (summary['catti_full_shared']?.count ?? 0) + (summary['catti_full_result_share']?.count ?? 0)
    : type === 'tendency'
    ? (summary['student_tendency_full_result_share']?.count ?? 0)
    : 0

  const pct = (a: number, b: number) => b === 0 ? '-' : `${Math.round((a / b) * 100)}%`

  return {
    type,
    quickOpened,
    fulltestUnlocked,
    fulltestOpened,
    fulltestCompleted,
    fulltestShared,
    unlockRate: pct(fulltestUnlocked, quickOpened),
    completionRate: pct(fulltestCompleted, fulltestOpened),
    shareRate: pct(fulltestShared, fulltestCompleted),
  }
}

export function getAllFulltestFunnelStats(): FulltestFunnelStats[] {
  return ['cat', 'tendency'].map(getFulltestFunnelStats)
}
