import { View, Text, Button, ScrollView } from '@tarojs/components'
import Taro, { useDidShow, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
import { OCEAN_FULL_QUESTIONS, buildOceanFullResult } from '../../data/oceanFullData'
import { trackEvent } from '../../utils/analytics'
import './index.scss'

type AnswerMap = Record<string, number>

const PAGE_KEY = 'ocean_full'
const HISTORY_KEY = 'campus_test_history_v2'

export default function OceanFullPage() {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [historySaved, setHistorySaved] = useState(false)

  const currentQuestion = OCEAN_FULL_QUESTIONS[currentIndex]
  const totalQuestions = OCEAN_FULL_QUESTIONS.length
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
      setSelectedIndex(null)
      setStarted(autoStart)
      if (autoStart) {
        trackEvent('ocean_full_opened', { source: 'quick-result' })
      }
    }

    setFinished(false)
    setHistorySaved(false)
  })

  useEffect(() => {
    if (!started || finished) return
    Taro.setStorageSync(`${PAGE_KEY}_answers`, answers)
    Taro.setStorageSync(`${PAGE_KEY}_index`, currentIndex)
  }, [answers, currentIndex, finished, started])

  useEffect(() => {
    if (!currentQuestion) return
    const selected = answers[currentQuestion.id]
    setSelectedIndex(typeof selected === 'number' ? selected : null)
  }, [answers, currentQuestion])

  const result = useMemo(() => {
    if (!finished) return null
    return buildOceanFullResult(answers)
  }, [answers, finished])

  useEffect(() => {
    if (!finished || !result || historySaved) return

    const history = (Taro.getStorageSync(HISTORY_KEY) as Array<Record<string, string>> | undefined) || []
    const nextHistory = [
      {
        id: `ocean-full-${Date.now()}`,
        testId: 'ocean-full',
        title: '海洋生物Ti完整版',
        code: result.code,
        summary: result.title,
        completedAt: new Date().toISOString(),
      },
      ...history,
    ].slice(0, 20)

    Taro.setStorageSync(HISTORY_KEY, nextHistory)
    Taro.removeStorageSync(`${PAGE_KEY}_answers`)
    Taro.removeStorageSync(`${PAGE_KEY}_index`)
    setHistorySaved(true)
  }, [finished, historySaved, result])

  useShareAppMessage(() => ({
    title: result
      ? `🌊 我在海洋TI完整版测出「${result.title}」`
      : '🌊 海洋TI完整版：12题看你更像哪种海洋互动风格',
    path: '/pages/ocean-full/index',
  }))

  useShareTimeline(() => ({
    title: result ? result.shareTitle : '🌊 海洋TI完整版',
  }))

  const handleStart = () => {
    setStarted(true)
    trackEvent('ocean_full_opened', { source: 'direct' })
  }

  const handleSelect = (optionIndex: number) => {
    if (finished) return
    setSelectedIndex(optionIndex)
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }))
  }

  const handleNext = () => {
    if (selectedIndex === null) return

    trackEvent('ocean_full_answered', {
      questionId: currentQuestion.id,
      index: currentIndex + 1,
    })

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
      return
    }

    setFinished(true)
    trackEvent('ocean_full_completed', { totalQuestions })
  }

  const handlePrev = () => {
    if (currentIndex === 0) return
    setCurrentIndex(prev => prev - 1)
  }

  const handleRetest = () => {
    Taro.removeStorageSync(`${PAGE_KEY}_answers`)
    Taro.removeStorageSync(`${PAGE_KEY}_index`)
    setAnswers({})
    setCurrentIndex(0)
    setSelectedIndex(null)
    setStarted(true)
    setFinished(false)
    setHistorySaved(false)
    trackEvent('ocean_full_retested', {})
  }

  if (!started) {
    return (
      <View className='ocean-full-page'>
        <View className='intro-card'>
          <Text className='intro-badge'>v3.0 主题完整版</Text>
          <Text className='intro-emoji'>🌊</Text>
          <Text className='intro-title'>海洋生物Ti完整版</Text>
          <Text className='intro-desc'>12 道题，从连接方式、策略反应、稳定推进和情绪感知四个方向，查看你当前更接近的海洋互动倾向。</Text>
          <View className='intro-tags'>
            <Text className='intro-tag'>12题完整版</Text>
            <Text className='intro-tag'>四型画像</Text>
            <Text className='intro-tag'>阶段倾向</Text>
          </View>
          <Text className='intro-note'>结果更偏向你当前阶段的互动风格与任务节奏，用来帮助观察自己，不是固定标签。</Text>
          <Button className='start-btn' onClick={handleStart}>开始完整版测试</Button>
        </View>
      </View>
    )
  }

  if (finished && result) {
    return (
      <View className='ocean-full-page'>
        <ScrollView className='result-scroll' scrollY>
          <View className='result-card'>
            <Text className='result-label'>海洋生物Ti完整版</Text>
            <Text className='result-title'>{result.title}</Text>
            <Text className='result-subtitle'>{result.subtitle}</Text>
            <Text className='result-summary'>{result.summary}</Text>

            <View className='axis-list'>
              {result.scores.map(item => (
                <View key={item.type} className='axis-card'>
                  <View className='axis-head'>
                    <Text className='axis-name'>{item.emoji} {item.title}</Text>
                    <Text className='axis-dominant'>{item.score} 分</Text>
                  </View>
                </View>
              ))}
            </View>

            <View className='guide-card'>
              <Text className='guide-title'>引导建议</Text>
              <Text className='guide-text'>{result.guide}</Text>
            </View>

            <Text className='result-note'>仅供娱乐与自我观察参考</Text>
          </View>
        </ScrollView>

        <View className='result-actions'>
          <View className='secondary-btn' onClick={handleRetest}>
            <Text>🔄 再测一次</Text>
          </View>
          <Button
            className='share-result-btn'
            open-type='share'
            onClick={() => trackEvent('ocean_full_result_share', { title: result.shareTitle })}
          >
            分享结果
          </Button>
        </View>
        <View className='result-back-row' onClick={() => Taro.reLaunch({ url: '/pages/test-type/index' })}>
          <Text className='result-back-text'>返回测试中心</Text>
        </View>
      </View>
    )
  }

  return (
    <View className='ocean-full-page'>
      <View className='test-header'>
        <Text className='header-title'>🌊 海洋生物Ti完整版</Text>
        <Text className='header-count'>{currentIndex + 1}/{totalQuestions}</Text>
      </View>

      <View className='progress-bar'>
        <View className='progress-fill' style={{ width: `${progress}%` }} />
      </View>

      <ScrollView className='question-scroll' scrollY>
        <View className='question-card'>
          <Text className='question-note'>{currentQuestion.note}</Text>
          <Text className='question-text'>{currentQuestion.text}</Text>
        </View>

        <View className='disclaimer-card'>
          <Text className='disclaimer-text'>结果更偏向你当前阶段的互动方式，不作为固定类型结论。</Text>
        </View>

        <View className='options-list'>
          {currentQuestion.options.map((option, optionIndex) => {
            const isSelected = selectedIndex === optionIndex
            return (
              <View
                key={`${currentQuestion.id}_${optionIndex}`}
                className={`option-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(optionIndex)}
              >
                <View className={`option-index ${isSelected ? 'selected' : ''}`}>
                  <Text>{['A', 'B', 'C', 'D'][optionIndex]}</Text>
                </View>
                <Text className='option-text'>{option.text}</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>

      <View className='bottom-actions'>
        {currentIndex > 0 && (
          <View className='back-btn' onClick={handlePrev}>
            <Text>上一题</Text>
          </View>
        )}
        <View className={`next-btn ${selectedIndex !== null ? 'active' : 'disabled'}`} onClick={handleNext}>
          <Text>{currentIndex === totalQuestions - 1 ? '查看结果' : '下一题'}</Text>
        </View>
      </View>
    </View>
  )
}
