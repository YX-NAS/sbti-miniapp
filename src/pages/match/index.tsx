import { View, Text, Button } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import SignSelector from '../../components/SignSelector/index'
import { calcMatch, ALL_SIGNS, getMatchColor, getMatchLabelText } from '../../utils/match_calculator'
import './index.scss'

export default function Match() {
  const [signA, setSignA] = useState('aries')
  const [signB, setSignB] = useState('taurus')
  const [result, setResult] = useState<ReturnType<typeof calcMatch>>(null)
  const [matched, setMatched] = useState(false)

  useShareAppMessage(() => ({
    title: result
      ? `${result.signAEmoji}${result.signAName} × ${result.signBEmoji}${result.signBName} 室友合拍度 ${result.score}分`
      : '🏠 室友/搭档匹配 — 看看你们星座合拍程度',
    path: '/pages/match/index',
  }))

  const handleMatch = () => {
    const res = calcMatch(signA, signB)
    if (res) {
      setResult(res)
      setMatched(true)
    }
  }

  const handleReset = () => {
    setMatched(false)
    setResult(null)
  }

  const handleShare = () => {
    Taro.showShareMenu({ withShareTicket: false })
  }

  const color = result ? getMatchColor(result.score) : '#6BCB77'
  const scorePercent = result ? `${result.score}%` : ''

  return (
    <View className="match-container">
      {/* 顶部装饰 */}
      <View className="top-decor">
        <View className="decor-circle c1" />
        <View className="decor-circle c2" />
        <View className="decor-circle c3" />
      </View>

      {/* 页面标题 */}
      <View className="page-header">
        <Text className="page-title">🏠 室友/搭档匹配</Text>
        <Text className="page-subtitle">选择双方星座，看看你们的合拍程度</Text>
      </View>

      {/* 选择区域 */}
      <View className="select-section">
        <View className="select-card">
          <Text className="select-label">你的星座</Text>
          <View className="sign-picked">
            <Text className="sign-emoji">
              {ALL_SIGNS.find(s => s.id === signA)?.emoji}
            </Text>
            <Text className="sign-name">
              {ALL_SIGNS.find(s => s.id === signA)?.name}
            </Text>
          </View>
        </View>

        <View className="select-divider">
          <Text className="plus-icon">+</Text>
        </View>

        <View className="select-card">
          <Text className="select-label">室友/搭档星座</Text>
          <View className="sign-picked">
            <Text className="sign-emoji">
              {ALL_SIGNS.find(s => s.id === signB)?.emoji}
            </Text>
            <Text className="sign-name">
              {ALL_SIGNS.find(s => s.id === signB)?.name}
            </Text>
          </View>
        </View>
      </View>

      {/* 星座选择器 */}
      <View className="sign-selector-wrap">
        <Text className="selector-hint">选择你的星座</Text>
        <SignSelector selected={signA} onSelect={setSignA} />
      </View>

      <View className="sign-selector-wrap">
        <Text className="selector-hint">选择室友/搭档的星座</Text>
        <SignSelector selected={signB} onSelect={setSignB} />
      </View>

      {/* 开始匹配按钮 */}
      <View className="match-btn-wrap">
        <Button className="match-btn" onClick={handleMatch}>
          🔍 开始匹配
        </Button>
      </View>

      {/* 结果展示 */}
      {matched && result && (
        <View className="result-section">
          <View className="result-card">
            {/* 装饰 */}
            <View className="result-decor decor-left" />
            <View className="result-decor decor-right" />

            {/* 匹配指数 */}
            <View className="score-area">
              <View className="signs-combo">
                <Text className="combo-emoji">{result.signAEmoji}</Text>
                <Text className="combo-plus">×</Text>
                <Text className="combo-emoji">{result.signBEmoji}</Text>
              </View>
              <View className="score-circle" style={{ borderColor: color }}>
                <Text className="score-num" style={{ color }}>{result.score}</Text>
                <Text className="score-percent" style={{ color }}>%</Text>
              </View>
              <Text className="match-type-label" style={{ color }}>
                {getMatchLabelText(result.type)}
              </Text>
            </View>

            {/* 一句话总结 */}
            <View className="result-summary">
              <Text className="summary-text">"{result.summary}"</Text>
            </View>

            {/* 优势和相处建议 */}
            <View className="advice-section">
              <View className="advice-block">
                <View className="advice-header">
                  <Text className="advice-icon">✅</Text>
                  <Text className="advice-title">优势分析</Text>
                </View>
                {result.pros.map((p, i) => (
                  <View key={i} className="advice-item">
                    <Text className="advice-bullet">•</Text>
                    <Text className="advice-text">{p}</Text>
                  </View>
                ))}
              </View>

              <View className="advice-block">
                <View className="advice-header">
                  <Text className="advice-icon">💡</Text>
                  <Text className="advice-title">相处建议</Text>
                </View>
                {result.tips.map((t, i) => (
                  <View key={i} className="advice-item">
                    <Text className="advice-bullet">•</Text>
                    <Text className="advice-text">{t}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 操作按钮 */}
            <View className="action-btns">
              <Button className="share-btn" open-type="share">
                🔗 分享给室友
              </Button>
              <Button className="reset-btn" onClick={handleReset}>
                🔄 重新选择
              </Button>
            </View>
          </View>
        </View>
      )}

      <View className="bottom-spacer" />
    </View>
  )
}
