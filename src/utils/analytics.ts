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
