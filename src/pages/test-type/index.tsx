import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const TEST_TYPES = [
  {
    id: 'daily',
    emoji: '📅',
    title: '每日测试',
    desc: '每天一道趣味题，测测今天的你',
    color: '#FF8C32',
    bg: 'rgba(255,140,50,0.08)',
    path: '/pages/daily-test/index',
    status: 'available',
  },
  {
    id: 'mbti',
    emoji: '🧠',
    title: 'MBTI 性格测试',
    desc: '16型人格，探索你的内心世界',
    color: '#6C8EEF',
    bg: 'rgba(108,142,239,0.08)',
    path: '/pages/test/index',
    status: 'coming',
  },
  {
    id: 'love',
    emoji: '💕',
    title: '情感模式测试',
    desc: '了解你的恋爱风格和情感需求',
    color: '#FF6B9D',
    bg: 'rgba(255,107,157,0.08)',
    path: '/pages/test/index',
    status: 'coming',
  },
  {
    id: 'study',
    emoji: '📚',
    title: '学习风格测试',
    desc: '找到最适合你的学习方法',
    color: '#5CB85C',
    bg: 'rgba(92,184,92,0.08)',
    path: '/pages/test/index',
    status: 'coming',
  },
  {
    id: 'exam',
    emoji: '🎯',
    title: '考试心态测试',
    desc: '了解你的考场心理素质',
    color: '#9B59B6',
    bg: 'rgba(155,89,182,0.08)',
    path: '/pages/test/index',
    status: 'coming',
  },
  {
    id: 'career',
    emoji: '💼',
    title: '职业兴趣测试',
    desc: '探索你的职业倾向和天赋',
    color: '#E67E22',
    bg: 'rgba(230,126,34,0.08)',
    path: '/pages/test/index',
    status: 'coming',
  },
]

export default function TestType() {
  const handleClick = (item: typeof TEST_TYPES[0]) => {
    if (item.status === 'available') {
      Taro.navigateTo({ url: item.path })
    } else {
      Taro.showToast({ title: '功能即将上线', icon: 'none', duration: 2000 })
    }
  }

  return (
    <View className="test-type-container">
      <View className="page-header">
        <Text className="page-title">🧪 测试中心</Text>
        <Text className="page-subtitle">选择你感兴趣的测试，开启探索之旅</Text>
      </View>

      <View className="test-grid">
        {TEST_TYPES.map((item) => (
          <View
            key={item.id}
            className="test-card"
            style={{ background: item.bg, borderColor: `${item.color}30` }}
            onClick={() => handleClick(item)}
          >
            <View className="card-top">
              <Text className="card-emoji">{item.emoji}</Text>
              {item.status === 'coming' && (
                <View className="coming-tag">
                  <Text className="coming-text">敬请期待</Text>
                </View>
              )}
            </View>
            <Text className="card-title" style={{ color: item.color }}>{item.title}</Text>
            <Text className="card-desc">{item.desc}</Text>
            <View className="card-btn" style={{ background: item.color }}>
              <Text className="card-btn-text">
                {item.status === 'available' ? '立即测试 →' : '即将上线'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View className="bottom-tip">
        <Text className="tip-text">🌟 认真作答，结果会更准确哦</Text>
      </View>
    </View>
  )
}
