import { View, Text } from '@tarojs/components'
import { getScoreColor } from '../../utils/constellation_data'
import './index.scss'

interface RadarBarProps {
  label: string
  value: number
  animated?: boolean
}

export default function RadarBar({ label, value, animated = true }: RadarBarProps) {
  const color = getScoreColor(value)

  return (
    <View className="radar-bar">
      <View className="radar-label-row">
        <Text className="radar-label">{label}</Text>
        <Text className="radar-value" style={{ color }}>{value}分</Text>
      </View>
      <View className="radar-track">
        <View
          className={`radar-fill ${animated ? 'animated' : ''}`}
          style={{ width: `${value}%`, background: color }}
        />
      </View>
    </View>
  )
}
