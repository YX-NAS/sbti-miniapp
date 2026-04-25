import { View, Text, ScrollView, Picker } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import {
  CONSTELLATION_NOTICE_PRESETS,
  DEFAULT_CONTENT_ADMIN_CONFIG,
  type ContentAdminConfig,
  type FeatureTopicConfig,
  type HomeHotTestConfig,
  type TestCenterCardConfig,
  type TopicTestEntryConfig,
} from '../../data/contentConfig'
import { TOPIC_TEST_CONFIG } from '../../data/topicQuestions'
import {
  formatDateKey,
  getAllDailyQuestions,
  getContentAdminConfig,
  resetContentAdminConfig,
  saveContentAdminConfig,
} from '../../utils/contentConfig'
import { getAllFulltestFunnelStats, getEventSummary, trackEvent } from '../../utils/analytics'
import './index.scss'

type SortableItem = { id: string }

const PERIOD_OPTIONS = [
  { label: '今日', value: 'today' },
  { label: '明日', value: 'tomorrow' },
  { label: '本周', value: 'week' },
  { label: '考试运势', value: 'exam' },
] as const

function moveItem<T extends SortableItem>(items: T[], id: string, direction: 'up' | 'down') {
  const index = items.findIndex(item => item.id === id)
  if (index < 0) return items
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= items.length) return items

  const next = [...items]
  const [current] = next.splice(index, 1)
  next.splice(targetIndex, 0, current)
  return next
}

export default function AdminConsole() {
  const dailyQuestions = getAllDailyQuestions()
  const todayKey = formatDateKey(new Date())
  const [config, setConfig] = useState<ContentAdminConfig>(getContentAdminConfig)
  const [scheduleDate, setScheduleDate] = useState(todayKey)
  const [analyticsSummary, setAnalyticsSummary] = useState(getEventSummary())
  const [funnelStats] = useState(getAllFulltestFunnelStats())

  useDidShow(() => {
    setConfig(getContentAdminConfig())
    setAnalyticsSummary(getEventSummary())
    trackEvent('admin_console_view', { source: 'content-config' })
  })

  const persistConfig = (next: ContentAdminConfig) => {
    setConfig(next)
    saveContentAdminConfig(next)
  }

  const toggleVisible = <
    T extends HomeHotTestConfig | FeatureTopicConfig | TestCenterCardConfig | TopicTestEntryConfig,
  >(
    key: 'hotTests' | 'featureTopics' | 'coreTests' | 'topicTests',
    id: string,
  ) => {
    const next = {
      ...config,
      [key]: config[key].map((item: T) => item.id === id ? { ...item, visible: !item.visible } : item),
    } as ContentAdminConfig
    persistConfig(next)
  }

  const sortList = (key: 'hotTests' | 'featureTopics' | 'coreTests' | 'topicTests', id: string, direction: 'up' | 'down') => {
    const next = {
      ...config,
      [key]: moveItem(config[key], id, direction),
    } as ContentAdminConfig
    persistConfig(next)
  }

  const currentQuestionIndex = Math.max(
    dailyQuestions.findIndex(item => item.id === config.dailyQuestionOverrides[scheduleDate]),
    0,
  )

  const analyticsEntries = Object.entries(analyticsSummary)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8)

  const handleQuestionChange = (event) => {
    const selectedQuestion = dailyQuestions[event.detail.value]
    if (!selectedQuestion) return

    persistConfig({
      ...config,
      dailyQuestionOverrides: {
        ...config.dailyQuestionOverrides,
        [scheduleDate]: selectedQuestion.id,
      },
    })
    Taro.showToast({ title: '已更新投放题目', icon: 'success' })
  }

  const handleClearQuestion = () => {
    const nextOverrides = { ...config.dailyQuestionOverrides }
    delete nextOverrides[scheduleDate]
    persistConfig({ ...config, dailyQuestionOverrides: nextOverrides })
    Taro.showToast({ title: '已恢复默认轮播', icon: 'none' })
  }

  const handlePeriodChange = (event) => {
    const nextPeriod = PERIOD_OPTIONS[event.detail.value]?.value || DEFAULT_CONTENT_ADMIN_CONFIG.constellation.defaultPeriod
    persistConfig({
      ...config,
      constellation: {
        ...config.constellation,
        defaultPeriod: nextPeriod,
      },
    })
  }

  const handleNoticeChange = (event) => {
    const nextNotice = CONSTELLATION_NOTICE_PRESETS[event.detail.value] || CONSTELLATION_NOTICE_PRESETS[0]
    persistConfig({
      ...config,
      constellation: {
        ...config.constellation,
        noticeText: nextNotice,
      },
    })
  }

  const handleReset = () => {
    resetContentAdminConfig()
    const next = getContentAdminConfig()
    setConfig(next)
    setAnalyticsSummary(getEventSummary())
    Taro.showToast({ title: '已恢复默认配置', icon: 'success' })
  }

  return (
    <ScrollView className="admin-console" scrollY>
      <View className="admin-hero">
        <Text className="hero-title">2.2 内容配置台</Text>
        <Text className="hero-desc">当前版本先用本地配置完成题库投放、专题顺序、星座页配置和数据查看，便于先调试前后台闭环。</Text>
      </View>

      <View className="admin-section">
        <Text className="section-title">概览</Text>
        <View className="summary-grid">
          <View className="summary-chip">
            <Text className="summary-label">首页热门</Text>
            <Text className="summary-value">{config.hotTests.filter(item => item.visible).length}</Text>
          </View>
          <View className="summary-chip">
            <Text className="summary-label">学生专题</Text>
            <Text className="summary-value">{config.featureTopics.filter(item => item.visible).length}</Text>
          </View>
          <View className="summary-chip">
            <Text className="summary-label">测试中心入口</Text>
            <Text className="summary-value">{config.coreTests.filter(item => item.visible).length + config.topicTests.filter(item => item.visible).length}</Text>
          </View>
          <View className="summary-chip">
            <Text className="summary-label">每日投放覆盖</Text>
            <Text className="summary-value">{Object.keys(config.dailyQuestionOverrides).length}</Text>
          </View>
        </View>
      </View>

      <View className="admin-section">
        <Text className="section-title">首页热门测试</Text>
        <Text className="section-subtitle">支持隐藏和排序</Text>
        {config.hotTests.map(item => (
          <View key={item.id} className="config-item">
            <View className="item-head">
              <Text className="item-title">{item.emoji} {item.title}</Text>
              <Text className="item-tag">{item.visible ? '显示中' : '已隐藏'}</Text>
            </View>
            <Text className="item-desc">{item.desc}</Text>
            <View className="item-actions">
              <View className="action-btn" onClick={() => sortList('hotTests', item.id, 'up')}>上移</View>
              <View className="action-btn" onClick={() => sortList('hotTests', item.id, 'down')}>下移</View>
              <View className={`action-btn ${item.visible ? 'warn' : ''}`} onClick={() => toggleVisible('hotTests', item.id)}>
                {item.visible ? '隐藏' : '显示'}
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="admin-section">
        <Text className="section-title">测试中心入口</Text>
        <Text className="section-subtitle">核心测试与学生专题都可调顺序和显隐</Text>
        {config.coreTests.map(item => (
          <View key={item.id} className="config-item">
            <View className="item-head">
              <Text className="item-title">{item.emoji} {item.title}</Text>
              <Text className="item-tag">{item.visible ? '显示中' : '已隐藏'}</Text>
            </View>
            <Text className="item-desc">{item.desc}</Text>
            <View className="item-actions">
              <View className="action-btn" onClick={() => sortList('coreTests', item.id, 'up')}>上移</View>
              <View className="action-btn" onClick={() => sortList('coreTests', item.id, 'down')}>下移</View>
              <View className={`action-btn ${item.visible ? 'warn' : ''}`} onClick={() => toggleVisible('coreTests', item.id)}>
                {item.visible ? '隐藏' : '显示'}
              </View>
            </View>
          </View>
        ))}
        {config.topicTests.map(item => (
          <View key={item.id} className="config-item">
            <View className="item-head">
              <Text className="item-title">{TOPIC_TEST_CONFIG[item.id].emoji} {TOPIC_TEST_CONFIG[item.id].title}</Text>
              <Text className="item-tag">{item.visible ? '显示中' : '已隐藏'}</Text>
            </View>
            <Text className="item-desc">{TOPIC_TEST_CONFIG[item.id].subtitle}</Text>
            <View className="item-actions">
              <View className="action-btn" onClick={() => sortList('topicTests', item.id, 'up')}>上移</View>
              <View className="action-btn" onClick={() => sortList('topicTests', item.id, 'down')}>下移</View>
              <View className={`action-btn ${item.visible ? 'warn' : ''}`} onClick={() => toggleVisible('topicTests', item.id)}>
                {item.visible ? '隐藏' : '显示'}
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="admin-section">
        <Text className="section-title">首页专题入口</Text>
        <Text className="section-subtitle">用于控制首页专题区展示</Text>
        {config.featureTopics.map(item => (
          <View key={item.id} className="config-item">
            <View className="item-head">
              <Text className="item-title">{item.title}</Text>
              <Text className="item-tag">{item.visible ? '显示中' : '已隐藏'}</Text>
            </View>
            <Text className="item-desc">{item.desc}</Text>
            <View className="item-actions">
              <View className="action-btn" onClick={() => sortList('featureTopics', item.id, 'up')}>上移</View>
              <View className="action-btn" onClick={() => sortList('featureTopics', item.id, 'down')}>下移</View>
              <View className={`action-btn ${item.visible ? 'warn' : ''}`} onClick={() => toggleVisible('featureTopics', item.id)}>
                {item.visible ? '隐藏' : '显示'}
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="admin-section">
        <Text className="section-title">每日测试投放</Text>
        <Text className="section-subtitle">支持按日期指定题目，未配置时按原有轮播规则展示</Text>
        <View className="picker-row">
          <Picker mode="date" value={scheduleDate} onChange={(event) => setScheduleDate(event.detail.value)}>
            <View className="picker-btn">日期：{scheduleDate}</View>
          </Picker>
          <Picker mode="selector" range={dailyQuestions.map(item => `${item.type}｜${item.question}`)} value={currentQuestionIndex} onChange={handleQuestionChange}>
            <View className="picker-btn">选择题目</View>
          </Picker>
          <View className="reset-btn" onClick={handleClearQuestion}>恢复默认</View>
        </View>
        <View className="config-item">
          <Text className="item-desc">
            当前投放：{dailyQuestions.find(item => item.id === config.dailyQuestionOverrides[scheduleDate])?.question || '默认按日期轮播'}
          </Text>
        </View>
      </View>

      <View className="admin-section">
        <Text className="section-title">星座内容配置</Text>
        <Text className="section-subtitle">支持设置默认展示周期和页面提示语</Text>
        <View className="picker-row">
          <Picker
            mode="selector"
            range={PERIOD_OPTIONS.map(item => item.label)}
            value={Math.max(PERIOD_OPTIONS.findIndex(item => item.value === config.constellation.defaultPeriod), 0)}
            onChange={handlePeriodChange}
          >
            <View className="picker-btn">默认周期：{PERIOD_OPTIONS.find(item => item.value === config.constellation.defaultPeriod)?.label || '今日'}</View>
          </Picker>
          <Picker
            mode="selector"
            range={CONSTELLATION_NOTICE_PRESETS as unknown as string[]}
            value={Math.max(CONSTELLATION_NOTICE_PRESETS.findIndex(item => item === config.constellation.noticeText), 0)}
            onChange={handleNoticeChange}
          >
            <View className="picker-btn">切换提示语</View>
          </Picker>
        </View>
        <View className="config-item">
          <Text className="item-desc">当前提示：{config.constellation.noticeText}</Text>
        </View>
      </View>

      <View className="admin-section">
        <Text className="section-title">完整版转化漏斗</Text>
        {funnelStats.map(s => (
          <View key={s.type} className="funnel-card">
            <Text className="funnel-type">{s.type === 'cat' ? '🐱 CatTi' : '🧭 学生倾向'}</Text>
            <View className="funnel-row">
              <View className="funnel-col">
                <Text className="funnel-num">{s.quickOpened}</Text>
                <Text className="funnel-label">快测打开</Text>
              </View>
              <Text className="funnel-arrow">→</Text>
              <View className="funnel-col">
                <Text className="funnel-num">{s.fulltestUnlocked}</Text>
                <Text className="funnel-label">解锁完整版</Text>
                <Text className="funnel-rate">{s.unlockRate}</Text>
              </View>
              <Text className="funnel-arrow">→</Text>
              <View className="funnel-col">
                <Text className="funnel-num">{s.fulltestCompleted}</Text>
                <Text className="funnel-label">完成完整版</Text>
                <Text className="funnel-rate">{s.completionRate}</Text>
              </View>
              <Text className="funnel-arrow">→</Text>
              <View className="funnel-col">
                <Text className="funnel-num">{s.fulltestShared}</Text>
                <Text className="funnel-label">分享结果</Text>
                <Text className="funnel-rate">{s.shareRate}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="admin-section">
        <Text className="section-title">基础数据看板</Text>
        {analyticsEntries.length === 0 && (
          <View className="analytics-card">
            <Text className="analytics-empty">当前还没有可展示的本地事件数据。</Text>
          </View>
        )}
        {analyticsEntries.length > 0 && (
          <View className="analytics-card">
            {analyticsEntries.map(([name, meta]) => (
              <View key={name} className="analytics-item">
                <Text className="analytics-name">{name}</Text>
                <Text className="analytics-meta">触发 {meta.count} 次</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="footer-actions">
        <View className="reset-btn" onClick={handleReset}>恢复默认配置</View>
      </View>
    </ScrollView>
  )
}
