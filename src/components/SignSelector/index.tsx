import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface SignSelectorProps {
  selected: string
  onSelect: (signId: string) => void
}

const SIGNS = [
  { id: 'aries', name: '白羊', emoji: '♈' },
  { id: 'taurus', name: '金牛', emoji: '♉' },
  { id: 'gemini', name: '双子', emoji: '♊' },
  { id: 'cancer', name: '巨蟹', emoji: '♋' },
  { id: 'leo', name: '狮子', emoji: '♌' },
  { id: 'virgo', name: '处女', emoji: '♍' },
  { id: 'libra', name: '天秤', emoji: '♎' },
  { id: 'scorpio', name: '天蝎', emoji: '♏' },
  { id: 'sagittarius', name: '射手', emoji: '♐' },
  { id: 'capricorn', name: '摩羯', emoji: '♑' },
  { id: 'aquarius', name: '水瓶', emoji: '♒' },
  { id: 'pisces', name: '双鱼', emoji: '♓' },
]

export default function SignSelector({ selected, onSelect }: SignSelectorProps) {
  return (
    <View className="sign-selector">
      {SIGNS.map(sign => (
        <View
          key={sign.id}
          className={`sign-item ${selected === sign.id ? 'selected' : ''}`}
          onClick={() => onSelect(sign.id)}
        >
          <Text className="sign-emoji">{sign.emoji}</Text>
          <Text className="sign-name">{sign.name}</Text>
        </View>
      ))}
    </View>
  )
}
