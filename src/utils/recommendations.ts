import type { HomeHotTestConfig } from '../data/contentConfig'

export type RecommendationItem = {
  id: string
  emoji: string
  title: string
  desc: string
  color: string
  path: string
  tag: string
}

const RECOMMENDATION_MAP: Record<string, RecommendationItem> = {
  campus: {
    id: 'campus',
    emoji: '🧠',
    title: '校园人格类型测试',
    desc: '31 题看看你的校园画像和关系节奏',
    color: '#6C8EEF',
    path: '/pages/test/index',
    tag: '主测试',
  },
  daily: {
    id: 'daily',
    emoji: '📅',
    title: '每日测试',
    desc: '每天一道题，适合顺手测和转发',
    color: '#FF8C32',
    path: '/pages/daily-test/index',
    tag: '每日更新',
  },
  char: {
    id: 'char',
    emoji: '🧠',
    title: '学生性格测试',
    desc: '宿舍、同学、群聊里的真实你',
    color: '#FF6B9D',
    path: '/pages/test-by-type/index?type=char',
    tag: '快测',
  },
  love: {
    id: 'love',
    emoji: '💕',
    title: '情感模式测试',
    desc: '暗恋、暧昧和心动反应',
    color: '#FF8C7A',
    path: '/pages/test-by-type/index?type=love',
    tag: '快测',
  },
  study: {
    id: 'study',
    emoji: '📚',
    title: '学习状态测试',
    desc: '课堂、复习和考前情绪状态',
    color: '#4D96FF',
    path: '/pages/test-by-type/index?type=study',
    tag: '快测',
  },
  cat: {
    id: 'cat',
    emoji: '🐱',
    title: 'CatTi 猫系人格测试',
    desc: '看看你像校园里的哪种猫',
    color: '#9C7BFF',
    path: '/pages/test-by-type/index?type=cat',
    tag: '动物TI',
  },
  ocean: {
    id: 'ocean',
    emoji: '🌊',
    title: '海洋生物 Ti 测试',
    desc: '测测你更像哪种海洋生物与互动节奏',
    color: '#1AA7EC',
    path: '/pages/test-by-type/index?type=ocean',
    tag: 'v2.5主题',
  },
  tendency: {
    id: 'tendency',
    emoji: '🧭',
    title: '学生人格倾向快测',
    desc: '4题先看你当前更偏哪种表达与思考节奏',
    color: '#5B7CFA',
    path: '/pages/test-by-type/index?type=tendency',
    tag: '快测',
  },
}

const RECOMMENDATION_ORDER: Record<string, string[]> = {
  'campus-result': ['ocean', 'tendency', 'char'],
  history: ['ocean', 'cat', 'tendency'],
  char: ['ocean', 'love', 'tendency'],
  'char-full': ['love', 'study', 'cat'],
  love: ['ocean', 'char', 'tendency'],
  'love-full': ['char', 'study', 'tendency'],
  study: ['ocean', 'tendency', 'char'],
  'study-full': ['char', 'tendency', 'daily'],
  tendency: ['ocean', 'char', 'study'],
  'student-tendency-full': ['char', 'study', 'campus'],
  cat: ['ocean', 'tendency', 'char'],
  ocean: ['cat', 'tendency', 'study'],
  'catti-full': ['tendency', 'study', 'love'],
}

export function getRecommendations(currentId: string, limit = 3): RecommendationItem[] {
  const ids = RECOMMENDATION_ORDER[currentId] || RECOMMENDATION_ORDER.history
  return ids
    .map(id => RECOMMENDATION_MAP[id])
    .filter(Boolean)
    .slice(0, limit)
}

export function getSuggestedHotRotation(hotTests: HomeHotTestConfig[], date = new Date()): HomeHotTestConfig[] {
  const visible = hotTests.filter(item => item.visible)
  if (visible.length <= 1) return visible
  const shift = date.getDay() % visible.length
  return [...visible.slice(shift), ...visible.slice(0, shift)]
}

export function applySuggestedHotRotation(hotTests: HomeHotTestConfig[], date = new Date()): HomeHotTestConfig[] {
  const rotatedVisible = getSuggestedHotRotation(hotTests, date)
  const hidden = hotTests.filter(item => !item.visible)
  return [...rotatedVisible, ...hidden]
}
