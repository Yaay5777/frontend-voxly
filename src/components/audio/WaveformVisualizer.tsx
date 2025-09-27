import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Download } from 'lucide-react';
import { clsx } from 'clsx';
import GlowButton from '../ui/GlowButton';

interface WaveformVisualizerProps {
  audioUrl?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'full';
  showControls?: boolean;
  realTime?: boolean;
  audioData?: number[];
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  audioUrl,
  isPlaying = false,
  onPlayPause,
  onSeek,
  className,
  variant = 'default',
  showControls = true,
  realTime = false,
  audioData = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  // Initialize audio context and analyser
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      const audio = audioRef.current;
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);

      // Create audio context for real-time analysis
      if (realTime) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 256;
        
        const source = ctx.createMediaElementSource(audio);
        source.connect(analyserNode);
        analyserNode.connect(ctx.destination);
        
        setAudioContext(ctx);
        setAnalyser(analyserNode);
      }

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [audioUrl, realTime]);

  // Draw waveform
  const drawWaveform = (frequencies?: Uint8Array) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Use real-time data or static visualization
    const data = frequencies || new Uint8Array(128).fill(0).map((_, i) => 
      Math.sin(i * 0.1 + Date.now() * 0.001) * 50 + 50
    );

    const barWidth = width / data.length;
    const centerY = height / 2;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#d946ef');

    ctx.fillStyle = gradient;

    // Draw bars
    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * height * 0.8;
      const x = i * barWidth;
      
      // Main bar
      ctx.fillRect(x, centerY - barHeight / 2, barWidth - 1, barHeight);
      
      // Glow effect
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 10;
      ctx.fillRect(x, centerY - barHeight / 2, barWidth - 1, barHeight);
      ctx.shadowBlur = 0;
    }

    // Draw progress line
    if (duration > 0) {
      const progressX = (currentTime / duration) * width;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();
    }
  };

  // Animation loop for real-time visualization
  useEffect(() => {
    if (realTime && analyser && isPlaying) {
      const animate = () => {
        const frequencies = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencies);
        drawWaveform(frequencies);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      drawWaveform();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [realTime, analyser, isPlaying, currentTime, duration]);

  // Handle canvas click for seeking
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek || duration === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickTime = (x / canvas.width) * duration;
    
    onSeek(clickTime);
  };

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const canvasHeight = variant === 'compact' ? 60 : variant === 'full' ? 200 : 120;

  return (
    <motion.div
      className={clsx(
        'relative bg-glass-100 backdrop-blur-md rounded-xl border border-glass-200 p-4',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
        />
      )}

      {/* Waveform canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={canvasHeight}
        className="w-full h-auto cursor-pointer rounded-lg"
        onClick={handleCanvasClick}
      />

      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <GlowButton
              size="sm"
              variant="primary"
              onClick={onPlayPause}
              icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              glow={false}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </GlowButton>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Volume2 className="w-4 h-4" />
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {audioUrl && (
            <GlowButton
              size="sm"
              variant="ghost"
              onClick={() => {
                const link = document.createElement('a');
                link.href = audioUrl;
                link.download = 'voxly-audio.wav';
                link.click();
              }}
              icon={<Download className="w-4 h-4" />}
              glow={false}
            >
              Download
            </GlowButton>
          )}
        </div>
      )}

      {/* Real-time frequency display */}
      {realTime && audioData.length > 0 && (
        <div className="mt-3 flex items-center gap-1 h-8">
          {audioData.slice(0, 32).map((value, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-t from-voxly-500 to-accent-500 rounded-sm flex-1"
              style={{ height: `${Math.max(value * 100, 2)}%` }}
              animate={{ height: `${Math.max(value * 100, 2)}%` }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default WaveformVisualizer;
