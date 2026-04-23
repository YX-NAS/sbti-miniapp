import { View, Text, Button, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro'
import {
  computeResult,
  getDimExplanation,
  type TestResult
} from '../../utils/calculator'
import { dimensionOrder, dimensionMeta } from '../../utils/data'
import { dailyReportCheck, getOrCreateDeviceId } from '../../utils/tencentCloud'
import './index.scss'

export default function Result() {
  const router = useRouter()
  const [result, setResult] = useState<TestResult | null>(null)

  useEffect(() => {
    const params = router.params
    if (params.answers) {
      try {
        const answers = JSON.parse(decodeURIComponent(params.answers)) as Record<string, number>
        const computed = computeResult(answers)
        setResult(computed)
      } catch (e) {
        console.error('Failed to compute result:', e)
      }
    }
  }, [])

  useShareAppMessage(() => {
    if (result) {
      const deviceId = getOrCreateDeviceId()
      dailyReportCheck(deviceId, result.finalType.code, result.finalType.cn)
    }
    return {
      title: result ? `我的SBTI人格是「${result.finalType.code} ${result.finalType.cn}」` : 'SBTI 性格测试',
      path: '/pages/index/index',
    }
  })

  const handleRetest = () => {
    Taro.redirectTo({ url: '/pages/test/index' })
  }

  if (!result) {
    return (
      <View className="result-container">
        <View className="loading">
          <Text className="loading-text">正在分析你的性格...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="result-container">
      <ScrollView className="result-scroll" scrollY>
        {/* 顶部人格卡片 */}
        <View className="type-card">
          <View className="type-kicker">{result.modeKicker}</View>
          <View className="type-badge-row">
            <Text className="type-code">{result.finalType.code}</Text>
            <Text className="type-cn">（{result.finalType.cn}）</Text>
          </View>
          <Text className="type-intro">{result.finalType.intro}</Text>
          <View className="badge-row">
            <Text className="badge-text">{result.badge}</Text>
          </View>
        </View>

        {/* 人格解读 */}
        <View className="card desc-card">
          <Text className="card-title">人格解读</Text>
          <Text className="desc-text">{result.finalType.desc}</Text>
        </View>

        {/* 15维度分数 */}
        <View className="card dims-card">
          <Text className="card-title">15维度解析</Text>
          {dimensionOrder.map(dim => {
            const level = result.levels[dim]
            const explanation = getDimExplanation(dim, level)
            const score = result.rawScores[dim]
            const maxScore = 6 // 每维度 2 题，每题最高分 3
            return (
              <View key={dim} className="dim-item">
                <View className="dim-header">
                  <Text className="dim-name">{dimensionMeta[dim].name}</Text>
                  <Text className="dim-score">{level} / {score}分</Text>
                </View>
                <View className="dim-bar">
                  <View
                    className={`dim-bar-fill level-${level.toLowerCase()}`}
                    style={{ width: `${(score / maxScore) * 100}%` }}
                  />
                </View>
                <Text className="dim-explanation">{explanation}</Text>
              </View>
            )
          })}
        </View>

        {/* 特殊人格说明 */}
        {result.special && result.secondaryType && (
          <View className="card special-card">
            <Text className="card-title">隐藏人格</Text>
            <View className="special-type">
              <Text className="special-code">{result.secondaryType.code}</Text>
              <Text className="special-cn">（{result.secondaryType.cn}）</Text>
            </View>
            <Text className="desc-text">{result.secondaryType.desc}</Text>
            <Text className="sub-text">{result.sub}</Text>
          </View>
        )}

        {/* 次优匹配 */}
        {!result.special && result.ranked[1] && (
          <View className="card secondary-card">
            <Text className="card-title">次要人格倾向</Text>
            <View className="secondary-type">
              <Text className="secondary-code">{result.ranked[1].code}</Text>
              <Text className="secondary-cn">（{result.ranked[1].cn}）</Text>
              <Text className="secondary-match">匹配度 {result.ranked[1].similarity}%</Text>
            </View>
            <Text className="desc-text">{result.ranked[1].desc}</Text>
          </View>
        )}

        <View className="spacer" />
      </ScrollView>

      <View className="result-footer">
        <Button className="share-btn" open-type="share">分享结果</Button>
        <Button className="retest-btn" onClick={handleRetest}>重新测试</Button>
      </View>
    </View>
  )
}
