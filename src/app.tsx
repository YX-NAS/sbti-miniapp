import { Component, PropsWithChildren } from 'react'
import './app.scss'
import { ensureLocalIdentity } from './utils/userIdentity'
import { pushRecordsToCloud } from './utils/cloudSync'
import { touchVisitStreak } from './utils/retention'

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    // 确保本地身份存在
    ensureLocalIdentity()
    touchVisitStreak()
    // 启动时静默推送本地历史记录到云端
    pushRecordsToCloud().catch(() => {})
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
