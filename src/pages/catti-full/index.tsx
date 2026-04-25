import { View, Text, Button, ScrollView } from '@tarojs/components'
import Taro, { useDidShow, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { CATTI_FULL_QUESTIONS, buildCattiFullResult, type CattiDim, type CattiResult } from '../../data/cattiFullData'
import { trackEvent } from '../../utils/analytics'
import './index.scss'

type AnswerMap = Record<string, CattiDim>

const PAGE_KEY = 'catti_full'
const HISTORY_KEY = 'campus_test_history_v2'
const THEME_COLOR = '#9C7BFF'

export default function CattiFullPage() {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState<CattiResult | null>(null)
  const [historySaved, setHistorySaved] = useState(false)

  const currentQuestion = CATTI_FULL_QUESTIONS[currentIndex]
  const totalQuestions = CATTI_FULL_QUESTIONS.length
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0

  useDidShow(() => {
    const autoStart = router.params.autoStart === '1'
    const savedAnswers = Taro.getStorageSync(`${PAGE_KEY}_answers`) as AnswerMap | undefined
    const savedIndex = Taro.getStorageSync(`${PAGE_KEY}_index`) as number | undefined

    if (savedAnswers && Object.keys(savedAnswers).length > 0) {
      setAnswers(savedAnswers)
      setCurrentIndex(typeof savedIndex === 'number' ? savedIndex : 0)
      setStarted(true)
    } else {
      setAnswers({})
      setCurrentIndex(0)
      setSelectedKey(null)
      setStarted(autoStart)
    }

    setFinished(false)
    setHistorySaved(false)
    setResult(null)
    trackEvent('catti_full_opened', {})
  })

  useEffect(() => {
    if (!started || finished) return
    Taro.setStorageSync(`${PAGE_KEY}_answers`, answers)
    Taro.setStorageSync(`${PAGE_KEY}_index`, currentIndex)
  }, [answers, currentIndex, finished, started])

  useEffect(() => {
    if (!currentQuestion) return
    const selected = answers[currentQuestion.id]
    setSelectedKey(selected ?? null)
  }, [answers, currentQuestion])

  const saveHistory = (r: CattiResult) => {
    if (historySaved) return
    try {
      const history = (Taro.getStorageSync(HISTORY_KEY) || []) as Array<Record<string, unknown>>
      const entry = {
        id: `catti_full_${Date.now()}`,
        testId: 'catti-full',
        title: 'CatTi 完整版猫格测试',
        code: r.type,
        summary: r.name,
        completedAt: new Date().toISOString(),
      }
      const updated = [entry, ...history].slice(0, 20)
      Taro.setStorageSync(HISTORY_KEY, updated)
      setHistorySaved(true)
    } catch (_) {}
  }

  useShareAppMessage(() => {
    const title = result
      ? `🐱 我的猫格是「${result.name}」｜CatTi 完整版`
      : '🐱 CatTi 完整版猫格测试，12题发现你的真实猫格原型'
    trackEvent('catti_full_shared', { result: result?.type ?? '' })
    return { title, path: '/pages/catti-full/index?autoStart=1' }
  })

  useShareTimeline(() => ({
    title: result ? `🐱 ${result.shareTitle}｜CatTi` : '🐱 CatTi 完整版猫格测试',
  }))

  const handleStart = () => {
    setStarted(true)
    setAnswers({})
    setCurrentIndex(0)
    setSelectedKey(null)
    setFinished(false)
    setResult(null)
    trackEvent('catti_full_started', {})
  }

  const handleSelect = (key: string) => {
    if (finished) return
    setSelectedKey(key)
  }

  const handleNext = () => {
    if (!selectedKey || !currentQuestion) return

    const option = currentQuestion.options.find(o => o.key === selectedKey)
    if (!option) return

    const nextAnswers: AnswerMap = { ...answers, [currentQuestion.id]: option.dim }
    setAnswers(nextAnswers)
    trackEvent('catti_full_answered', { questionId: currentQuestion.id, dim: option.dim })

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedKey(null)
      return
    }

    const r = buildCattiFullResult(nextAnswers)
    setResult(r)
    setFinished(true)
    saveHistory(r)
    Taro.removeStorageSync(`${PAGE_KEY}_answers`)
    Taro.removeStorageSync(`${PAGE_KEY}_index`)
    trackEvent('catti_full_completed', { type: r.type })
  }

  const handleRetest = () => {
    Taro.removeStorageSync(`${PAGE_KEY}_answers`)
    Taro.removeStorageSync(`${PAGE_KEY}_index`)
    setAnswers({})
    setCurrentIndex(0)
    setSelectedKey(null)
    setFinished(false)
    setResult(null)
    setHistorySaved(false)
    setStarted(true)
    trackEvent('catti_full_retested', {})
  }

  // 封面页
  if (!started) {
    return (
      <View className="catti-page">
        <View className="intro-card">
          <Text className="intro-emoji">🐱</Text>
          <Text className="intro-badge">CatTi 完整版</Text>
          <Text className="intro-title">发现你的猫格原型</Text>
          <Text className="intro-desc">12道题，覆盖4个维度，对应16种猫格人格</Text>
          <Text className="intro-note">仅供娱乐与自我观察参考</Text>

          <View className="intro-dims">
            {[
              { label: 'E · I', desc: '能量来源' },
              { label: 'S · N', desc: '信息感知' },
              { label: 'T · F', desc: '决策方式' },
              { label: 'J · P', desc: '生活节奏' },
            ].map(d => (
              <View key={d.label} className="dim-tag">
                <Text className="dim-label">{d.label}</Text>
                <Text className="dim-desc">{d.desc}</Text>
              </View>
            ))}
          </View>

          <View className="intro-btn" style={{ background: THEME_COLOR }} onClick={handleStart}>
            <Text className="intro-btn-text">开始测试 →</Text>
          </View>

          <Button
            className="intro-share-btn"
            open-type="share"
            onClick={() => trackEvent('catti_full_cover_share', {})}
          >
            分享给朋友
          </Button>
        </View>
      </View>
    )
  }

  // 结果页
  if (finished && result) {
    return (
      <ScrollView className="catti-page" scrollY>
        <View className="result-card">
          <View className="result-header">
            <Text className="result-tag">CatTi 完整版结果</Text>
            <Text className="result-type-code">{result.type}</Text>
          </View>

          <Text className="result-emoji">{result.emoji}</Text>
          <Text className="result-name">{result.name}</Text>
          <Text className="result-subname">{result.subname}</Text>

          <View className="result-quote-wrap">
            <Text className="result-quote">"{result.quote}"</Text>
          </View>

          <View className="result-traits">
            {result.traits.map((t, i) => (
              <View key={i} className="trait-tag">
                <Text className="trait-text">{t}</Text>
              </View>
            ))}
          </View>

          <Text className="result-desc">{result.desc}</Text>
          <Text className="result-note">仅供娱乐与自我观察参考</Text>

          <View className="result-actions">
            <View className="result-retest-btn" onClick={handleRetest}>
              <Text>🔄 重新测试</Text>
            </View>
            <Button
              className="result-share-btn"
              open-type="share"
              style={{ background: THEME_COLOR }}
              onClick={() => trackEvent('catti_full_result_share', { type: result.type })}
            >
              分享结果
            </Button>
          </View>

          <View
            className="result-back-btn"
            onClick={() => Taro.navigateBack({ delta: 1 })}
          >
            <Text className="result-back-text">返回快测</Text>
          </View>
        </View>
      </ScrollView>
    )
  }

  // 答题页
  return (
    <View className="catti-page">
      <View className="q-header">
        <View className="q-progress-bar">
          <View className="q-progress-fill" style={{ width: `${progress}%`, background: THEME_COLOR }} />
        </View>
        <Text className="q-counter">{currentIndex + 1} / {totalQuestions}</Text>
      </View>

      <View className="q-card">
        <View className="q-hint-wrap">
          <Text className="q-hint">{currentQuestion.hint}</Text>
        </View>
        <Text className="q-text">{currentQuestion.text}</Text>
      </View>

      <View className="options-area">
        {currentQuestion.options.map(option => {
          const isSelected = selectedKey === option.key
          return (
            <View
              key={option.key}
              className={`option-item ${isSelected ? 'selected' : ''}`}
              style={isSelected ? { borderColor: THEME_COLOR, background: `${THEME_COLOR}15` } : {}}
              onClick={() => handleSelect(option.key)}
            >
              <View className="opt-key" style={isSelected ? { background: THEME_COLOR } : {}}>
                <Text className="opt-key-text" style={isSelected ? { color: '#fff' } : {}}>{option.key}</Text>
              </View>
              <Text className="opt-text">{option.text}</Text>
              {isSelected && <Text className="opt-check" style={{ color: THEME_COLOR }}>✓</Text>}
            </View>
          )
        })}
      </View>

      <View className="bottom-area">
        <View
          className={`next-btn ${selectedKey ? 'active' : 'disabled'}`}
          style={selectedKey ? { background: THEME_COLOR } : {}}
          onClick={() => selectedKey && handleNext()}
        >
          <Text className="next-btn-text">
            {selectedKey
              ? currentIndex < totalQuestions - 1 ? '下一题 →' : '✨ 查看结果'
              : '请选择一个答案'}
          </Text>
        </View>
      </View>
    </View>
  )
}
