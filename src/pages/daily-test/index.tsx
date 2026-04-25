import { View, Text } from '@tarojs/components'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import { formatDateKey, getDailyQuestionForDate, type DailyQuestion } from '../../utils/contentConfig'
import './index.scss'

export default function DailyTest() {
  const [question, setQuestion] = useState<DailyQuestion>(getDailyQuestionForDate)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [result, setResult] = useState(question.result)

  useDidShow(() => {
    const nextQuestion = getDailyQuestionForDate()
    setQuestion(nextQuestion)
    setSelected(null)
    setAnswered(false)
    setResult(nextQuestion.result)
  })

  useShareAppMessage(() => ({
    title: answered && result
      ? `🔮 今日测试：${question.question} — 我的结果是「${result.title}」`
      : `🔮 今日一测：${question.question}，来挑战吧！`,
    path: '/pages/daily-test/index',
  }))

  const handleSelect = (label: string) => {
    if (answered) return
    setSelected(label)
  }

  const handleSubmit = () => {
    if (!selected || answered) return
    setAnswered(true)
  }

  const handleRetest = () => {
    setSelected(null)
    setAnswered(false)
    setResult(question.result)
  }

  // 日期格式化
  const today = new Date()
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`
  const dateKey = formatDateKey(today)
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekStr = weekDays[today.getDay()]

  return (
    <View className="daily-container">
      {/* 顶部日期 */}
      <View className="date-header">
        <View className="date-tag">
          <Text className="date-text">📅 {dateStr} {weekStr}</Text>
        </View>
        <View className="type-tag">
          <Text className="type-emoji">{question.typeEmoji}</Text>
          <Text className="type-text">今日{question.type}</Text>
        </View>
      </View>

      {/* 进度指示 */}
      <View className="progress-bar">
        <View className="progress-fill" />
        <Text className="progress-text">第 1 / 1 题</Text>
      </View>

      {/* 问题区 */}
      <View className="question-card">
        <View className="question-decor" />

        <Text className="question-text">{question.question}</Text>
      </View>

      {/* 选项区 */}
      <View className="options-area">
        {question.options.map((opt) => {
          const isSelected = selected === opt.label
          const isCorrect = answered && isSelected
          return (
            <View
              key={opt.label}
              className={`option-item ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${answered && !isSelected ? 'dim' : ''}`}
              onClick={() => handleSelect(opt.label)}
            >
              <View className="option-label">{opt.label}</View>
              <Text className="option-text">{opt.text}</Text>
              {isSelected && !answered && <View className="check-mark">✓</View>}
              {isCorrect && answered && <View className="check-mark correct-mark">✓</View>}
            </View>
          )
        })}
      </View>

      {/* 提交按钮 */}
      {!answered && (
        <View className="submit-area">
          <View
            className={`submit-btn ${selected ? 'active' : 'disabled'}`}
            onClick={handleSubmit}
          >
            <Text className="submit-text">{selected ? '✨ 查看结果' : '请先选择一个答案'}</Text>
          </View>
        </View>
      )}

      {/* 结果展示 */}
      {answered && (
        <View className="result-area">
          <View className="result-card">
            <View className="result-decor" />

            <View className="result-header">
              <Text className="result-emoji">{result.emoji}</Text>
              <Text className="result-title">{result.title}</Text>
            </View>

            <View className="result-desc">
              <Text className="result-desc-text">{result.desc}</Text>
            </View>

            <View className="result-tags">
              <View className="result-tag">
                <Text className="tag-icon">🧭</Text>
                <Text className="tag-text">人格类型</Text>
              </View>
              <View className="result-tag">
                <Text className="tag-icon">💡</Text>
                <Text className="tag-text">{dateKey}</Text>
              </View>
            </View>

            <View className="re-test-btn" onClick={handleRetest}>
              <Text className="re-test-text">🔄 再测一次</Text>
            </View>

            <View className="share-hint">
              <Text className="share-hint-text">明天同一时间，还有新的题目哦～</Text>
            </View>
          </View>
        </View>
      )}

      <View className="bottom-spacer" />
    </View>
  )
}
