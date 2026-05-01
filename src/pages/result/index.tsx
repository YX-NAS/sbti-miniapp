import { View, Text, Button, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import {
  computeResult,
  getDimExplanation,
  type TestResult
} from '../../utils/calculator'
import { dimensionOrder, dimensionMeta } from '../../utils/campusData'
import { dailyReportCheck, getOrCreateDeviceId } from '../../utils/tencentCloud'
import { trackEvent } from '../../utils/analytics'
import { getRecommendations } from '../../utils/recommendations'
import { companionSessionManager, type CompanionParams } from '../../utils/companionSession'
import SharePoster from '../../components/SharePoster/index'
import './index.scss'

export default function Result() {
  const router = useRouter()
  const [result, setResult] = useState<TestResult | null>(null)
  const [showPoster, setShowPoster] = useState(false)

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
      trackEvent('sbti_result_shared', { type: result.finalType.code, channel: 'friend' })
    }
    return {
      title: result
        ? `我的校园人格类型是「${result.finalType.code} ${result.finalType.cn}」，快来测测你的！`
        : '🌟 校园人格类型测试 — 看看你的校园画像',
      path: '/pages/index/index',
    }
  })

  // 支持分享到朋友圈
  useShareTimeline(() => {
    if (result) {
      trackEvent('sbti_result_shared', { type: result.finalType.code, channel: 'timeline' })
    }

    return {
      title: result
        ? `校园人格类型测出我是「${result.finalType.code} ${result.finalType.cn}」`
        : '🌟 校园人格类型测试',
      query: '',
    }
  })

  const handleRetest = () => {
    trackEvent('sbti_result_retest', { type: result?.finalType.code || '' })
    Taro.redirectTo({ url: '/pages/test/index' })
  }

  const handlePosterOpen = () => {
    trackEvent('sbti_result_poster_open', { type: result?.finalType.code || '' })
    setShowPoster(true)
  }

  const handleExplore = (path: string, entryId: string) => {
    trackEvent('sbti_result_next_click', { type: result?.finalType.code || '', entryId })
    Taro.navigateTo({ url: path })
  }

  const handleEnterCompanion = async () => {
    if (!result) return

    console.log('[Result] Entering companion mode')
    
    Taro.showLoading({
      title: '召唤陪练中...',
      mask: true,
    })

    try {
      // 从 SBTI 结果映射到陪聊参数
      const companionParams: CompanionParams = {
        roleHint: mapSbtiToRole(result.finalType.code),
        sceneHint: 'ice-break',
        goal: '提升沟通表达效果',
        nickname: '同学',
      }

      // 调用陪聊管理器创建会话
      const h5Url = await companionSessionManager.createSession(companionParams)

      trackEvent('companion_session_created', {
        sbtiType: result.finalType.code,
      })

      // 导航到陪聊页面
      Taro.navigateTo({
        url: `/pages/companion/index?url=${encodeURIComponent(h5Url)}`,
        fail: (err) => {
          console.error('[Result] Navigate failed:', err)
          Taro.showToast({
            title: '打开陪聊页面失败',
            icon: 'none',
            duration: 2000,
          })
        },
      })

    } catch (error) {
      console.error('[Result] Companion error:', error)
      Taro.showToast({
        title: error instanceof Error ? error.message : '陪练召唤失败',
        icon: 'none',
        duration: 2000,
      })
    } finally {
      Taro.hideLoading()
    }
  }

  /**
   * 将 SBTI 类型映射到陪聊角色
   */
  const mapSbtiToRole = (sbtiType: string): string => {
    const roleMap: Record<string, string> = {
      'ISFJ': 'warm',     // 守护者 → 温暖陪练
      'ISFP': 'warm',     // 探险家 → 温暖陪练
      'INFJ': 'steady',   // 倡导者 → 稳健陪练
      'INFP': 'steady',   // 调解者 → 稳健陪练
      'ISTJ': 'direct',   // 后勤官 → 直接陪练
      'ISTP': 'direct',   // 鉴赏家 → 直接陪练
      'INTJ': 'direct',   // 指挥官 → 直接陪练
      'INTP': 'spark',    // 逻辑家 → 活跃陪练
      'ESFJ': 'warm',     // 执政官 → 温暖陪练
      'ESFP': 'spark',    // 表演者 → 活跃陪练
      'ENFJ': 'steady',   // 主人公 → 稳健陪练
      'ENFP': 'spark',    // 竞选者 → 活跃陪练
      'ESTJ': 'direct',   // 总经理 → 直接陪练
      'ESTP': 'spark',    // 企业家 → 活跃陪练
      'ENTJ': 'direct',   // 总司令 → 直接陪练
      'ENTP': 'spark',    // 辩手 → 活跃陪练
    }
    return roleMap[sbtiType] || 'warm'
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

  const shareCopyLines = [
    `${result.finalType.code} ${result.finalType.cn}｜${result.badge}`,
    `朋友说这个结果挺像我，快来测测你是哪一型`,
    `测完顺手发群里，看看谁和我最像`,
  ]
  const recommendCards = getRecommendations('campus-result')

  return (
    <>
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

        <View className="card disclaimer-card">
          <Text className="disclaimer-text">仅供娱乐与自我观察参考</Text>
        </View>

        <View className="card share-guide-card">
          <Text className="card-title">适合发圈的文案</Text>
          <View className="copy-list">
            {shareCopyLines.map(copy => (
              <View key={copy} className="copy-chip">
                <Text className="copy-chip-text">{copy}</Text>
              </View>
            ))}
          </View>
          <Text className="guide-tip">建议配合分享海报一起发，转发和保存意愿更强。</Text>
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

        <View className="card growth-card">
          <Text className="card-title">下一步可以试试</Text>
          <View className="growth-actions">
            <View className="growth-action-btn topic-action" onClick={() => handleExplore('/pages/test-type/index', 'topic-tests')}>
              <Text className="growth-action-title">学生专题快测</Text>
              <Text className="growth-action-desc">宿舍 / 暗恋 / 学习 / 趣味 / CatTi</Text>
            </View>
            <View className="growth-action-btn daily-action" onClick={() => handleExplore('/pages/daily-test/index', 'daily-test')}>
              <Text className="growth-action-title">今日一测</Text>
              <Text className="growth-action-desc">每天一道，适合顺手分享</Text>
            </View>
          </View>
        </View>

        {/* AI 陪聊卡片 */}
        <View className="card companion-card">
          <View className="companion-header">
            <Text className="companion-emoji">🎯</Text>
            <View className="companion-copy">
              <Text className="companion-title">陪练讲解</Text>
              <Text className="companion-desc">AI 教练根据你的测试结果，帮你实战演练沟通技巧</Text>
            </View>
          </View>
          <Button className="companion-btn" onClick={handleEnterCompanion}>
            开始陪练
          </Button>
        </View>

        <View className="card recommend-card">
          <Text className="card-title">猜你喜欢</Text>
          <View className="recommend-list">
            {recommendCards.map(item => (
              <View key={item.id} className="recommend-item" onClick={() => handleExplore(item.path, item.id)}>
                <View className="recommend-left">
                  <Text className="recommend-emoji">{item.emoji}</Text>
                  <View className="recommend-copy">
                    <Text className="recommend-name">{item.title}</Text>
                    <Text className="recommend-desc">{item.desc}</Text>
                  </View>
                </View>
                <Text className="recommend-tag" style={{ color: item.color }}>{item.tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="spacer" />
      </ScrollView>

      <View className="result-footer">
        <Button className="poster-btn" onClick={handlePosterOpen}>🎨 生成海报</Button>
        <Button className="share-btn" open-type="share">晒给朋友</Button>
        <Button className="retest-btn" onClick={handleRetest}>重新测试</Button>
      </View>
      </View>

      {/* 分享海报弹层 */}
      {showPoster && result && (
        <SharePoster
          typeCode={result.finalType.code}
          typeCn={result.finalType.cn}
          typeIntro={result.finalType.intro}
          similarity={result.bestNormal.similarity}
          special={result.special}
          onClose={() => setShowPoster(false)}
        />
      )}
    </>
  )
}
