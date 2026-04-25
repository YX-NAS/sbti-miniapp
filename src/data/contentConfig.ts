import type { TopicTestType } from './topicQuestions'
import type { PeriodType } from '../utils/constellation_data'

export type HomeHotTestConfig = {
  id: string
  emoji: string
  title: string
  desc: string
  tag: string
  color: string
  path: string
  visible: boolean
}

export type FeatureTopicConfig = {
  id: string
  title: string
  desc: string
  path: string
  visible: boolean
}

export type TestCenterCardConfig = {
  id: string
  emoji: string
  title: string
  desc: string
  color: string
  bg: string
  path: string
  tag: string
  visible: boolean
}

export type TopicTestEntryConfig = {
  id: TopicTestType
  visible: boolean
}

export type ConstellationPageConfig = {
  defaultPeriod: PeriodType
  noticeText: string
}

export type ContentAdminConfig = {
  hotTests: HomeHotTestConfig[]
  featureTopics: FeatureTopicConfig[]
  coreTests: TestCenterCardConfig[]
  topicTests: TopicTestEntryConfig[]
  dailyQuestionOverrides: Record<string, string>
  constellation: ConstellationPageConfig
}

export const CONSTELLATION_NOTICE_PRESETS = [
  '今日星座宜保持自己的节奏。',
  '最近适合调整状态，别被外界打乱步调。',
  '学习、社交、情绪都更适合稳住再推进。',
  '先照顾好自己的节奏，再处理外界变化。',
] as const

export const DEFAULT_CONTENT_ADMIN_CONFIG: ContentAdminConfig = {
  hotTests: [
    {
      id: 'hot-cat',
      emoji: '🐱',
      title: 'CatTi 猫系人格测试',
      desc: '看看你像校园里的哪种猫',
      tag: '动物TI',
      color: '#9C7BFF',
      path: '/pages/test-by-type/index?type=cat',
      visible: true,
    },
    {
      id: 'hot-tendency',
      emoji: '🧭',
      title: '学生人格倾向快测',
      desc: '4题先看你当前更偏哪种表达和思考节奏',
      tag: 'v2.3预告',
      color: '#5B7CFA',
      path: '/pages/test-by-type/index?type=tendency',
      visible: true,
    },
    {
      id: 'hot-char',
      emoji: '🏠',
      title: '宿舍气场测试',
      desc: '4题看你在宿舍里是哪种存在',
      tag: '学生热门',
      color: '#FF6B9D',
      path: '/pages/test-by-type/index?type=char',
      visible: true,
    },
    {
      id: 'hot-love',
      emoji: '💘',
      title: '暗恋反应测试',
      desc: '心动时你到底有多明显',
      tag: '适合分享',
      color: '#FF8C7A',
      path: '/pages/test-by-type/index?type=love',
      visible: true,
    },
    {
      id: 'hot-study',
      emoji: '📚',
      title: '考前状态测试',
      desc: '看看你属于哪种复习节奏',
      tag: '考前必测',
      color: '#4D96FF',
      path: '/pages/test-by-type/index?type=study',
      visible: true,
    },
  ],
  featureTopics: [
    {
      id: 'topic-center',
      title: '学生专题快测',
      desc: '宿舍 / 暗恋 / 学习 / 趣味 / 人格倾向',
      path: '/pages/test-type/index',
      visible: true,
    },
    {
      id: 'topic-daily',
      title: '今日一测',
      desc: '每天一道，适合发朋友和群聊',
      path: '/pages/daily-test/index',
      visible: true,
    },
  ],
  coreTests: [
    {
      id: 'daily',
      emoji: '📅',
      title: '每日测试',
      desc: '每天一道趣味题，测测今天的你',
      color: '#FF8C32',
      bg: 'rgba(255,140,50,0.08)',
      path: '/pages/daily-test/index',
      tag: '每日更新',
      visible: true,
    },
    {
      id: 'campus-ti',
      emoji: '🧠',
      title: '校园人格类型测试',
      desc: '31 道题看看你的校园画像和关系节奏',
      color: '#6C8EEF',
      bg: 'rgba(108,142,239,0.08)',
      path: '/pages/test/index',
      tag: '热门',
      visible: true,
    },
  ],
  topicTests: [
    { id: 'tendency', visible: true },
    { id: 'char', visible: true },
    { id: 'love', visible: true },
    { id: 'fun', visible: true },
    { id: 'study', visible: true },
    { id: 'cat', visible: true },
  ],
  dailyQuestionOverrides: {},
  constellation: {
    defaultPeriod: 'today',
    noticeText: CONSTELLATION_NOTICE_PRESETS[0],
  },
}
