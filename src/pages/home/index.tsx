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
          <Text className="main-title">校园人格</Text>
          <Text className="sub-title">类型测试</Text>
        </View>
        <Text className="description">
          看看你的校园画像与关系节奏
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
