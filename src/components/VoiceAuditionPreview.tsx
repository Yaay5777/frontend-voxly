import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Voice {
  id: string;
  name: string;
  description: string;
  avatar: string;
  color: string;
  tags: string[];
  sample_text: string;
}

interface VoiceAuditionPreviewProps {
  voices: Voice[];
  selectedVoice?: string;
  onVoiceSelect: (voiceId: string) => void;
  className?: string;
}

export const VoiceAuditionPreview: React.FC<VoiceAuditionPreviewProps> = ({
  voices,
  selectedVoice,
  onVoiceSelect,
  className = ''
}) => {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [loadingVoice, setLoadingVoice] = useState<string | null>(null);
  const [audioCache, setAudioCache] = useState<Map<string, string>>(new Map());
  const audioRef = useRef<HTMLAudioElement>(null);

  const generatePreview = async (voice: Voice) => {
    if (audioCache.has(voice.id)) {
      playAudio(audioCache.get(voice.id)!);
      return;
    }

    setLoadingVoice(voice.id);
    
    try {
      const formData = new FormData();
      formData.append('text', voice.sample_text);
      formData.append('voice_id', voice.id);
      formData.append('language', 'en');

      const response = await fetch('/api/synthesize', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const audioUrl = result.data.audio_url;
        
        // Cache the audio URL
        setAudioCache(prev => new Map(prev).set(voice.id, audioUrl));
        playAudio(audioUrl);
      } else {
        console.error('Failed to generate preview');
      }
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setLoadingVoice(null);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const handlePlayPreview = (voice: Voice) => {
    if (playingVoice === voice.id) {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingVoice(null);
    } else {
      // Start new playback
      setPlayingVoice(voice.id);
      generatePreview(voice);
    }
  };

  const handleAudioEnd = () => {
    setPlayingVoice(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onError={() => setPlayingVoice(null)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {voices.map((voice) => (
          <motion.div
            key={voice.id}
            layout
            className={`
              relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
              ${selectedVoice === voice.id
                ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-purple-200 hover:shadow-md'
              }
            `}
            onClick={() => onVoiceSelect(voice.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Selection indicator */}
            {selectedVoice === voice.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs"
              >
                ✓
              </motion.div>
            )}

            {/* Voice Avatar */}
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: `${voice.color}20` }}
              >
                {voice.avatar}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{voice.name}</h3>
                <p className="text-xs text-gray-500">{voice.description}</p>
              </div>
            </div>

            {/* Voice Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {voice.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Sample Text Preview */}
            <div className="mb-3 p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 italic">
                "{voice.sample_text}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPreview(voice);
                }}
                disabled={loadingVoice === voice.id}
                className={`
                  flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${playingVoice === voice.id
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loadingVoice === voice.id ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 border border-white border-t-transparent rounded-full"
                    />
                    <span>Loading...</span>
                  </div>
                ) : playingVoice === voice.id ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>⏹️</span>
                    <span>Stop</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>▶️</span>
                    <span>Preview</span>
                  </div>
                )}
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onVoiceSelect(voice.id);
                }}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200
                  ${selectedVoice === voice.id
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedVoice === voice.id ? 'Selected' : 'Select'}
              </motion.button>
            </div>

            {/* Audio Visualization */}
            <AnimatePresence>
              {playingVoice === voice.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-gray-200"
                >
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                        animate={{
                          height: [4, 16, 4],
                          opacity: [0.4, 1, 0.4]
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-1">
                    Playing preview...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {voices.length} voices available
        </div>
        
        <div className="flex gap-2">
          <motion.button
            onClick={() => {
              // Stop all playback
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
              setPlayingVoice(null);
            }}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Stop All
          </motion.button>
          
          <motion.button
            onClick={() => {
              // Clear audio cache
              setAudioCache(new Map());
            }}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear Cache
          </motion.button>
        </div>
      </div>
    </div>
  );
};
