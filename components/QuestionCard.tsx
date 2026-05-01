import { View, ScrollView } from '@tarojs/components';
import OptionButton from './OptionButton';
import './QuestionCard.css';
import type { Question } from '../utils/data';

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedValue?: number;
  showDimension: boolean;
  dimensionName: string;
  onSelect: (value: number) => void;
}

const OPTION_CODES = ['A', 'B', 'C', 'D'];

export default function QuestionCard({
  question,
  index,
  selectedValue,
  showDimension,
  dimensionName,
  onSelect
}: QuestionCardProps) {
  return (
    <View className='question-card'>
      <View className='question-meta'>
        <View className='badge'>
          第 {index + 1} 题
        </View>
        <View className='dim-badge'>
          {question.special ? '补充题' : (showDimension ? dimensionName : '维度已隐藏')}
        </View>
      </View>
      <ScrollView
        className='question-text-wrap'
        scrollY
        enhanced
        showScrollbar={false}
      >
        <View className='question-text'>{question.text}</View>
      </ScrollView>
      <View className='options'>
        {question.options.map((opt, i) => (
          <OptionButton
            key={opt.value}
            code={OPTION_CODES[i] || String(i + 1)}
            label={opt.label}
            selected={selectedValue === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </View>
    </View>
  );
}
