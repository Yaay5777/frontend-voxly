import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, BarChart3, Activity } from 'lucide-react';

interface AdvancedAudioVisualizerProps {
  audioUrl?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  visualizerType?: 'bars' | 'waveform' | 'circular' | 'spectrum';
  mode?: 'bars' | 'waveform' | 'circular' | 'spectrum';
  color?: string;
  height?: number;
  showControls?: boolean;
  realTime?: boolean;
  compact?: boolean;
}

const AdvancedAudioVisualizer: React.FC<AdvancedAudioVisualizerProps> = ({
  audioUrl,
  isPlaying = false,
  onPlayPause,
  visualizerType = 'bars',
  mode = 'bars',
  color = '#8B5CF6',
  height = 120,
  showControls = true,
  realTime = false,
  compact = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number>();
  const isInitializedRef = useRef<boolean>(false);
  const [audioData, setAudioData] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Initialize audio context and analyser
  const initializeAudio = useCallback(async () => {
    if (!audioUrl || !audioRef.current) return;
    
    // Prevent multiple initializations on the same audio element
    if (isInitializedRef.current) {
      console.log('Audio already initialized, skipping...');
      return;
    }

    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;

      // Create analyser if it doesn't exist
      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
      }

      // Only create source node if it doesn't exist
      // This prevents the "InvalidStateError" from creating multiple sources
      if (!sourceNodeRef.current) {
        sourceNodeRef.current = audioContext.createMediaElementSource(audioRef.current);
        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContext.destination);
        console.log('✅ Audio source node created and connected');
      }

      // Set audio properties
      audioRef.current.crossOrigin = 'anonymous';
      audioRef.current.volume = volume;
      
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Error initializing audio:', error);
      // If error is about existing source, that's ok - we can continue
      if (error instanceof Error && error.message.includes('already')) {
        console.log('Audio element already has a source node, continuing...');
        isInitializedRef.current = true;
      }
    }
  }, [audioUrl, volume]);

  // Draw visualizer based on type
  const drawVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // Convert to normalized array for state
    const normalizedData = Array.from(dataArray).map(value => value / 255);
    setAudioData(normalizedData);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color + '40');
    ctx.fillStyle = gradient;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    switch (visualizerType) {
      case 'bars':
        drawBars(ctx, dataArray, canvas.width, canvas.height);
        break;
      case 'waveform':
        drawWaveform(ctx, dataArray, canvas.width, canvas.height);
        break;
      case 'circular':
        drawCircular(ctx, dataArray, canvas.width, canvas.height);
        break;
      case 'spectrum':
        drawSpectrum(ctx, dataArray, canvas.width, canvas.height);
        break;
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(drawVisualizer);
    }
  }, [visualizerType, color, isPlaying]);

  // Draw bar visualizer
  const drawBars = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const barWidth = width / dataArray.length * 2.5;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * height * 0.8;
      
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  };

  // Draw waveform visualizer
  const drawWaveform = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    ctx.beginPath();
    const sliceWidth = width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 255;
      const y = v * height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  // Draw circular visualizer
  const drawCircular = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    for (let i = 0; i < dataArray.length; i++) {
      const angle = (i / dataArray.length) * Math.PI * 2;
      const barHeight = (dataArray[i] / 255) * radius;
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  // Draw spectrum visualizer
  const drawSpectrum = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(0.2, '#ff8000');
    gradient.addColorStop(0.4, '#ffff00');
    gradient.addColorStop(0.6, '#80ff00');
    gradient.addColorStop(0.8, '#00ff80');
    gradient.addColorStop(1, '#0080ff');
    
    ctx.fillStyle = gradient;

    const barWidth = width / dataArray.length;
    
    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * height;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
    }
  };

  // Handle time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Cleanup function
  const cleanupAudio = useCallback(() => {
    console.log('🧹 Cleaning up audio resources...');
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Disconnect source node if it exists
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      } catch (error) {
        console.log('Source already disconnected');
      }
    }
    
    // Close audio context if it exists
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
        audioContextRef.current = null;
      } catch (error) {
        console.log('Audio context already closed');
      }
    }
    
    analyserRef.current = null;
    isInitializedRef.current = false;
  }, []);

  // Effects
  useEffect(() => {
    if (audioUrl) {
      initializeAudio();
    }
    
    // Cleanup on unmount or when audioUrl changes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioUrl, initializeAudio]);

  useEffect(() => {
    const handlePlayback = async () => {
      if (!audioRef.current) return;

      if (isPlaying) {
        try {
          // Resume audio context if suspended (fixes autoplay issues)
          if (audioContextRef.current?.state === 'suspended') {
            await audioContextRef.current.resume();
            console.log('✅ Audio context resumed');
          }

          // Play audio with user interaction handling
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('✅ Audio playback started');
                drawVisualizer();
              })
              .catch((error) => {
                console.error('Audio play() failed:', error);
                if (error.name === 'NotAllowedError') {
                  console.warn('⚠️ Autoplay blocked. User interaction required.');
                  // Notify parent component via callback if needed
                  onPlayPause?.();
                }
              });
          }
        } catch (error) {
          console.error('Error during playback:', error);
        }
      } else {
        audioRef.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
    };

    handlePlayback();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, drawVisualizer, onPlayPause]);

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get visualizer icon
  const getVisualizerIcon = () => {
    switch (visualizerType) {
      case 'bars': return <BarChart3 className="w-4 h-4" />;
      case 'waveform': return <Activity className="w-4 h-4" />;
      case 'circular': return <Activity className="w-4 h-4" />;
      case 'spectrum': return <Volume2 className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 shadow-lg">
      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => onPlayPause?.()}
        />
      )}

      {/* Visualizer Canvas */}
      <div className="relative mb-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={height}
          className="w-full h-auto rounded-lg bg-black/5 dark:bg-white/5"
        />
        
        {/* Visualizer Type Indicator */}
        <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full px-3 py-1">
          {getVisualizerIcon()}
          <span className="text-xs font-medium capitalize">{visualizerType}</span>
        </div>

        {/* Audio Data Display */}
        <AnimatePresence>
          {audioData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-2 left-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full px-3 py-1"
            >
              <span className="text-xs font-medium">
                {audioData.filter(d => d > 0.1).length} active frequencies
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onPlayPause}
              className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
                if (audioRef.current) {
                  audioRef.current.volume = newVolume;
                }
              }}
              className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAudioVisualizer;
