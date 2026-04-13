import { View } from '@tarojs/components';
import './ProgressBar.css';

interface ProgressBarProps {
  done: number;
  total: number;
}

export default function ProgressBar({ done, total }: ProgressBarProps) {
  const percent = total > 0 ? (done / total) * 100 : 0;

  return (
    <View className='progress-wrapper'>
      <View className='progress-bar'>
        <View className='progress-fill' style={{ width: `${percent}%` }} />
      </View>
      <View className='progress-text'>{done} / {total}</View>
    </View>
  );
}
