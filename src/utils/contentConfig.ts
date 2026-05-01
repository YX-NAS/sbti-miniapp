import Taro from '@tarojs/taro'
import dailyQuestionsData from '../data/daily_questions.json'
import { DEFAULT_CONTENT_ADMIN_CONFIG, type ContentAdminConfig } from '../data/contentConfig'

const CONTENT_CONFIG_KEY = 'campus_content_admin_config_v2'

export type DailyQuestion = {
  id: string
  type: string
  typeEmoji: string
  question: string
  options: { label: string; text: string; scores: Record<string, number> }[]
  result: { title: string; desc: string; emoji: string }
}

function cloneConfig(config: ContentAdminConfig): ContentAdminConfig {
  return JSON.parse(JSON.stringify(config)) as ContentAdminConfig
}

function mergeListById<T extends { id: string }>(defaults: T[], stored?: T[]) {
  if (!stored?.length) return defaults

  const defaultMap = new Map(defaults.map(item => [item.id, item]))
  const merged = stored
    .filter(item => defaultMap.has(item.id))
    .map(item => ({ ...defaultMap.get(item.id)!, ...item }))

  defaults.forEach(item => {
    if (!merged.some(entry => entry.id === item.id)) {
      merged.push(item)
    }
  })

  return merged
}

export function getContentAdminConfig(): ContentAdminConfig {
  const defaults = cloneConfig(DEFAULT_CONTENT_ADMIN_CONFIG)
  const stored = Taro.getStorageSync(CONTENT_CONFIG_KEY) as ContentAdminConfig | undefined

  if (!stored) return defaults

  return {
    ...defaults,
    ...stored,
    hotTests: mergeListById(defaults.hotTests, stored.hotTests),
    featureTopics: mergeListById(defaults.featureTopics, stored.featureTopics),
    coreTests: mergeListById(defaults.coreTests, stored.coreTests),
    topicTests: mergeListById(defaults.topicTests, stored.topicTests),
    dailyQuestionOverrides: stored.dailyQuestionOverrides || {},
    constellation: {
      ...defaults.constellation,
      ...(stored.constellation || {}),
    },
  }
}

export function saveContentAdminConfig(config: ContentAdminConfig) {
  Taro.setStorageSync(CONTENT_CONFIG_KEY, cloneConfig(config))
}

export function resetContentAdminConfig() {
  Taro.setStorageSync(CONTENT_CONFIG_KEY, cloneConfig(DEFAULT_CONTENT_ADMIN_CONFIG))
}

export function getHomePageContent() {
  const config = getContentAdminConfig()
  return {
    hotTests: config.hotTests.filter(item => item.visible),
    featureTopics: config.featureTopics.filter(item => item.visible),
  }
}

export function getTestCenterContent() {
  const config = getContentAdminConfig()
  return {
    coreTests: config.coreTests.filter(item => item.visible),
    topicTests: config.topicTests.filter(item => item.visible),
  }
}

export function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getAllDailyQuestions() {
  return ((dailyQuestionsData as { questions: DailyQuestion[] }).questions || []) as DailyQuestion[]
}

export function getDailyQuestionForDate(date = new Date()): DailyQuestion {
  const questions = getAllDailyQuestions()
  const dateKey = formatDateKey(date)
  const config = getContentAdminConfig()
  const overrideId = config.dailyQuestionOverrides[dateKey]
  const overrideQuestion = questions.find(item => item.id === overrideId)

  if (overrideQuestion) return overrideQuestion

  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  const index = seed % questions.length
  return questions[index]
}

export function getConstellationPageConfig() {
  return getContentAdminConfig().constellation
}
