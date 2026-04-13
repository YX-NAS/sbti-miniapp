import { View } from '@tarojs/components';
import './OptionButton.css';

interface OptionButtonProps {
  code: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionButton({ code, label, selected, onClick }: OptionButtonProps) {
  return (
    <View
      className={`option-btn ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <View className='option-code'>{code}</View>
      <View className='option-label'>{label}</View>
    </View>
  );
}
