import Taro from '@tarojs/taro'

const VISIT_STREAK_KEY = 'campus_visit_streak_v2'
const LAST_VISIT_DATE_KEY = 'campus_last_visit_date_v2'

export type VisitStreakState = {
  current: number
  lastVisitDate: string
  visitedToday: boolean
}

export type ResumeFullTest = {
  id: string
  title: string
  path: string
  emoji: string
  color: string
  progress: number
  progressText: string
}

const FULL_TEST_META = [
  { id: 'char-full', key: 'char_full', title: '继续学生性格完整版', path: '/pages/char-full/index', emoji: '🧠', color: '#FF6B9D', total: 12 },
  { id: 'love-full', key: 'love_full', title: '继续情感模式完整版', path: '/pages/love-full/index', emoji: '💕', color: '#FF8C7A', total: 12 },
  { id: 'study-full', key: 'study_full', title: '继续学习状态完整版', path: '/pages/study-full/index', emoji: '📚', color: '#4D96FF', total: 12 },
  { id: 'student-tendency-full', key: 'student_tendency_full', title: '继续学生人格倾向完整版', path: '/pages/student-tendency/index', emoji: '🧭', color: '#5B7CFA', total: 12 },
  { id: 'catti-full', key: 'catti_full', title: '继续 CatTi 完整版', path: '/pages/catti-full/index', emoji: '🐱', color: '#9C7BFF', total: 12 },
]

function getDateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getYesterdayKey(date = new Date()): string {
  const prev = new Date(date)
  prev.setDate(prev.getDate() - 1)
  return getDateKey(prev)
}

export function touchVisitStreak(date = new Date()): VisitStreakState {
  const today = getDateKey(date)
  const yesterday = getYesterdayKey(date)
  const lastVisitDate = (Taro.getStorageSync(LAST_VISIT_DATE_KEY) as string | undefined) || ''
  const currentSaved = (Taro.getStorageSync(VISIT_STREAK_KEY) as number | undefined) || 0

  if (lastVisitDate === today) {
    return { current: currentSaved || 1, lastVisitDate, visitedToday: true }
  }

  const nextStreak = lastVisitDate === yesterday ? currentSaved + 1 : 1
  Taro.setStorageSync(VISIT_STREAK_KEY, nextStreak)
  Taro.setStorageSync(LAST_VISIT_DATE_KEY, today)

  return { current: nextStreak, lastVisitDate: today, visitedToday: true }
}

export function getVisitStreak(): VisitStreakState {
  const lastVisitDate = (Taro.getStorageSync(LAST_VISIT_DATE_KEY) as string | undefined) || ''
  const current = (Taro.getStorageSync(VISIT_STREAK_KEY) as number | undefined) || 0
  return {
    current,
    lastVisitDate,
    visitedToday: lastVisitDate === getDateKey(),
  }
}

export function getResumeFullTests(): ResumeFullTest[] {
  return FULL_TEST_META.map(item => {
    const answers = Taro.getStorageSync(`${item.key}_answers`) as Record<string, unknown> | undefined
    const answeredCount = answers ? Object.keys(answers).length : 0
    if (!answeredCount) return null
    const progress = Math.min(100, Math.round((answeredCount / item.total) * 100))
    return {
      id: item.id,
      title: item.title,
      path: item.path,
      emoji: item.emoji,
      color: item.color,
      progress,
      progressText: `${answeredCount}/${item.total} 题`,
    }
  }).filter(Boolean) as ResumeFullTest[]
}
