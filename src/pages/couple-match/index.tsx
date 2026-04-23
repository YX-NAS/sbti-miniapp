import { View, Text, Button } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import SignSelector from '../../components/SignSelector/index'
import { calcCp, ALL_SIGNS, getCpColor, getCpLabelText, getCpLevelName } from '../../utils/cp_calculator'
import './index.scss'

export default function CoupleMatch() {
  const [signA, setSignA] = useState('aries')  // 男生
  const [signB, setSignB] = useState('libra')   // 女生
  const [result, setResult] = useState<ReturnType<typeof calcCp>>(null)
  const [matched, setMatched] = useState(false)

  // 自定义分享内容：有结果时显示 CP 分数，否则显示通用引导
  useShareAppMessage(() => ({
    title: result
      ? `${result.signAEmoji}${result.signAName} × ${result.signBEmoji}${result.signBName} CP 指数 ${result.score}分 — ${result.label}`
      : '💑 CP配对 — 看看你们的星座合拍指数',
    path: '/pages/couple-match/index',
  }))

  const handleMatch = () => {
    const res = calcCp(signA, signB)
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
    if (!result) return
    Taro.showShareMenu({ withShareTicket: false })
  }

  const color = result ? getCpColor(result.score) : '#FF6B9D'

  return (
    <View className="cp-container">
      {/* 顶部装饰 */}
      <View className="top-decor">
        <View className="heart heart-1">❤️</View>
        <View className="heart heart-2">💕</View>
        <View className="heart heart-3">💗</View>
      </View>

      {/* 标题 */}
      <View className="page-header">
        <Text className="page-title">💑 CP配对</Text>
        <Text className="page-subtitle">选择你们的星座，看看你们的CP指数</Text>
      </View>

      {/* 选择区域 */}
      <View className="select-section">
        <View className="select-card boy">
          <Text className="select-label">♂ 他的星座</Text>
          <View className="sign-picked">
            <Text className="sign-emoji">
              {ALL_SIGNS.find(s => s.id === signA)?.emoji}
            </Text>
            <Text className="sign-name">
              {ALL_SIGNS.find(s => s.id === signA)?.name}
            </Text>
          </View>
        </View>

        <View className="heart-center">
          <Text className="heart-icon">💕</Text>
        </View>

        <View className="select-card girl">
          <Text className="select-label">♀ 她的星座</Text>
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
        <Text className="selector-hint">选择 ♂ 他的星座</Text>
        <SignSelector selected={signA} onSelect={setSignA} />
      </View>

      <View className="sign-selector-wrap">
        <Text className="selector-hint">选择 ♀ 她的星座</Text>
        <SignSelector selected={signB} onSelect={setSignB} />
      </View>

      {/* 匹配按钮 */}
      <View className="match-btn-wrap">
        <Button className="match-btn" onClick={handleMatch}>
          💘 开始配对
        </Button>
      </View>

      {/* 结果展示 */}
      {matched && result && (
        <View className="result-section">
          <View className="result-card">
            <View className="result-decor decor-1" />
            <View className="result-decor decor-2" />

            {/* CP名 + 指数 */}
            <View className="cp-header">
              <Text className="cp-names">
                {result.signAEmoji} × {result.signBEmoji}
              </Text>
              <Text className="cp-name" style={{ color }}>
                「{result.cpName}」
              </Text>
            </View>

            {/* 分数圆圈 */}
            <View className="score-area">
              <View className="score-circle" style={{ borderColor: color }}>
                <Text className="score-num" style={{ color }}>{result.score}</Text>
                <Text className="score-unit" style={{ color }}>分</Text>
              </View>
              <Text className="score-label" style={{ color }}>
                {getCpLabelText(result.type)}
              </Text>
              <Text className="score-level">
                {getCpLevelName(result.score)}
              </Text>
            </View>

            {/* CP故事 */}
            <View className="story-section">
              <Text className="story-title">📖 CP故事</Text>
              <Text className="story-text">"{result.cpStory}"</Text>
            </View>

            {/* 一句话总结 */}
            <View className="summary-bubble">
              <Text className="summary-text">"{result.summary}"</Text>
            </View>

            {/* 优势 */}
            <View className="advice-section">
              <View className="advice-block">
                <View className="advice-header">
                  <Text className="advice-icon">✨</Text>
                  <Text className="advice-title">CP优势</Text>
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
                🔗 分享给朋友
              </Button>
              <Button className="reset-btn" onClick={handleReset}>
                🔄 重新配对
              </Button>
            </View>
          </View>
        </View>
      )}

      <View className="bottom-spacer" />
    </View>
  )
}
