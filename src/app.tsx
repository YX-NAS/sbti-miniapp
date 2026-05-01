import { Component, PropsWithChildren } from 'react'
import './app.scss'
import { ensureLocalIdentity } from './utils/userIdentity'
import { pushRecordsToCloud } from './utils/cloudSync'
import { touchVisitStreak } from './utils/retention'
import { companionSessionManager } from './utils/companionSession'

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    // 确保本地身份存在
    ensureLocalIdentity()
    touchVisitStreak()
    // 启动时静默推送本地历史记录到云端
    pushRecordsToCloud().catch(() => {})
    
    // 初始化陪聊会话管理器
    companionSessionManager.init({
      apiUrl: 'https://api.your-domain.com',      // 改为你的后端 API 地址
      h5BaseUrl: 'https://mvp.your-domain.com',   // 改为你的 H5 应用地址
    })
  }

  componentDidShow() {
    touchVisitStreak()
  }

  componentDidHide() {}

  render() {
    return this.props.children
  }
}

export default App
