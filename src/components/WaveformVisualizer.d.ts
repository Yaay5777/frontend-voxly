import { FC } from 'react';

export interface WaveformVisualizerProps {
  audioUrl: string;
  isPlaying: boolean;
  height?: number;
  width?: number;
  barWidth?: number;
  gap?: number;
  barColor?: string;
  barPlayedColor?: string;
  barHoverColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

declare const WaveformVisualizer: FC<WaveformVisualizerProps>;

export default WaveformVisualizer;
