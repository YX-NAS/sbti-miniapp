import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface Props {
  title: string
  showBack?: boolean
  showShare?: boolean
  onShare?: () => void
}

// 顶部导航栏（固定在顶部）— 带可选返回箭头
export default function PageHeader({ title, showBack = false, showShare = false, onShare }: PageHeader) {
  const handleBack = () => {
    // 始终尝试 navigateBack，如果历史栈为空则用 switchTab 回首页
    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack({ fail: () => Taro.switchTab({ url: '/pages/index/index' }) })
    } else {
      Taro.switchTab({ url: '/pages/index/index' })
    }
  }

  return (
    <View className="page-header">
      <View className="page-header-inner">
        {showBack && (
          <View className="back-btn" onClick={handleBack}>
            <Text className="back-arrow">←</Text>
          </View>
        )}
        {!showBack && <View className="back-placeholder" />}
        <Text className="page-title">{title}</Text>
        {showShare && (
          <View className="share-btn" onClick={onShare}>
            <Text className="share-icon">↗</Text>
          </View>
        )}
        {!showShare && <View className="share-placeholder" />}
      </View>
    </View>
  )
}
