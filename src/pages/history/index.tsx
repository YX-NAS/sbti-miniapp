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

  useDidShow(() => {
    const data = (Taro.getStorageSync(HISTORY_KEY) || []) as HistoryEntry[]
    setHistory(data)
    setSyncAt(getLastSyncAt())
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
    }
    const path = pathMap[entry.testId]
    if (path) {
      Taro.navigateTo({ url: path })
    }
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
      </ScrollView>

      <BottomNav />
    </View>
  )
}
