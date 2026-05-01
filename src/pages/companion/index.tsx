import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

export default function CompanionPage() {
  const [url, setUrl] = useState('')

  Taro.useRouter()

  Taro.useDidShow(() => {
    const router = Taro.useRouter()
    const encodedUrl = router.params.url || ''
    const decodedUrl = decodeURIComponent(encodedUrl)
    
    console.log('[Companion.WebView] Loading URL:', decodedUrl)
    
    if (decodedUrl) {
      setUrl(decodedUrl)
    } else {
      Taro.showToast({ 
        title: '页面加载参数错误',
        icon: 'none',
        duration: 2000 
      })
      Taro.navigateBack()
    }
  })

  if (!url) {
    return (
      <View className="companion-loading">
        <View className="loading-text">准备陪聊页面中...</View>
      </View>
    )
  }

  return (
    <View className="companion-container">
      <web-view src={url} />
    </View>
  )
}
