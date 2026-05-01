import { View, Text, Button } from '@tarojs/components'
import { useEffect, useState, type CSSProperties } from 'react'
import Taro, { useDidShow, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { trackEvent } from '../../utils/analytics'
import { getHomePageContent } from '../../utils/contentConfig'
import './index.scss'

const FIREWORK_UNLOCK_TAP_COUNT = 6
const FIREWORK_DURATION = 3000
const FIREWORKS = [
  { id: 'firework-1', top: '20%', left: '18%', color: '#FF6B9D', delay: '0s' },
  { id: 'firework-2', top: '28%', left: '74%', color: '#FFD93D', delay: '0.3s' },
  { id: 'firework-3', top: '42%', left: '48%', color: '#5B7CFA', delay: '0.55s' },
  { id: 'firework-4', top: '58%', left: '24%', color: '#6BCB77', delay: '0.9s' },
  { id: 'firework-5', top: '64%', left: '78%', color: '#B784E8', delay: '1.15s' },
  { id: 'firework-6', top: '48%', left: '84%', color: '#FF8C7A', delay: '1.4s' },
]

// 功能卡片配置
const FUNCTION_CARDS = [
  {
    id: 'constellation',
    emoji: '🌟',
    title: '星座运势',
    desc: '每日星座解读',
    color: '#B784E8',
    bgLight: 'rgba(183,132,232,0.1)',
    path: '/pages/constellation/home/index',
  },
  {
    id: 'match',
    emoji: '🏠',
    title: '室友匹配',
    desc: '星座合拍度分析',
    color: '#4D96FF',
    bgLight: 'rgba(77,150,255,0.1)',
    path: '/pages/match/index',
  },
  {
    id: 'daily',
    emoji: '🔮',
    title: '每日测试',
    desc: '每天一个小测试',
    color: '#FFD93D',
    bgLight: 'rgba(255,217,61,0.12)',
    path: '/pages/daily-test/index',
  },
  {
    id: 'couple',
    emoji: '💕',
    title: 'CP配对',
    desc: '星座CP指数分析',
    color: '#FF6B9D',
    bgLight: 'rgba(255,107,157,0.1)',
    path: '/pages/couple-match/index',
  },
  {
    id: 'test-type',
    emoji: '📝',
    title: '性格测试',
    desc: '多种测试题库',
    color: '#6BCB77',
    bgLight: 'rgba(107,203,119,0.1)',
    path: '/pages/test-type/index',
  },
]

export default function Index() {
  const [pageContent, setPageContent] = useState(() => getHomePageContent())
  const [titleTapCount, setTitleTapCount] = useState(0)
  const [showFireworks, setShowFireworks] = useState(false)

  useDidShow(() => {
    setPageContent(getHomePageContent())
  })

  useEffect(() => {
    if (!showFireworks) return

    const timer = setTimeout(() => {
      setShowFireworks(false)
    }, FIREWORK_DURATION)

    return () => clearTimeout(timer)
  }, [showFireworks])

  useShareAppMessage(() => ({
    title: '🌟 星座人格实验室 — 探索你的性格特质',
    path: '/pages/index/index',
  }))

  useShareTimeline(() => ({
    title: '🌟 星座人格实验室 — 校园人格类型测试',
    query: '',
  }))

  const handleCardClick = (path: string, source: string, entryId: string) => {
    trackEvent('home_entry_click', { source, entryId })
    Taro.navigateTo({ url: path })
  }

  const handleSbtiStart = () => {
    trackEvent('home_entry_click', { source: 'sbti-banner', entryId: 'sbti-main-test' })
    Taro.navigateTo({ url: '/pages/test/index' })
  }

  const handleHeaderTap = () => {
    if (showFireworks) return

    const nextCount = titleTapCount + 1
    setTitleTapCount(nextCount)

    if (nextCount < FIREWORK_UNLOCK_TAP_COUNT) {
      trackEvent('home_title_tap', { step: nextCount })
      return
    }

    setTitleTapCount(0)
    setShowFireworks(true)
    trackEvent('home_fireworks_triggered', { trigger: 'title-tap' })
  }

  return (
    <View className="index-container">
      {showFireworks && (
        <View className="fireworks-overlay">
          <View className="fireworks-mask" />
          {FIREWORKS.map(firework => (
            <View
              key={firework.id}
              className="firework-burst"
              style={{
                top: firework.top,
                left: firework.left,
                '--firework-color': firework.color,
                '--firework-delay': firework.delay,
              } as CSSProperties}
            >
              <View className="firework-core" />
              {Array.from({ length: 8 }).map((_, index) => (
                <View key={`${firework.id}-${index}`} className={`firework-particle particle-${index + 1}`} />
              ))}
            </View>
          ))}
        </View>
      )}

      {/* 顶部装饰 */}
      <View className="top-decor">
        <View className="decor-circle circle-1" />
        <View className="decor-circle circle-2" />
      </View>

      {/* 顶部 Banner */}
      <View className="header">
        <Text className="header-title" onClick={handleHeaderTap}>🌟 星座人格实验室</Text>
        <Text className="header-subtitle">了解自己，探索世界</Text>
      </View>

      {/* 功能卡片区 */}
      <View className="cards-section">
        <View className="cards-row-1">
          {FUNCTION_CARDS.slice(0, 3).map(card => (
            <View
              key={card.id}
              className="func-card"
              style={{
                background: card.bgLight,
                borderColor: `${card.color}30`
              }}
              onClick={() => handleCardClick(card.path, 'function-card', card.id)}
            >
              <Text className="card-emoji">{card.emoji}</Text>
              <Text className="card-title" style={{ color: card.color }}>{card.title}</Text>
              <Text className="card-desc">{card.desc}</Text>
            </View>
          ))}
        </View>

        <View className="cards-row-2">
          {FUNCTION_CARDS.slice(3).map(card => (
            <View
              key={card.id}
              className="func-card"
              style={{
                background: card.bgLight,
                borderColor: `${card.color}30`
              }}
              onClick={() => handleCardClick(card.path, 'function-card', card.id)}
            >
              <Text className="card-emoji">{card.emoji}</Text>
              <Text className="card-title" style={{ color: card.color }}>{card.title}</Text>
              <Text className="card-desc">{card.desc}</Text>
            </View>
          ))}
          {/* 占位，保持两列对称 */}
          <View className="func-card-placeholder" />
        </View>
      </View>

      <View className="section-block">
        <View className="section-heading">
          <Text className="section-title">🔥 本周热门</Text>
        </View>
        <View className="hot-test-list">
          {pageContent.hotTests.map(item => (
            <View
              key={item.id}
              className="hot-test-card"
              onClick={() => handleCardClick(item.path, 'hot-test', item.id)}
            >
              <View className="hot-test-top">
                <Text className="hot-test-emoji">{item.emoji}</Text>
                <Text className="hot-test-tag" style={{ color: item.color, background: `${item.color}16` }}>
                  {item.tag}
                </Text>
              </View>
              <Text className="hot-test-title">{item.title}</Text>
              <Text className="hot-test-desc">{item.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="section-block">
        <View className="section-heading">
          <Text className="section-title">🎒 学生专题</Text>
        </View>
        <View className="topic-grid">
          {pageContent.featureTopics.map(item => (
            <View
              key={item.id}
              className="topic-card"
              onClick={() => handleCardClick(item.path, 'topic-entry', item.id)}
            >
              <Text className="topic-title">{item.title}</Text>
              <Text className="topic-desc">{item.desc}</Text>
              <Text className="topic-arrow">立即进入 →</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 校园人格专区 */}
      <View className="sbti-section">
        <View className="sbti-card">
          <View className="sbti-decor sbti-decor-left" />
          <View className="sbti-decor sbti-decor-right" />
          <View className="sbti-card-content">
            <Text className="sbti-icon">🔮</Text>
            <View className="sbti-text-group">
              <Text className="sbti-title">校园人格类型测试</Text>
              <Text className="sbti-desc">从学习、社交和关系节奏里看看你的校园画像</Text>
              <View className="sbti-tags">
                <Text className="sbti-tag">共31道题</Text>
                <Text className="sbti-tag">约5分钟</Text>
                <Text className="sbti-tag">仅供娱乐与自我观察参考</Text>
              </View>
            </View>
          </View>
          <Button className="sbti-btn" onClick={handleSbtiStart}>
            开始测试
          </Button>
        </View>
      </View>

      <View className="page-footer">
        <Text className="footer-text">Copyright © 2026 星座人格实验室</Text>
      </View>
    </View>
  )
}
