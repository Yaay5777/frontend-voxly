import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface EnhancedWaveformProps {
  audioUrl?: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek?: (time: number) => void;
  className?: string;
}

export const EnhancedWaveform: React.FC<EnhancedWaveformProps> = ({
  audioUrl,
  isPlaying,
  onPlayPause,
  onSeek,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize audio context and analyser
  useEffect(() => {
    if (audioUrl && !audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 256;
      
      setAudioContext(ctx);
      setAnalyser(analyserNode);
    }
  }, [audioUrl, audioContext]);

  // Load and analyze audio
  useEffect(() => {
    if (audioUrl && audioContext && analyser) {
      setIsLoading(true);
      
      fetch(audioUrl)
        .then(response => response.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer))
        .then(audioBuffer => {
          // Generate waveform data
          const channelData = audioBuffer.getChannelData(0);
          const samples = 200; // Number of bars in waveform
          const blockSize = Math.floor(channelData.length / samples);
          const waveform: number[] = [];
          
          for (let i = 0; i < samples; i++) {
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
              sum += Math.abs(channelData[i * blockSize + j]);
            }
            waveform.push(sum / blockSize);
          }
          
          setWaveformData(waveform);
          setDuration(audioBuffer.duration);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error loading audio:', error);
          setIsLoading(false);
        });
    }
  }, [audioUrl, audioContext, analyser]);

  // Connect audio element to analyser
  useEffect(() => {
    if (audioRef.current && audioContext && analyser) {
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    }
  }, [audioContext, analyser]);

  // Animation loop for real-time visualization
  const animate = useCallback(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw waveform
    const barWidth = canvas.width / waveformData.length;
    const progress = duration > 0 ? currentTime / duration : 0;

    waveformData.forEach((amplitude, index) => {
      const barHeight = amplitude * canvas.height * 0.8;
      const x = index * barWidth;
      const y = (canvas.height - barHeight) / 2;
      
      // Color based on progress and audio data
      const isPlayed = index / waveformData.length < progress;
      const audioIntensity = isPlaying ? dataArray[Math.floor(index * bufferLength / waveformData.length)] / 255 : 0;
      
      if (isPlayed) {
        // Played portion - gradient with audio reactivity
        const intensity = Math.max(0.3, audioIntensity);
        ctx.fillStyle = `rgba(147, 51, 234, ${intensity})`;
      } else {
        // Unplayed portion
        ctx.fillStyle = 'rgba(156, 163, 175, 0.4)';
      }
      
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });

    // Draw progress indicator
    const progressX = progress * canvas.width;
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, canvas.height);
    ctx.stroke();

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [analyser, waveformData, currentTime, duration, isPlaying]);

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Handle canvas click for seeking
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !duration) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickProgress = x / rect.width;
    const seekTime = clickProgress * duration;
    
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
    if (onSeek) {
      onSeek(seekTime);
    }
  };

  // Handle mouse events for scrubbing
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleCanvasClick(event);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    handleCanvasClick(event);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [audioUrl]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={() => audioContext?.resume()}
        />
      )}

      {/* Waveform Canvas */}
      <div className="relative bg-gray-50 rounded-lg p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"
            />
            <span className="ml-2 text-sm text-gray-600">Analyzing audio...</span>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={800}
            height={100}
            className="w-full h-24 cursor-pointer"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onPlayPause}
            disabled={!audioUrl}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center text-white font-medium
              ${audioUrl 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
            whileHover={audioUrl ? { scale: 1.05 } : {}}
            whileTap={audioUrl ? { scale: 0.95 } : {}}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </motion.button>

          <div className="text-sm text-gray-600">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>💡</span>
          <span>Click waveform to seek</span>
        </div>
      </div>

      {/* Playback Speed Control */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">Speed:</span>
        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
          <motion.button
            key={speed}
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.playbackRate = speed;
              }
            }}
            className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {speed}x
          </motion.button>
        ))}
      </div>
    </div>
  );
};
