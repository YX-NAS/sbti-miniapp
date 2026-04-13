import { View, Text, Button, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { questions as allQuestions, specialQuestions } from '../../utils/data'
import { buildShuffledQuestions } from '../../utils/calculator'
import type { Question } from '../../utils/data'
import './index.scss'

type AnswerMap = Record<string, number>

export default function Test() {
  const router = useRouter()
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [selectedValue, setSelectedValue] = useState<number | null>(null)

  useDidShow(() => {
    // 重置测试状态
    setShuffledQuestions(buildShuffledQuestions())
    setCurrentIndex(0)
    setAnswers({})
    setSelectedValue(null)
  })

  const currentQuestion = shuffledQuestions[currentIndex]
  const totalQuestions = shuffledQuestions.length
  const progress = currentIndex + 1

  useEffect(() => {
    // 切换题目时重置选中状态
    if (currentQuestion) {
      setSelectedValue(answers[currentQuestion.id] ?? null)
    }
  }, [currentIndex, currentQuestion])

  const handleSelectOption = (value: number) => {
    setSelectedValue(value)
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const handleNext = () => {
    if (selectedValue === null) return
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    if (selectedValue === null) return
    const finalAnswers: AnswerMap = {
      ...answers,
      [currentQuestion.id]: selectedValue
    }
    Taro.redirectTo({
      url: `/pages/result/index?answers=${encodeURIComponent(JSON.stringify(finalAnswers))}`
    })
  }

  const isLastQuestion = currentIndex === totalQuestions - 1
  const canGoNext = selectedValue !== null

  const getOptionLabel = (opt: { label: string; value: number }, idx: number) => {
    const letters = ['A', 'B', 'C', 'D']
    return `${letters[idx]}. ${opt.label}`
  }

  if (!currentQuestion) {
    return (
      <View className="test-container">
        <View className="loading">
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="test-container">
      <ScrollView className="question-scroll" scrollY>
        <View className="question-card">
          <View className="question-meta">
            <Text className="question-index">第 {progress} 题</Text>
            {currentQuestion.special && (
              <Text className="supplement-tag">补充题</Text>
            )}
          </View>
          <Text className="question-text">{currentQuestion.text}</Text>
        </View>

        <View className="options-container">
          {currentQuestion.options.map((option, idx) => (
            <View
              key={option.value}
              className={`option-item ${selectedValue === option.value ? 'selected' : ''}`}
              onClick={() => handleSelectOption(option.value)}
            >
              <View className={`option-letter ${selectedValue === option.value ? 'selected' : ''}`}>
                {['A', 'B', 'C', 'D'][idx]}
              </View>
              <Text className="option-text">{option.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 进度条 */}
      <View className="progress-wrapper">
        <View className="progress-bar">
          <View
            className="progress-fill"
            style={{ width: `${(progress / totalQuestions) * 100}%` }}
          />
        </View>
        <Text className="progress-text">{progress} / {totalQuestions}</Text>
      </View>

      {/* 导航按钮 */}
      <View className="navigation">
        {currentIndex > 0 && (
          <Button className="nav-btn prev-btn" onClick={handlePrev}>上一题</Button>
        )}
        {isLastQuestion ? (
          <Button
            className={`nav-btn submit-btn ${!canGoNext ? 'disabled' : ''} ${currentIndex === 0 ? 'full-width' : ''}`}
            onClick={handleSubmit}
            disabled={!canGoNext}
          >提交</Button>
        ) : (
          <Button
            className={`nav-btn next-btn ${!canGoNext ? 'disabled' : ''} ${currentIndex === 0 ? 'full-width' : ''}`}
            onClick={handleNext}
            disabled={!canGoNext}
          >下一题</Button>
        )}
      </View>
    </View>
  )
}
