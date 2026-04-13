import { View, Text, Button } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import './index.css';

export default function Index() {
  const router = useRouter();

  const handleStart = (preview = false) => {
    router.push(`/pages/test/test?preview=${preview ? '1' : '0'}`);
  };

  return (
    <View className='page'>
      {/* Hero Section */}
      <View className='hero-card'>
        <View className='eyebrow'>
          <Text>🧪 人格测评</Text>
        </View>
        <Text className='hero-title'>SBTI 人格测试</Text>
        <Text className='hero-sub'>
          深度解析你的十五个内在维度，{'\n'}
          揭开你人格中最真实的画像。
        </Text>

        <View className='hero-grid'>
          <View className='mini-panel'>
            <Text className='panel-title'>测试说明</Text>
            <View className='panel-list'>
              <Text>• 31道基础题目</Text>
              <Text>• 15个核心维度</Text>
              <Text>• 随机题目顺序</Text>
              <Text>• 智能人格匹配</Text>
            </View>
          </View>
          <View className='mini-panel'>
            <Text className='panel-title'>特殊机制</Text>
            <View className='panel-list'>
              <Text>• 补充题随机插入</Text>
              <Text>• 隐藏人格触发条件</Text>
              <Text>• 维度结果深度解读</Text>
            </View>
          </View>
        </View>

        <View className='hero-actions'>
          <Button
            className='btn-primary'
            onClick={() => handleStart(false)}
          >
            开始测试
          </Button>
          <Button
            className='btn-secondary'
            onClick={() => handleStart(true)}
          >
            预览模式
          </Button>
        </View>
      </View>

      {/* Disclaimer */}
      <View className='disclaimer'>
        <Text>本测试仅供娱乐，请勿将其作为医学、心理学诊断依据。</Text>
      </View>
    </View>
  );
}
