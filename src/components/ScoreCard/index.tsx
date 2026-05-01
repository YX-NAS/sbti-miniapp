import { View, Text } from '@tarojs/components'
import { getScoreColor, getScoreLabel } from '../../utils/constellation_data'
import './index.scss'

interface ScoreCardProps {
  score: number
  label: string
  size?: 'normal' | 'large'
}

export default function ScoreCard({ score, label, size = 'normal' }: ScoreCardProps) {
  const color = getScoreColor(score)
  const scoreLabel = getScoreLabel(score)

  return (
    <View className={`score-card ${size}`}>
      <Text className="score-number" style={{ color }}>{score}</Text>
      <Text className="score-label">{label}</Text>
      <View className="score-tag" style={{ background: `${color}20`, color }}>
        <Text>{scoreLabel}</Text>
      </View>
    </View>
  )
}
