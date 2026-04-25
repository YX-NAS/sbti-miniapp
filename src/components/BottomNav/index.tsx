import { View, Text, Navigator } from '@tarojs/components'
import './index.scss'

// 底部导航 — 所有页面共享
export default function BottomNav() {
  return (
    <View className="bottom-nav">
      <Navigator url="/pages/daily-test/index" className="nav-item">
        <Text className="nav-icon">📅</Text>
        <Text className="nav-label">每日一测</Text>
      </Navigator>
      <Navigator url="/pages/match/index" className="nav-item">
        <Text className="nav-icon">💑</Text>
        <Text className="nav-label">室友匹配</Text>
      </Navigator>
      <Navigator url="/pages/couple-match/index" className="nav-item">
        <Text className="nav-icon">🧪</Text>
        <Text className="nav-label">CP配对</Text>
      </Navigator>
      <Navigator url="/pages/history/index" className="nav-item">
        <Text className="nav-icon">📋</Text>
        <Text className="nav-label">测试记录</Text>
      </Navigator>
      <Navigator url="/pages/constellation/home/index" className="nav-item">
        <Text className="nav-icon">🔮</Text>
        <Text className="nav-label">星座查询</Text>
      </Navigator>
    </View>
  )
}
