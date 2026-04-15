import { View, Text } from '@tarojs/components'
import './index.scss'

interface LuckyInfoBarProps {
  luckyColor: string
  luckyNumber: number
  luckyItem: string
  matchSign: string
}

export default function LuckyInfoBar({ luckyColor, luckyNumber, luckyItem, matchSign }: LuckyInfoBarProps) {
  return (
    <View className="lucky-info-bar">
      <View className="lucky-item">
        <Text className="lucky-icon">🌈</Text>
        <Text className="lucky-label">幸运色</Text>
        <Text className="lucky-value">{luckyColor}</Text>
      </View>
      <View className="lucky-divider" />
      <View className="lucky-item">
        <Text className="lucky-icon">🔢</Text>
        <Text className="lucky-label">幸运数</Text>
        <Text className="lucky-value">{luckyNumber}</Text>
      </View>
      <View className="lucky-divider" />
      <View className="lucky-item">
        <Text className="lucky-icon">📦</Text>
        <Text className="lucky-label">幸运物</Text>
        <Text className="lucky-value">{luckyItem}</Text>
      </View>
      <View className="lucky-divider" />
      <View className="lucky-item">
        <Text className="lucky-icon">💕</Text>
        <Text className="lucky-label">速配</Text>
        <Text className="lucky-value">{matchSign}</Text>
      </View>
    </View>
  )
}
