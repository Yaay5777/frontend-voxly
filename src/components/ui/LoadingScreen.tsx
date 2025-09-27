import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mic, Loader2 } from 'lucide-react';
// Removed WebGL imports to prevent context overflow

interface LoadingScreenProps {
  message?: string;
  variant?: 'full' | 'inline' | 'minimal';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading your voice experience...', 
  variant = 'full' 
}) => {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-voxly-500" />
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{message}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <motion.div
        className="flex flex-col items-center justify-center p-8 bg-glass-100 backdrop-blur-md rounded-2xl border border-glass-200"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 mb-4 relative">
          <motion.div
            className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🎤
          </motion.div>
        </div>
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </motion.div>
    );
  }

  // Full screen loading
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-voxly-900 via-accent-900 to-voxly-800 flex items-center justify-center z-50">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <motion.div
        className="text-center relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Optimized Avatar - No WebGL */}
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <motion.div
            className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl shadow-2xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🎵
          </motion.div>
          
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 border-2 border-white/30 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Brand */}
        <motion.div
          className="flex items-center justify-center space-x-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-voxly-400 to-accent-400 rounded-lg flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">
            Voxly
          </h1>
        </motion.div>

        {/* Loading message */}
        <motion.p
          className="text-white/80 text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {message}
        </motion.p>

        {/* Loading animation */}
        <motion.div
          className="flex items-center justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-white/60 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-64 h-1 bg-white/20 rounded-full mx-auto mt-8 overflow-hidden"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 256 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-voxly-400 to-accent-400 rounded-full"
            animate={{ x: [-256, 256] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-white/50 text-sm mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          Powered by AI • Built for creators
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
