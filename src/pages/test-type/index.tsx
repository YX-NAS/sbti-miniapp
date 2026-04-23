import { View, Text } from '@tarojs/components'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { TOPIC_TEST_CONFIG, type TopicTestType } from '../../data/topicQuestions'
import { trackEvent } from '../../utils/analytics'
import './index.scss'

const CORE_TESTS = [
  {
    id: 'daily',
    emoji: '📅',
    title: '每日测试',
    desc: '每天一道趣味题，测测今天的你',
    color: '#FF8C32',
    bg: 'rgba(255,140,50,0.08)',
    path: '/pages/daily-test/index',
    tag: '每日更新',
  },
  {
    id: 'sbti',
    emoji: '🧠',
    title: 'SBTI 性格测试',
    desc: '31 道题快速探索你的性格核心',
    color: '#6C8EEF',
    bg: 'rgba(108,142,239,0.08)',
    path: '/pages/test/index',
    tag: '热门',
  },
]

export default function TestType() {
  useShareAppMessage(() => ({
    title: '🧪 测试中心已上新，快来选一个最适合你的测试！',
    path: '/pages/test-type/index',
  }))

  useShareTimeline(() => ({
    title: '🧪 星座人格实验室测试中心',
  }))

  const topicCards = (Object.entries(TOPIC_TEST_CONFIG) as Array<[TopicTestType, typeof TOPIC_TEST_CONFIG[TopicTestType]]>).map(([key, config]) => ({
    id: key,
    emoji: config.emoji,
    title: config.title,
    desc: config.subtitle,
    color: config.color,
    bg: `${config.color}12`,
    path: `/pages/test-by-type/index?type=${key}`,
    tag: `${config.count}题快测`,
  }))

  const handleClick = (item: { path: string; id: string; title: string }) => {
    trackEvent('test_center_click', { entryId: item.id, title: item.title })
    Taro.navigateTo({ url: item.path })
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
        <Text className="page-title">🧪 测试中心</Text>
        <Text className="page-subtitle">第一阶段已开放 6 个测试入口，适合学生群体快速分享</Text>
      </View>

      <View className="section-title-row">
        <Text className="section-title">🔥 核心测试</Text>
        <Text className="section-subtitle">适合首次进入和日常回访</Text>
      </View>
      <View className="test-grid">
        {CORE_TESTS.map(renderCard)}
      </View>

      <View className="section-title-row">
        <Text className="section-title">🎒 学生专题</Text>
        <Text className="section-subtitle">第一阶段新增的快测内容</Text>
      </View>
      <View className="test-grid">
        {topicCards.map(renderCard)}
      </View>

      <View className="bottom-tip">
        <Text className="tip-text">🌟 认真作答后，把结果发给同学和朋友会更好玩</Text>
      </View>
    </View>
  )
}
