import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import SignSelector from '../../../components/SignSelector/index'
import ScoreCard from '../../../components/ScoreCard/index'
import RadarBar from '../../../components/RadarBar/index'
import LuckyInfoBar from '../../../components/LuckyInfoBar/index'
import {
  getConstellationById,
  getFortune,
  getScores,
  getLuckyInfo,
  PeriodType,
} from '../../../utils/constellation_data'
import { getConstellationPageConfig } from '../../../utils/contentConfig'
import './index.scss'

const PERIODS: { key: PeriodType; label: string }[] = [
  { key: 'today', label: '今日' },
  { key: 'tomorrow', label: '明日' },
  { key: 'week', label: '本周' },
  { key: 'exam', label: '考试运势' },
]

export default function ConstellationHome() {
  const [pageConfig, setPageConfig] = useState(() => getConstellationPageConfig())
  // 默认选中白羊座
  const [selectedSign, setSelectedSign] = useState<string>('aries')
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(pageConfig.defaultPeriod)
  const [expanded, setExpanded] = useState(false)
  const [wished, setWished] = useState(false)
  const [wishCount, setWishCount] = useState(0)

  useDidShow(() => {
    const nextConfig = getConstellationPageConfig()
    setPageConfig(nextConfig)
    setSelectedPeriod(nextConfig.defaultPeriod)
  })

  const signData = getConstellationById(selectedSign)
  const fortune = getFortune(selectedSign, selectedPeriod)
  const scores = getScores(selectedSign, selectedPeriod)
  const lucky = getLuckyInfo(selectedSign, selectedPeriod)
  const isExam = selectedPeriod === 'exam'

  useShareAppMessage(() => ({
    title: signData && fortune
      ? `${signData.emoji} ${signData.name}今日运势 ${fortune.overallScore}分 — "${fortune.shortComment}"`
      : '🌟 星座运势 — 看看今日星座运势',
    path: '/pages/constellation/home/index',
  }))

  const handleSignSelect = (signId: string) => {
    setSelectedSign(signId)
    setExpanded(false)
    setWished(false)
  }

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period)
    setExpanded(false)
    setWished(false)
  }

  const handleWish = () => {
    if (wished) return
    setWished(true)
    setWishCount(prev => prev + 1)
    Taro.showToast({ title: '祈愿成功！逢考必过 🎉', icon: 'none', duration: 2000 })
  }

  if (!signData || !fortune || !scores || !lucky) {
    return (
      <View className="constellation-container">
        <Text className="error-text">数据加载失败</Text>
      </View>
    )
  }

  return (
    <ScrollView className="constellation-container" scrollY>
      {/* 顶部 Banner */}
      <View className="top-banner">
        <View className="banner-decor decor-1" />
        <View className="banner-decor decor-2" />
        <View className="banner-decor decor-3" />
        <View className="banner-content">
          <Text className="banner-emoji">{signData.emoji}</Text>
          <View className="banner-info">
            <Text className="banner-name">{signData.name}</Text>
            <Text className="banner-date">{signData.dateRange}</Text>
          </View>
        </View>
      </View>

      {pageConfig.noticeText && (
        <View className="notice-card">
          <Text className="notice-text">{pageConfig.noticeText}</Text>
        </View>
      )}

      {/* 星座选择器 */}
      <View className="sign-selector-section">
        <SignSelector selected={selectedSign} onSelect={handleSignSelect} />
      </View>

      {/* Tab 切换 */}
      <View className="period-tabs">
        {PERIODS.map(p => (
          <View
            key={p.key}
            className={`period-tab ${selectedPeriod === p.key ? 'active' : ''}`}
            onClick={() => handlePeriodChange(p.key)}
          >
            <Text>{p.label}</Text>
          </View>
        ))}
      </View>

      {/* 运势内容区 */}
      <View className="fortune-content">
        {/* 评分卡片 */}
        <ScoreCard score={fortune.overallScore} label="综合运势" size="large" />

        {/* 五维雷达条 */}
        <View className="radar-section">
          <View className="section-title">
            <Text>📊 五维运势</Text>
          </View>
          <View className="radar-list">
            {scores.map(item => (
              <RadarBar key={item.key} label={item.label} value={item.value} />
            ))}
          </View>
        </View>

        {/* 幸运信息 */}
        <View className="lucky-section">
          <View className="section-title">
            <Text>🍀 幸运信息</Text>
          </View>
          <LuckyInfoBar
            luckyColor={lucky.luckyColor}
            luckyNumber={lucky.luckyNumber}
            luckyItem={lucky.luckyItem}
            matchSign={lucky.matchSign}
          />
        </View>

        {/* 短评气泡 */}
        <View className="short-comment">
          <Text className="comment-text">"{fortune.shortComment}"</Text>
        </View>

        {/* 详情折叠面板 */}
        <View className="detail-section">
          <View className="detail-toggle" onClick={() => setExpanded(!expanded)}>
            <Text className="toggle-text">{expanded ? '👆 收起详情' : '👇 点击查看详情'}</Text>
          </View>

          {expanded && (
            <View className="detail-list">
              <View className="detail-item">
                <Text className="detail-icon">💼</Text>
                <View className="detail-body">
                  <Text className="detail-label">综合运势</Text>
                  <Text className="detail-text">{fortune.overall}</Text>
                </View>
              </View>

              <View className="detail-item">
                <Text className="detail-icon">💕</Text>
                <View className="detail-body">
                  <Text className="detail-label">爱情运势</Text>
                  <Text className="detail-text">{fortune.love}</Text>
                </View>
              </View>

              <View className="detail-item">
                <Text className="detail-icon">📚</Text>
                <View className="detail-body">
                  <Text className="detail-label">事业学业</Text>
                  <Text className="detail-text">{fortune.career}</Text>
                </View>
              </View>

              <View className="detail-item">
                <Text className="detail-icon">💰</Text>
                <View className="detail-body">
                  <Text className="detail-label">财富运势</Text>
                  <Text className="detail-text">{fortune.money}</Text>
                </View>
              </View>

              <View className="detail-item">
                <Text className="detail-icon">🏥</Text>
                <View className="detail-body">
                  <Text className="detail-label">健康运势</Text>
                  <Text className="detail-text">{fortune.health}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 考试运势专属 */}
        {isExam && fortune.examTip && (
          <View className="exam-section">
            <View className="section-title">
              <Text>🎯 备考建议</Text>
            </View>
            <View className="exam-tip-card">
              <Text className="exam-tip-text">💡 {fortune.examTip}</Text>
            </View>

            <View className="wish-btn-wrap">
              <View
                className={`wish-btn ${wished ? 'wished' : ''}`}
                onClick={handleWish}
              >
                <Text className="wish-btn-text">
                  {wished ? '✨ 已祈愿' : '🙌 祈愿一下'}
                </Text>
                <Text className="wish-count">
                  {wished ? '祈愿成功！' : `已有 ${(fortune.examWishCount || 1000) + wishCount} 次祈愿`}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 底部留白 */}
      <View className="bottom-spacer" />
    </ScrollView>
  )
}
