import { View, Text, Navigator } from '@tarojs/components'
import Taro, { useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import BottomNav from '../../components/BottomNav'
import {
  TOPIC_QUESTIONS,
  TOPIC_RESULT_META,
  TOPIC_TEST_CONFIG,
  type TopicResultKey,
  type TopicTestType,
} from '../../data/topicQuestions'
import { trackEvent } from '../../utils/analytics'
import './index.scss'

type AnswerMap = Record<string, TopicResultKey>

const PAGE_KEY = 'topic_test'

export default function TestByType() {
  const router = useRouter()
  const rawType = (router.params.type || 'char') as TopicTestType
  const type = rawType in TOPIC_TEST_CONFIG ? rawType : 'char'
  const cfg = TOPIC_TEST_CONFIG[type]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [selected, setSelected] = useState<TopicResultKey | null>(null)
  const [finished, setFinished] = useState(false)

  const questions = useMemo(
    () => TOPIC_QUESTIONS.filter(question => question.type === type).slice(0, cfg.count),
    [cfg.count, type]
  )

  const current = questions[currentIndex]
  const total = questions.length
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0

  useEffect(() => {
    const savedAnswers = Taro.getStorageSync(`${PAGE_KEY}_${type}_answers`) as AnswerMap | undefined
    const savedIndex = Taro.getStorageSync(`${PAGE_KEY}_${type}_index`) as number | undefined

    if (savedAnswers && Object.keys(savedAnswers).length > 0) {
      setAnswers(savedAnswers)
      setCurrentIndex(typeof savedIndex === 'number' ? savedIndex : 0)
    } else {
      setAnswers({})
      setCurrentIndex(0)
    }

    setSelected(null)
    setFinished(false)
    trackEvent('topic_test_opened', { type })
  }, [type])

  useEffect(() => {
    if (questions.length > 0) {
      Taro.setStorageSync(`${PAGE_KEY}_${type}_answers`, answers)
      Taro.setStorageSync(`${PAGE_KEY}_${type}_index`, currentIndex)
    }
  }, [answers, currentIndex, questions.length, type])

  useEffect(() => {
    if (current) {
      setSelected(answers[current.id] ?? null)
    }
  }, [answers, current, currentIndex])

  const finalResult = useMemo(() => {
    if (!finished || Object.keys(answers).length === 0) return null

    const counts: Record<TopicResultKey, number> = { A: 0, B: 0, C: 0, D: 0 }
    Object.values(answers).forEach(label => {
      counts[label] += 1
    })

    let finalLabel: TopicResultKey = 'A'
    ;(['A', 'B', 'C', 'D'] as TopicResultKey[]).forEach(label => {
      if (counts[label] > counts[finalLabel]) {
        finalLabel = label
      }
    })

    return {
      label: finalLabel,
      meta: TOPIC_RESULT_META[type][finalLabel],
      counts,
      total: Object.keys(answers).length,
    }
  }, [answers, finished, type])

  useShareAppMessage(() => {
    if (finalResult) {
      trackEvent('topic_test_shared', { type, result: finalResult.meta.title, channel: 'friend' })
    }

    return {
      title: finalResult
        ? `${cfg.emoji} 我测出是「${finalResult.meta.title}」｜${cfg.title}`
        : `${cfg.emoji} ${cfg.title}：${cfg.subtitle}`,
      path: `/pages/test-by-type/index?type=${type}`,
    }
  })

  useShareTimeline(() => {
    if (finalResult) {
      trackEvent('topic_test_shared', { type, result: finalResult.meta.title, channel: 'timeline' })
    }

    return {
      title: finalResult
        ? `${cfg.emoji} ${finalResult.meta.shareTitle}｜${cfg.title}`
        : `${cfg.emoji} ${cfg.title}`,
    }
  })

  const handleSelect = (label: TopicResultKey) => {
    if (finished) return
    setSelected(label)
  }

  const handleNext = () => {
    if (!selected || !current) return

    const nextAnswers = { ...answers, [current.id]: selected }
    setAnswers(nextAnswers)
    trackEvent('topic_test_answered', { type, questionId: current.id, option: selected })

    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelected(null)
      return
    }

    setFinished(true)
    trackEvent('topic_test_completed', { type, total })
  }

  const handleRetest = () => {
    Taro.removeStorageSync(`${PAGE_KEY}_${type}_answers`)
    Taro.removeStorageSync(`${PAGE_KEY}_${type}_index`)
    setAnswers({})
    setCurrentIndex(0)
    setSelected(null)
    setFinished(false)
    trackEvent('topic_test_retested', { type })
  }

  if (questions.length === 0) {
    return (
      <View className="test-container">
        <View className="loading">
          <Text className="loading-text">正在准备题目...</Text>
        </View>
      </View>
    )
  }

  if (finished && finalResult) {
    return (
      <View className="test-container">
        <View className="result-card">
          <View className="result-decor" />
          <View className="result-type-tag" style={{ background: `${cfg.color}22`, color: cfg.color }}>
            <Text className="tag-emoji">{cfg.emoji}</Text>
            <Text className="tag-text">{cfg.title}</Text>
          </View>

          <Text className="result-emoji">{finalResult.meta.emoji}</Text>
          <Text className="result-title">{finalResult.meta.title}</Text>
          <Text className="result-desc">{finalResult.meta.desc}</Text>

          <View className="result-stats">
            <View className="stat-item">
              <Text className="stat-num">{finalResult.total}</Text>
              <Text className="stat-label">已完成题数</Text>
            </View>
            <View className="stat-divider" />
            <View className="stat-item">
              <Text className="stat-num">{finalResult.counts[finalResult.label]}</Text>
              <Text className="stat-label">主标签命中</Text>
            </View>
          </View>

          <View className="share-tip">
            <Text className="share-tip-text">把结果发给同学试试看，看看谁和你最像 👀</Text>
          </View>

          <View className="action-row">
            <Navigator url="/pages/test-type/index" className="action-btn home-btn">
              <Text>更多测试</Text>
            </Navigator>
            <View className="action-btn retest-btn" onClick={handleRetest}>
              <Text>🔄 重新测试</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="test-container" style={{ '--theme-color': cfg.color } as CSSProperties}>
      <View className="test-header">
        <Navigator url="/pages/test-type/index" className="back-btn">
          <Text>←</Text>
        </Navigator>
        <View className="header-info">
          <Text className="header-emoji">{cfg.emoji}</Text>
          <Text className="header-title">{cfg.title}</Text>
        </View>
        <Text className="header-count">{currentIndex + 1}/{total}</Text>
      </View>

      <View className="progress-bar">
        <View className="progress-fill" style={{ width: `${progress}%`, background: cfg.color }} />
      </View>

      <View className="intro-tip">
        <Text className="intro-tip-text">{cfg.subtitle}</Text>
      </View>

      <View className="question-card">
        <View className="q-decor" />
        <Text className="q-text">{current.question}</Text>
      </View>

      <View className="options-area">
        {current.options.map(option => {
          const isSelected = selected === option.label
          return (
            <View
              key={option.label}
              className={`option-item ${isSelected ? 'selected' : ''}`}
              style={isSelected ? { borderColor: cfg.color, background: `${cfg.color}15` } : {}}
              onClick={() => handleSelect(option.label)}
            >
              <View className="opt-label" style={isSelected ? { background: cfg.color } : {}}>
                <Text className="opt-label-text" style={isSelected ? { color: '#fff' } : {}}>
                  {option.label}
                </Text>
              </View>
              <Text className="opt-text">{option.text}</Text>
              {isSelected && (
                <View className="opt-check">
                  <Text style={{ color: cfg.color }}>✓</Text>
                </View>
              )}
            </View>
          )
        })}
      </View>

      <View className="bottom-area">
        <View
          className={`next-btn ${selected ? 'active' : 'disabled'}`}
          style={selected ? { background: cfg.color } : {}}
          onClick={() => selected && handleNext()}
        >
          <Text className="next-btn-text">
            {selected ? (currentIndex < total - 1 ? '下一题 →' : '✨ 查看结果') : '请选择一个答案'}
          </Text>
        </View>
      </View>

      <BottomNav />
    </View>
  )
}
