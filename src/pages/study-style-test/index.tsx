import { View, Text, Button } from '@tarojs/components'
import Taro, { useDidShow, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import studyQuestionsData from '../../data/study_style_questions.json'
import PageHeader from '../../components/PageHeader'
import BottomNav from '../../components/BottomNav'
import './index.scss'

type Question = {
  id: string
  type: string
  typeEmoji: string
  question: string
  options: { label: string; text: string; scores: Record<string, number> }[]
}

const questions = (studyQuestionsData as any).questions as Question[]
const styleResults = (studyQuestionsData as any).results as Record<string, any>
const mixedResults = (studyQuestionsData as any).mixedResults as Record<string, any>
const PAGE_ID = 'study_style_test'

type Answers = Record<string, string>

function calcResult(answers: Answers) {
  const scores: Record<string, number> = { V: 0, A: 0, R: 0, K: 0 }
  questions.forEach((q) => {
    const selected = answers[q.id]
    const opt = q.options.find(o => o.label === selected)
    if (opt) {
      Object.entries(opt.scores).forEach(([k, v]) => {
        scores[k] = (scores[k] || 0) + (v as number)
      })
    }
  })
  const total = Object.values(scores).reduce((a, b) => a + b, 0)
  if (total === 0) return null
  const percents: Record<string, number> = {}
  Object.entries(scores).forEach(([k, v]) => {
    percents[k] = Math.round((v / total) * 100)
  })
  const sorted = Object.entries(percents).sort((a, b) => b[1] - a[1])
  const [top, second] = sorted
  let result: any = null
  if (top[1] >= 40 && top[1] - second[1] >= 15) {
    result = { ...styleResults[top[0]], type: top[0], percents, pattern: 'single' }
  } else {
    const significant = sorted.filter(([, p]) => p >= 25).map(([k]) => k)
    if (significant.length >= 2) {
      const key = significant.slice(0, 3).sort().join('')
      const mixed = mixedResults[key]
      if (mixed) result = { ...mixed, percents, pattern: 'mixed' }
    }
    if (!result) result = { ...styleResults[top[0]], type: top[0], percents, pattern: 'single' }
  }
  return result
}

// Storage keys
const storageKey = (field: string) => `study_test_${field}`

export default function StudyStyleTest() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState<any>(null)

  // ⬇️ 分享给好友
  useShareAppMessage(() => ({
    title: result
      ? `📚 我的学习风格是「${result.typeName}」，星座人格实验室等你来测！`
      : '📚 学习风格测试 — 星座人格实验室',
    path: '/pages/study-style-test/index',
  }))

  // ⬇️ 分享到朋友圈
  useShareTimeline(() => ({
    title: result
      ? `📚 我的学习风格是「${result.typeName}」，星座人格实验室等你来测！`
      : '📚 学习风格测试 — 星座人格实验室等你来玩！',
  }))

  const total = questions.length
  const q = questions[current]
  const selected = answers[q.id] || null

  // ========== 每次切回小程序时恢复状态 ==========
  useDidShow(() => {
    try {
      const savedCurrent = Taro.getStorageSync(storageKey('current'))
      const savedAnswers = Taro.getStorageSync(storageKey('answers'))
      const savedFinished = Taro.getStorageSync(storageKey('finished'))
      if (savedAnswers && Object.keys(savedAnswers).length > 0) {
        setCurrent(typeof savedCurrent === 'number' ? savedCurrent : 0)
        setAnswers(savedAnswers || {})
        setFinished(savedFinished || false)
        if (savedFinished) {
          const res = calcResult(savedAnswers)
          setResult(res)
        }
      }
    } catch (e) {
      // ignore storage errors
    }
  })

  // ========== 状态变化时自动保存 ==========
  useEffect(() => {
    if (Object.keys(answers).length > 0 || finished) {
      Taro.setStorageSync(storageKey('current'), current)
      Taro.setStorageSync(storageKey('answers'), answers)
      Taro.setStorageSync(storageKey('finished'), finished)
    }
  }, [current, answers, finished])

  // ========== 完成后清除记录 ==========
  const handleRetest = () => {
    Taro.removeStorageSync(storageKey('current'))
    Taro.removeStorageSync(storageKey('answers'))
    Taro.removeStorageSync(storageKey('finished'))
    setCurrent(0)
    setAnswers({})
    setFinished(false)
    setResult(null)
  }

  const handleSelect = (label: string) => {
    setAnswers(prev => ({ ...prev, [q.id]: label }))
  }

  const handleNext = () => {
    if (current < total - 1) {
      setCurrent(current + 1)
    } else {
      const res = calcResult({ ...answers, [q.id]: selected! })
      setResult(res)
      setFinished(true)
      // 完成后也保存结果
      Taro.setStorageSync(storageKey('result'), res)
    }
  }

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const handleShare = () => {
    if (!result) return
    Taro.setClipboardData({
      data: `我是${result.name}学习者！${result.desc.slice(0, 50)}...快来测试你的学习风格 →`,
      success: () => Taro.showToast({ title: '分享文案已复制', icon: 'none', duration: 2000 }),
    })
  }

  // ========== 结果页 ==========
  if (finished && result) {
    return (
      <View className="test-container">
        <View className="result-top">
          <View className="result-top-decor" />
          <Text className="result-badge">{result.badge || '📊'}</Text>
          <Text className="result-main-title">{result.title}</Text>
          <Text className="result-main-desc">{result.desc}</Text>
        </View>

        <View className="radar-section">
          <View className="section-title">
            <Text className="section-title-text">📊 学习风格分布</Text>
          </View>
          <View className="radar-chart">
            {Object.entries(result.percents).map(([type, pct]) => {
              const labels: Record<string, string> = { V: '视觉型', A: '听觉型', R: '读写型', K: '动觉型' }
              const colors: Record<string, string> = { V: '#9B59B6', A: '#3498DB', R: '#27AE60', K: '#E67E22' }
              const emos: Record<string, string> = { V: '👁️', A: '👂', R: '📝', K: '🤚' }
              return (
                <View key={type} className="bar-row">
                  <Text className="bar-label">{emos[type]} {labels[type]}</Text>
                  <View className="bar-track">
                    <View className="bar-fill" style={{ width: `${pct}%`, background: colors[type] }} />
                  </View>
                  <Text className="bar-pct">{pct}%</Text>
                </View>
              )
            })}
          </View>
        </View>

        <View className="methods-section">
          <View className="section-title">
            <Text className="section-title-text">✨ 最适合你的学习方式</Text>
          </View>
          <View className="methods-grid">
            {(result.bestMethods || styleResults[result.type]?.bestMethods || []).map((m: string, i: number) => (
              <View key={i} className="method-tag">
                <Text className="method-text">{m}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="tips-section">
          <View className="section-title">
            <Text className="section-title-text">💡 学习建议</Text>
          </View>
          <View className="tips-list">
            {(result.tips || styleResults[result.type]?.tips || []).map((tip: string, i: number) => (
              <View key={i} className="tip-item">
                <Text className="tip-num">{i + 1}</Text>
                <Text className="tip-text">{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="result-actions">
          <Button className="share-btn" onClick={handleShare}>🔗 分享结果</Button>
          <Button className="retest-btn" onClick={handleRetest}>🔄 重新测试</Button>
        </View>
        <View className="bottom-spacer" />
      </View>
    )
  }

  // ========== 答题页 ==========
  return (
    <View className="test-container">
      <View className="test-header">
        <Navigator url="/pages/index/index" className="back-btn">
          <Text>←</Text>
        </Navigator>
        <View className="header-info">
          <Text className="header-type">{q.typeEmoji} {q.type}</Text>
          <Text className="header-progress">{current + 1} / {total}</Text>
        </View>
        <View className="progress-track">
          <View className="progress-fill" style={{ width: `${((current + 1) / total) * 100}%` }} />
        </View>
      </View>

      <View className="question-card">
        <Text className="question-text">{q.question}</Text>
      </View>

      <View className="options-area">
        {q.options.map((opt) => (
          <View
            key={opt.label}
            className={`option-item ${selected === opt.label ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.label)}
          >
            <View className="option-label">{opt.label}</View>
            <Text className="option-text">{opt.text}</Text>
            {selected === opt.label && <View className="check-icon">✓</View>}
          </View>
        ))}
      </View>

      <View className="nav-btns">
        <View
          className={`nav-btn prev-btn ${current === 0 ? 'disabled' : ''}`}
          onClick={handlePrev}
        >
          <Text className="nav-btn-text">← 上一题</Text>
        </View>
        <View
          className={`nav-btn next-btn ${!selected ? 'disabled' : ''}`}
          onClick={selected ? handleNext : undefined}
        >
          <Text className="nav-btn-text">
            {current === total - 1 ? (selected ? '✨ 查看结果' : '请选择答案') : '下一题 →'}
          </Text>
        </View>
      </View>
      <View className="bottom-spacer" />
      <BottomNav />
    </View>
  )
}
