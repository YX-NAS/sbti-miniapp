import { View } from '@tarojs/components';
import { dimensionOrder } from '../utils/data';
import type { Level } from '../utils/calculator';
import './RadarChart.css';

interface RadarChartProps {
  levels: Record<string, Level>;
  rawScores: Record<string, number>;
}

const LEVEL_COLORS: Record<Level, string> = {
  L: '#c0392b',
  M: '#f39c12',
  H: '#27ae60'
};

export default function RadarChart({ levels, rawScores }: RadarChartProps) {
  return (
    <View className='radar-chart'>
      <View className='dim-grid'>
        {dimensionOrder.map(dim => {
          const level = levels[dim] || 'L';
          const score = rawScores[dim] || 0;
          return (
            <View key={dim} className='dim-pill'>
              <View className='dim-pill-label'>{dim}</View>
              <View
                className='dim-pill-value'
                style={{ color: LEVEL_COLORS[level] }}
              >
                {level}
              </View>
              <View className='dim-pill-score'>{score}分</View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
