/**
 * 按类型测试页面
 * 支持: char(性格), love(情感), fun(趣味), study(学习风格)
 * 从 questions.json 加载对应类型的题目
 */
import { View, Text, Navigator, Button } from '@tarojs/components'
import Taro, { useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import questionsData from '../../data/questions.json'
import BottomNav from '../../components/BottomNav'
import './index.scss'

type Option = {
  label: string
  text: string
  result: { title: string; desc: string; emoji: string }
}

type Question = {
  id: string
  type: string
  typeEmoji: string
  question: string
  options: Option[]
}

const TYPE_CONFIG: Record<string, { title: string; emoji: string; color: string; count: number; paid?: boolean }> = {
  char:  { title: '性格测试', emoji: '🧠', color: '#FF6B9D', count: 15 },
  love:  { title: '情感测试', emoji: '💕', color: '#FF8C7A', count: 10, paid: true },
  fun:   { title: '趣味测试', emoji: '🎮', color: '#6BCB77', count: 10 },
  study: { title: '学习风格', emoji: '📚', color: '#4D96FF', count: 10 },
}

const UNLOCK_KEY = 'love_unlocked'
const PAGE_KEY = 'test_by_type'

export default function TestByType() {
  const router = useRouter()
  const type = (router.params.type || 'char') as string
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.char
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  // 付费测试解锁状态
  const [unlocked, setUnlocked] = useState(false)

  // ⬇️ 分享给好友
  useShareAppMessage(() => ({
    title: `${cfg.emoji} ${cfg.title} — 星座人格实验室，快来测测你的性格！`,
    path: `/pages/test-by-type/index?type=${type}`,
  }))

  // ⬇️ 分享到朋友圈
  useShareTimeline(() => ({
    title: `${cfg.emoji} ${cfg.title} — 星座人格实验室，快来测测你的性格！`,
  }))

  // 检查付费测试是否已解锁
  useEffect(() => {
    if (cfg.paid) {
      const isUnlocked = Taro.getStorageSync(UNLOCK_KEY)
      if (isUnlocked) setUnlocked(true)
    } else {
      setUnlocked(true)
    }
  }, [cfg.paid])

  // 分享回调（微信用户分享后自动触发）
  useShareAppMessage(() => {
    if (cfg.paid && !unlocked) {
      // 用户完成分享，解锁情感测试
      Taro.setStorageSync(UNLOCK_KEY, true)
      setUnlocked(true)
    }
    return {
      title: '星座人格实验室 - 情感测试',
      path: '/pages/test-by-type/index?type=love',
      imageUrl: '',
    }
  })

  // 加载题目
  useEffect(() => {
    const savedQ = Taro.getStorageSync(`${PAGE_KEY}_${type}_questions`) as Question[] | undefined
    const savedAnswers = Taro.getStorageSync(`${PAGE_KEY}_${type}_answers`) as AnswerMap | undefined
    const savedIndex = Taro.getStorageSync(`${PAGE_KEY}_${type}_index`) as number | undefined

    if (savedQ && savedQ.length > 0 && savedAnswers && Object.keys(savedAnswers).length > 0) {
      // 恢复同一轮答题进度（用同一套题）
      setQuestions(savedQ)
      setAnswers(savedAnswers)
      setCurrentIndex(typeof savedIndex === 'number' ? savedIndex : 0)
    } else {
      // 全新随机抽取
      const allQ = (questionsData as any).questions as Question[]
      const pool = allQ.filter((q: Question) => q.type.includes(cfg.title.replace('测试', '')))
      const shuffled = [...pool].sort(() => Math.random() - 0.5)
      setQuestions(shuffled.slice(0, cfg.count))
    }
  }, [type])

  const current = questions[currentIndex]
  const total = questions.length
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0

  // 保存进度
  useEffect(() => {
    if (questions.length > 0) {
      Taro.setStorageSync(`${PAGE_KEY}_${type}_questions`, questions)
      Taro.setStorageSync(`${PAGE_KEY}_${type}_answers`, answers)
      Taro.setStorageSync(`${PAGE_KEY}_${type}_index`, currentIndex)
    }
  }, [answers, currentIndex, type, questions])

  // 切换题目时同步选中
  useEffect(() => {
    if (current) {
      setSelected(answers[current.id] ?? null)
    }
  }, [currentIndex, current])

  const handleSelect = (label: string) => {
    if (finished) return
    setSelected(label)
  }

  const handleNext = () => {
    if (!selected || !current) return
    const newAnswers = { ...answers, [current.id]: selected }
    setAnswers(newAnswers)

    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelected(null)
    } else {
      // 全部答完，计算结果
      setFinished(true)
    }
  }

  const handleRetest = () => {
    Taro.removeStorageSync(`${PAGE_KEY}_${type}_answers`)
    Taro.removeStorageSync(`${PAGE_KEY}_${type}_index`)
    Taro.removeStorageSync(`${PAGE_KEY}_${type}_questions`)
    // 重新随机抽取一套
    const allQ = (questionsData as any).questions as Question[]
    const pool = allQ.filter((q: Question) => q.type.includes(cfg.title.replace('测试', '')))
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, cfg.count))
    setAnswers({})
    setCurrentIndex(0)
    setSelected(null)
    setFinished(false)
  }

  // ========== 计算结果 ==========
  const finalResult = (() => {
    if (!finished || Object.keys(answers).length === 0) return null

    // 统计每个 label 出现的次数（只计有答案的题）
    const labelCount: Record<string, number> = {}
    const labelResults: Record<string, { title: string; desc: string; emoji: string }> = {}

    questions.forEach(q => {
      const chosen = answers[q.id]
      if (chosen) {
        const opt = q.options.find(o => o.label === chosen)
        if (opt) {
          labelCount[chosen] = (labelCount[chosen] || 0) + 1
          labelResults[chosen] = opt.result
        }
      }
    })

    // 找出最多选择的 label
    let maxLabel = ''
    let maxCount = 0
    Object.entries(labelCount).forEach(([label, count]) => {
      if (count > maxCount) {
        maxCount = count
        maxLabel = label
      }
    })

    const result = labelResults[maxLabel]
    if (!result) return null

    return {
      emoji: result.emoji,
      title: result.title,
      desc: result.desc,
      label: maxLabel,
      count: maxCount,
      total: Object.keys(answers).length,
    }
  })()

  // 分享解锁付费测试
  const handleShareUnlock = () => {
    // 触发微信分享菜单，用户分享后回调会自动解锁
    Taro.showShareMenu({ withShareTicket: true })
    Taro.showToast({ title: '请点击右上角「···」分享', icon: 'none', duration: 2500 })
  }

  // 付费测试未解锁：展示解锁页
  if (cfg.paid && !unlocked) {
    return (
      <View className="test-container">
        <View className="paywall-card">
          <View className="paywall-icon">💕</View>
          <Text className="paywall-title">情感测试</Text>
          <Text className="paywall-desc">
            暗恋有多苦？你的恋爱模式是什么？\n10道题，读懂你的内心
          </Text>
          <View className="paywall-divider" />
          <View className="paywall-price-info">
            <Text className="price-tag">限时免费</Text>
            <Text className="price-method">分享到微信群即可解锁</Text>
          </View>
          <View className="paywall-btn" onClick={handleShareUnlock}>
            <Text className="paywall-btn-text">✨ 分享到群解锁</Text>
          </View>
          <Text className="paywall-tip">分享完成后自动解锁，可反复测试</Text>
        </View>
      </View>
    )
  }

  if (questions.length === 0) {
    return (
      <View className="test-container">
        <View className="loading">
          <Text className="loading-text">正在加载题目...</Text>
        </View>
      </View>
    )
  }

  if (finished && finalResult) {
    return (
      <View className="test-container">
        <View className="result-card">
          <View className="result-decor" />
          <View className="result-type-tag" style={{ background: cfg.color + '22', color: cfg.color }}>
            <Text className="tag-emoji">{cfg.emoji}</Text>
            <Text className="tag-text">{cfg.title}</Text>
          </View>

          <Text className="result-emoji">{finalResult.emoji}</Text>
          <Text className="result-title">{finalResult.title}</Text>
          <Text className="result-desc">{finalResult.desc}</Text>

          <View className="result-stats">
            <View className="stat-item">
              <Text className="stat-num">{finalResult.count}</Text>
              <Text className="stat-label">你的选项</Text>
            </View>
            <View className="stat-divider" />
            <View className="stat-item">
              <Text className="stat-num">{finalResult.total}</Text>
              <Text className="stat-label">答题总数</Text>
            </View>
          </View>

          <View className="action-row">
            <Navigator url="/pages/index/index" className="action-btn home-btn">
              <Text>回到首页</Text>
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
    <View className="test-container" style={{ '--theme-color': cfg.color } as any}>
      {/* 顶部 */}
      <View className="test-header">
        <Navigator url="/pages/index/index" className="back-btn">
          <Text>←</Text>
        </Navigator>
        <View className="header-info">
          <Text className="header-emoji">{cfg.emoji}</Text>
          <Text className="header-title">{cfg.title}</Text>
        </View>
        <Text className="header-count">{currentIndex + 1}/{total}</Text>
      </View>

      {/* 进度条 */}
      <View className="progress-bar">
        <View className="progress-fill" style={{ width: `${progress}%`, background: cfg.color }} />
      </View>

      {/* 问题卡片 */}
      <View className="question-card">
        <View className="q-decor" />
        <Text className="q-text">{current?.question}</Text>
      </View>

      {/* 选项 */}
      <View className="options-area">
        {current?.options.map(opt => {
          const isSelected = selected === opt.label
          return (
            <View
              key={opt.label}
              className={`option-item ${isSelected ? 'selected' : ''}`}
              style={isSelected ? { borderColor: cfg.color, background: cfg.color + '15' } as any : {}}
              onClick={() => handleSelect(opt.label)}
            >
              <View className="opt-label" style={isSelected ? { background: cfg.color } as any : {}}>
                <Text className="opt-label-text" style={isSelected ? { color: '#fff' } as any : {}}>{opt.label}</Text>
              </View>
              <Text className="opt-text">{opt.text}</Text>
              {isSelected && <View className="opt-check"><Text style={{ color: cfg.color }}>✓</Text></View>}
            </View>
          )
        })}
      </View>

      {/* 底部按钮 */}
      <View className="bottom-area">
        <View
          className={`next-btn ${selected ? 'active' : 'disabled'}`}
          style={selected ? { background: cfg.color } as any : {}}
          onClick={() => selected && handleNext()}
        >
          <Text className="next-btn-text">
            {selected
              ? (currentIndex < total - 1 ? '下一题 →' : '✨ 查看结果')
              : '请选择一个答案'}
          </Text>
        </View>
      </View>

      <BottomNav />
    </View>
  )
}
