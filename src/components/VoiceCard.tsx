// frontend/src/components/VoiceCard.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export type VoiceObject = {
  id: string | number;
  name?: string;
  avatar?: string;
  tags?: string[];
  demo?: string;
  description?: string;
  gender?: string;
  accent?: string;
  sample_text?: string;
};

export type VoiceCardProps = {
  v: VoiceObject;
  onSelect?: (v: VoiceObject) => void;
  onAudition?: (v: VoiceObject) => void;
};

const VoiceCard: React.FC<VoiceCardProps> = ({ v, onSelect, onAudition }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(v);
    }
  };

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);

    if (isPlaying && audioRef.current) {
      // Pause current audio
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Generate demo audio URL
      const demoUrl = `https://yaya5777-voxly-tts.hf.space/demo/${v.id}`;
      
      // Create new audio element
      const audio = new Audio(demoUrl);
      audioRef.current = audio;

      // Set up audio event listeners
      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplay = () => setIsLoading(false);
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setError('Failed to load audio');
        setIsLoading(false);
        setIsPlaying(false);
        audioRef.current = null;
      };

      // Start playing
      await audio.play();
      
    } catch (err) {
      console.error('Audio playback error:', err);
      setError('Playback failed');
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const MotionDiv = (motion.div as unknown) as React.FC<any>;

  return (
    <MotionDiv
      whileHover={{ scale: 1.02, y: -6, rotateX: 3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white/6 backdrop-blur rounded-xl p-3 shadow-lg cursor-pointer"
      onClick={() => onSelect?.(v)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKey}
      aria-label={`Select voice ${v.name ?? v.id}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center overflow-hidden">
          {v.avatar ? <img src={v.avatar} alt={v.name ?? 'avatar'} className="w-full h-full object-cover" /> : <span className="text-white font-bold">{String(v.name ?? v.id)[0]}</span>}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">{v.name ?? `Voice ${v.id}`}</div>
          <div className="text-xs text-slate-300 mt-1 flex gap-2">
            {(v.tags ?? []).slice(0, 3).map((t) => (
              <span key={t} className="bg-white/10 px-2 py-0.5 rounded text-xs">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            className={`px-3 py-1 rounded text-xs text-white transition-all duration-200 ${
              isLoading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : isPlaying 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' 
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700'
            }`}
            aria-label={`${isPlaying ? 'Pause' : 'Play'} sample for ${v.name ?? v.id}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading</span>
              </div>
            ) : isPlaying ? (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white"></div>
                <div className="w-2 h-2 bg-white"></div>
                <span>Pause</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent"></div>
                <span>Play</span>
              </div>
            )}
          </button>
          {error && (
            <div className="text-xs text-red-400 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </MotionDiv>
  );
};

export default VoiceCard;
