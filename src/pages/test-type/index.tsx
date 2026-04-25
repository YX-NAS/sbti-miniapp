import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import Taro, { useDidShow, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { TOPIC_TEST_CONFIG, type TopicTestType } from '../../data/topicQuestions'
import { trackEvent } from '../../utils/analytics'
import { getTestCenterContent } from '../../utils/contentConfig'
import './index.scss'

const ADMIN_ENTRY_VISIBLE_KEY = 'test_center_admin_visible'
const ADMIN_UNLOCK_TAP_COUNT = 6

export default function TestType() {
  const [pageContent, setPageContent] = useState(() => getTestCenterContent())
  const [adminTapCount, setAdminTapCount] = useState(0)
  const [showAdminEntry, setShowAdminEntry] = useState(false)

  useDidShow(() => {
    setPageContent(getTestCenterContent())
    setShowAdminEntry(Boolean(Taro.getStorageSync(ADMIN_ENTRY_VISIBLE_KEY)))
  })

  useShareAppMessage(() => ({
    title: '🧪 测试中心已上新，快来选一个最适合你的测试！',
    path: '/pages/test-type/index',
  }))

  useShareTimeline(() => ({
    title: '🧪 星座人格实验室测试中心',
  }))

  const topicCards = pageContent.topicTests.map(item => {
    const config = TOPIC_TEST_CONFIG[item.id as TopicTestType]
    return {
      id: item.id,
      emoji: config.emoji,
      title: config.title,
      desc: config.subtitle,
      color: config.color,
      bg: `${config.color}12`,
      path: `/pages/test-by-type/index?type=${item.id}`,
      tag: `${config.count}题快测`,
    }
  })

  const handleClick = (item: { path: string; id: string; title: string }) => {
    trackEvent('test_center_click', { entryId: item.id, title: item.title })
    Taro.navigateTo({ url: item.path })
  }

  const handleGoHome = () => {
    trackEvent('test_center_click', { entryId: 'back-home', title: '返回主页' })
    Taro.reLaunch({ url: '/pages/index/index' })
  }

  const handleOpenAdmin = () => {
    trackEvent('test_center_click', { entryId: 'content-admin', title: '内容配置台' })
    Taro.navigateTo({ url: '/pages/admin-console/index' })
  }

  const handleTitleTap = () => {
    if (showAdminEntry) return

    const nextCount = adminTapCount + 1
    setAdminTapCount(nextCount)

    if (nextCount < ADMIN_UNLOCK_TAP_COUNT) {
      trackEvent('test_center_title_tap', { step: nextCount })
      return
    }

    Taro.setStorageSync(ADMIN_ENTRY_VISIBLE_KEY, true)
    setShowAdminEntry(true)
    setAdminTapCount(0)
    trackEvent('test_center_admin_unlocked', { trigger: 'title-tap' })
    Taro.showToast({ title: '配置台入口已显示', icon: 'success' })
  }

  const renderCard = (item: {
    id: string
    emoji: string
    title: string
    desc: string
    color: string
    bg: string
    path: string
    tag: string
  }) => {
    return (
      <View
        key={item.id}
        className="test-card"
        style={{ background: item.bg, borderColor: `${item.color}30` }}
        onClick={() => handleClick(item)}
      >
        <View className="card-top">
          <Text className="card-emoji">{item.emoji}</Text>
          <View className="available-tag">
            <Text className="available-text">{item.tag}</Text>
          </View>
        </View>
        <Text className="card-title" style={{ color: item.color }}>{item.title}</Text>
        <Text className="card-desc">{item.desc}</Text>
        <View className="card-btn" style={{ background: item.color }}>
          <Text className="card-btn-text">立即测试 →</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="test-type-container">
      <View className="page-header">
        <View className="header-action-row">
          <View className="home-btn" onClick={handleGoHome}>
            <Text className="home-btn-text">← 返回主页</Text>
          </View>
          {showAdminEntry ? (
            <View className="admin-btn" onClick={handleOpenAdmin}>
              <Text className="admin-btn-text">配置台</Text>
            </View>
          ) : (
            <View className="header-action-placeholder" />
          )}
        </View>
        <Text className="page-title" onClick={handleTitleTap}>🧪 测试中心</Text>
      </View>

      <View className="section-title-row">
        <Text className="section-title">🔥 核心测试</Text>
      </View>
      <View className="test-grid">
        {pageContent.coreTests.map(renderCard)}
      </View>

      <View className="section-title-row">
        <Text className="section-title">🎒 学生专题</Text>
      </View>
      <View className="test-grid">
        {topicCards.map(renderCard)}
      </View>
    </View>
  )
}
