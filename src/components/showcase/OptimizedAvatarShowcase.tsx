import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, Globe, Users, Sparkles } from 'lucide-react';

// Optimized avatar data without WebGL dependencies
const AVATAR_DATA = [
  { id: 'emma', name: 'Emma', country: '🇺🇸', emoji: '👩🏻‍💼', accent: 'American', color: 'from-blue-400 to-blue-600' },
  { id: 'arjun', name: 'Arjun', country: '🇮🇳', emoji: '👨🏽‍🎓', accent: 'Indian', color: 'from-orange-400 to-orange-600' },
  { id: 'marie', name: 'Marie', country: '🇫🇷', emoji: '👩🏻‍🎨', accent: 'French', color: 'from-pink-400 to-pink-600' },
  { id: 'kenji', name: 'Kenji', country: '🇯🇵', emoji: '👨🏻‍💻', accent: 'Japanese', color: 'from-green-400 to-green-600' },
  { id: 'sofia', name: 'Sofia', country: '🇪🇸', emoji: '👩🏽‍🚀', accent: 'Spanish', color: 'from-purple-400 to-purple-600' },
  { id: 'ahmed', name: 'Ahmed', country: '🇦🇪', emoji: '👨🏽‍🎤', accent: 'Arabic', color: 'from-yellow-400 to-yellow-600' },
  { id: 'olivia', name: 'Olivia', country: '🇬🇧', emoji: '👩🏻‍🎭', accent: 'British', color: 'from-teal-400 to-teal-600' },
  { id: 'thabo', name: 'Thabo', country: '🇿🇦', emoji: '👨🏿‍🎨', accent: 'South African', color: 'from-red-400 to-red-600' },
];

const OptimizedAvatarShowcase: React.FC = () => {
  const [activeAvatar, setActiveAvatar] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Auto-cycle through avatars
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setActiveAvatar((prev) => (prev + 1) % AVATAR_DATA.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Animation phase cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleAvatarClick = useCallback((index: number) => {
    setActiveAvatar(index);
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const resetAnimation = useCallback(() => {
    setActiveAvatar(0);
    setIsPlaying(true);
  }, []);

  const currentAvatar = AVATAR_DATA[activeAvatar];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Showcase Container - NO WebGL */}
      <div className="relative h-96 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-800 dark:via-purple-900 dark:to-pink-900 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-400 via-green-500 to-yellow-500 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Central Avatar Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            key={activeAvatar}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="relative z-10 text-center"
          >
            {/* Large Avatar Emoji */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl mb-4 filter drop-shadow-lg"
            >
              {currentAvatar.emoji}
            </motion.div>

            {/* Avatar Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl"
            >
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-2xl">{currentAvatar.country}</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentAvatar.name}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {currentAvatar.accent} Accent
              </p>
            </motion.div>
          </motion.div>

          {/* Orbiting Avatar Dots */}
          <div className="absolute inset-0">
            {AVATAR_DATA.map((avatar, index) => (
              <motion.button
                key={avatar.id}
                onClick={() => handleAvatarClick(index)}
                className={`absolute w-16 h-16 rounded-full bg-gradient-to-br ${avatar.color} shadow-lg backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200 ${
                  index === activeAvatar ? 'ring-4 ring-white/50 scale-110' : ''
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-120px) rotate(-${index * 45}deg)`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: index === activeAvatar ? [1.1, 1.2, 1.1] : [1, 1.05, 1],
                }}
                transition={{
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
              >
                {avatar.emoji}
              </motion.button>
            ))}
          </div>

          {/* Floating Sparkles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-300 pointer-events-none"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                fontSize: `${0.8 + Math.random() * 0.4}rem`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 4,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>

        {/* Control Panel */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl">
          <button
            onClick={togglePlayback}
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={resetAnimation}
            className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Volume2 className="w-4 h-4" />
            <span>{activeAvatar + 1} / {AVATAR_DATA.length}</span>
          </div>
        </div>
      </div>

      {/* Voice Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8"
      >
        {[
          { number: '35+', label: 'Unique Voices', icon: Volume2 },
          { number: '15+', label: 'Languages', icon: Globe },
          { number: '25+', label: 'Countries', icon: Users },
          { number: '100%', label: 'Authentic', icon: Sparkles },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center justify-center mb-2">
                <Icon className="w-6 h-6 text-purple-500 mr-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.number}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default OptimizedAvatarShowcase;
