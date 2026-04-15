import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

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
  const handleCardClick = (path: string) => {
    Taro.navigateTo({ url: path })
  }

  const handleSbtiStart = () => {
    Taro.navigateTo({ url: '/pages/test/index' })
  }

  return (
    <View className="index-container">
      {/* 顶部装饰 */}
      <View className="top-decor">
        <View className="decor-circle circle-1" />
        <View className="decor-circle circle-2" />
      </View>

      {/* 顶部 Banner */}
      <View className="header">
        <Text className="header-title">🌟 星座人格实验室</Text>
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
              onClick={() => handleCardClick(card.path)}
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
              onClick={() => handleCardClick(card.path)}
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

      {/* SBTI 专区 */}
      <View className="sbti-section">
        <View className="sbti-card">
          <View className="sbti-decor sbti-decor-left" />
          <View className="sbti-decor sbti-decor-right" />
          <View className="sbti-card-content">
            <Text className="sbti-icon">🔮</Text>
            <View className="sbti-text-group">
              <Text className="sbti-title">SBTI 性格测试</Text>
              <Text className="sbti-desc">探索你的性格特质，发现真实的自己</Text>
              <View className="sbti-tags">
                <Text className="sbti-tag">共31道题</Text>
                <Text className="sbti-tag">约5分钟</Text>
                <Text className="sbti-tag">26种人格</Text>
              </View>
            </View>
          </View>
          <Button className="sbti-btn" onClick={handleSbtiStart}>
            开始测试
          </Button>
        </View>
      </View>
    </View>
  )
}
