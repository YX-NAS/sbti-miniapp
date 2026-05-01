import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import BottomNav from '../../components/BottomNav'
import { trackEvent } from '../../utils/analytics'
import {
  formatSyncAt,
  getLastSyncAt,
  pullAndMergeRecords,
  pushRecordsToCloud,
} from '../../utils/cloudSync'
import { getRecommendations } from '../../utils/recommendations'
import { getResumeFullTests, getVisitStreak } from '../../utils/retention'
import { wxLogin } from '../../utils/userIdentity'
import './index.scss'

const HISTORY_KEY = 'campus_test_history_v2'

type HistoryEntry = {
  id: string
  testId: string
  title: string
  code: string
  summary: string
  completedAt: string
}

  const TEST_COLORS: Record<string, string> = {
    'campus-test': '#6C8D71',
    'catti-full': '#9C7BFF',
  'student-tendency': '#5B7CFA',
  'student-tendency-full': '#5B7CFA',
  'study-full': '#4D96FF',
  'char-full': '#FF6B9D',
  'love-full': '#FF8C7A',
  'char': '#FF6B9D',
  'love': '#FF8C7A',
    'fun': '#6BCB77',
  'study': '#4D96FF',
  'cat': '#9C7BFF',
  'tendency': '#5B7CFA',
}

  const TEST_EMOJIS: Record<string, string> = {
    'campus-test': '🧠',
    'catti-full': '🐱',
  'student-tendency': '🧭',
  'student-tendency-full': '🧭',
  'study-full': '📚',
  'char-full': '🧠',
  'love-full': '💕',
  'char': '🧠',
  'love': '💕',
    'fun': '🎮',
  'study': '📚',
  'cat': '🐱',
  'tendency': '🧭',
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hour = d.getHours().toString().padStart(2, '0')
    const min = d.getMinutes().toString().padStart(2, '0')
    return `${month}月${day}日 ${hour}:${min}`
  } catch {
    return ''
  }
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncAt, setSyncAt] = useState(getLastSyncAt())
  const [visitStreak, setVisitStreak] = useState(() => getVisitStreak())
  const [resumeCards, setResumeCards] = useState(() => getResumeFullTests())
  const recommendCards = getRecommendations('history')

  useDidShow(() => {
    const data = (Taro.getStorageSync(HISTORY_KEY) || []) as HistoryEntry[]
    setHistory(data)
    setSyncAt(getLastSyncAt())
    setVisitStreak(getVisitStreak())
    setResumeCards(getResumeFullTests())
    trackEvent('history_page_opened', { count: data.length })
    // 进入页面静默推送本地记录到云端
    pushRecordsToCloud().catch(() => {})
  })

  const handleSyncCloud = async () => {
    if (syncing) return
    setSyncing(true)
    try {
      await wxLogin()
      const result = await pullAndMergeRecords()
      const merged = (Taro.getStorageSync(HISTORY_KEY) || []) as HistoryEntry[]
      setHistory(merged)
      setSyncAt(getLastSyncAt())
      if (result.pulled > 0) {
        Taro.showToast({ title: `已同步 ${result.pulled} 条记录`, icon: 'success' })
      } else {
        Taro.showToast({ title: '已是最新', icon: 'success' })
      }
    } catch (_) {
      Taro.showToast({ title: '同步失败，请稍后再试', icon: 'none' })
    } finally {
      setSyncing(false)
    }
  }

  const handleClearHistory = () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true)
      setTimeout(() => setShowClearConfirm(false), 3000)
      return
    }
    Taro.removeStorageSync(HISTORY_KEY)
    setHistory([])
    setShowClearConfirm(false)
    trackEvent('history_cleared', {})
    Taro.showToast({ title: '记录已清除', icon: 'success' })
  }

  const handleEntryClick = (entry: HistoryEntry) => {
    trackEvent('history_entry_clicked', { testId: entry.testId })
    const pathMap: Record<string, string> = {
      'campus-test': '/pages/test/index',
      'catti-full': '/pages/catti-full/index',
      'student-tendency': '/pages/student-tendency/index',
      'student-tendency-full': '/pages/student-tendency/index',
      'study-full': '/pages/study-full/index',
      'char-full': '/pages/char-full/index',
      'love-full': '/pages/love-full/index',
    }
    const path = pathMap[entry.testId]
    if (path) {
      Taro.navigateTo({ url: path })
    }
  }

  const handleOpenCard = (item: { path: string; id: string; title: string }) => {
    trackEvent('history_recommend_click', { entryId: item.id, title: item.title })
    Taro.navigateTo({ url: item.path })
  }

  if (history.length === 0) {
    return (
      <View className="history-page">
        <View className="history-header">
          <Text className="history-title">测试记录</Text>
          <View className="sync-btn" onClick={handleSyncCloud}>
            <Text className="sync-text">{syncing ? '同步中…' : '☁️ 同步'}</Text>
          </View>
        </View>
        <View className="summary-card">
          <Text className="summary-num">{visitStreak.current || 1} 天</Text>
          <Text className="summary-title">最近你保持得不错</Text>
          <Text className="summary-desc">继续做快测和完整版，结果会一直沉淀在这里。</Text>
        </View>
        {resumeCards.length > 0 && (
          <View className="resume-wrap">
            {resumeCards.map(item => (
              <View key={item.id} className="resume-chip-card" onClick={() => handleOpenCard(item)}>
                <Text className="resume-chip-emoji">{item.emoji}</Text>
                <View className="resume-chip-copy">
                  <Text className="resume-chip-title">{item.title}</Text>
                  <Text className="resume-chip-desc">{item.progressText}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        <View className="history-empty">
          <Text className="empty-emoji">📭</Text>
          <Text className="empty-title">还没有测试记录</Text>
          <Text className="empty-desc">完成测试后，结果会自动保存在这里</Text>
          <View
            className="empty-go-btn"
            onClick={() => Taro.navigateTo({ url: '/pages/test-type/index' })}
          >
            <Text className="empty-go-text">去测试中心</Text>
          </View>
        </View>
        <BottomNav />
      </View>
    )
  }

  return (
    <View className="history-page">
      <View className="history-header">
        <Text className="history-title">测试记录</Text>
        <View className="sync-btn" onClick={handleSyncCloud}>
          <Text className="sync-text">{syncing ? '同步中…' : '☁️ 同步'}</Text>
        </View>
      </View>

      <View className="history-meta-row">
        <Text className="history-count">{history.length} 条记录</Text>
        {syncAt > 0 && <Text className="sync-at">{formatSyncAt(syncAt)}</Text>}
        <View className="clear-btn" onClick={handleClearHistory}>
          <Text className={`clear-text ${showClearConfirm ? 'confirm' : ''}`}>
            {showClearConfirm ? '确认清除' : '清除'}
          </Text>
        </View>
      </View>

      <View className="summary-card compact">
        <Text className="summary-num">{visitStreak.current || 1} 天</Text>
        <Text className="summary-title">连续访问中</Text>
        <Text className="summary-desc">{resumeCards.length > 0 ? `还有 ${resumeCards.length} 个完整版可以继续` : '可以继续做新的完整版沉淀记录'}</Text>
      </View>

      {resumeCards.length > 0 && (
        <View className="resume-wrap">
          {resumeCards.map(item => (
            <View key={item.id} className="resume-chip-card" onClick={() => handleOpenCard(item)}>
              <Text className="resume-chip-emoji">{item.emoji}</Text>
              <View className="resume-chip-copy">
                <Text className="resume-chip-title">{item.title}</Text>
                <Text className="resume-chip-desc">{item.progressText}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <ScrollView className="history-list" scrollY>
        {history.map(entry => {
          const color = TEST_COLORS[entry.testId] || '#888'
          const emoji = TEST_EMOJIS[entry.testId] || '📋'
          return (
            <View
              key={entry.id}
              className="history-item"
              onClick={() => handleEntryClick(entry)}
            >
              <View className="item-emoji-wrap" style={{ background: `${color}18` }}>
                <Text className="item-emoji">{emoji}</Text>
              </View>
              <View className="item-content">
                <Text className="item-title">{entry.title}</Text>
                <View className="item-meta">
                  <View className="item-code-tag" style={{ background: `${color}18`, color }}>
                    <Text className="item-code">{entry.code}</Text>
                  </View>
                  <Text className="item-summary" numberOfLines={1}>{entry.summary}</Text>
                </View>
                <Text className="item-time">{formatTime(entry.completedAt)}</Text>
              </View>
              <Text className="item-arrow" style={{ color }}>›</Text>
            </View>
          )
        })}
        <View className="history-footer">
          <Text className="footer-note">最多保留最近 20 条记录</Text>
        </View>
        <View className="recommend-wrap">
          <Text className="recommend-title">猜你喜欢</Text>
          {recommendCards.map(item => (
            <View key={item.id} className="recommend-card" onClick={() => handleOpenCard(item)}>
              <View className="recommend-emoji-wrap" style={{ background: `${item.color}18` }}>
                <Text className="recommend-emoji">{item.emoji}</Text>
              </View>
              <View className="recommend-copy">
                <Text className="recommend-name">{item.title}</Text>
                <Text className="recommend-desc">{item.desc}</Text>
              </View>
              <Text className="recommend-tag" style={{ color: item.color }}>{item.tag}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  )
}
