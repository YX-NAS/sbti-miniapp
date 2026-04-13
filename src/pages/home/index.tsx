import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Home() {
  const handleStartTest = () => {
    Taro.navigateTo({ url: '/pages/test/index' })
  }

  return (
    <View className="home-container">
      <View className="content">
        <View className="title-wrapper">
          <Text className="main-title">SBTI</Text>
          <Text className="sub-title">性格测试</Text>
        </View>
        <Text className="description">
          探索你的性格特质，发现真实的自己
        </Text>
        <View className="test-info">
          <Text className="info-text">共31道题目</Text>
          <Text className="info-text">约5分钟完成</Text>
        </View>
      </View>
      <View className="footer">
        <Button className="start-btn" onClick={handleStartTest}>
          开始测试
        </Button>
      </View>
    </View>
  )
}
