// Voice History & Favorites Panel Component
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, TrendingUp, X } from 'lucide-react';
import { Voice } from '../types';

interface VoiceHistoryPanelProps {
  recentVoices: Voice[];
  favoriteVoices: Voice[];
  mostUsedVoices: Array<{ voiceId: string; voiceName: string; useCount: number }>;
  onVoiceSelect: (voice: Voice) => void;
  onClose: () => void;
}

export const VoiceHistoryPanel: React.FC<VoiceHistoryPanelProps> = ({
  recentVoices,
  favoriteVoices,
  mostUsedVoices,
  onVoiceSelect,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 right-4 w-96 max-h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-between">
        <h3 className="text-lg font-bold">Quick Access</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto max-h-[540px]">
        {/* Favorites Section */}
        {favoriteVoices.length > 0 && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Favorites</h4>
              <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                {favoriteVoices.length}
              </span>
            </div>
            <div className="space-y-2">
              {favoriteVoices.slice(0, 5).map((voice) => (
                <motion.button
                  key={voice.id}
                  whileHover={{ x: 4 }}
                  onClick={() => onVoiceSelect(voice)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                    {voice.name[0]}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{voice.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{voice.accent}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Recently Used Section */}
        {recentVoices.length > 0 && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Recently Used</h4>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                {recentVoices.length}
              </span>
            </div>
            <div className="space-y-2">
              {recentVoices.slice(0, 5).map((voice) => (
                <motion.button
                  key={voice.id}
                  whileHover={{ x: 4 }}
                  onClick={() => onVoiceSelect(voice)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
                    {voice.name[0]}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{voice.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{voice.accent}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Most Used Section */}
        {mostUsedVoices.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Most Used</h4>
            </div>
            <div className="space-y-2">
              {mostUsedVoices.slice(0, 5).map((item, index) => {
                const voice = recentVoices.find(v => v.id === item.voiceId) || favoriteVoices.find(v => v.id === item.voiceId);
                if (!voice) return null;
                
                return (
                  <motion.button
                    key={voice.id}
                    whileHover={{ x: 4 }}
                    onClick={() => onVoiceSelect(voice)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-white text-sm font-bold">
                      {voice.name[0]}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{voice.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{voice.accent}</p>
                    </div>
                    <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                      {item.useCount}x
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recentVoices.length === 0 && favoriteVoices.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-4xl mb-2">🎙️</div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              No history yet. Start using voices to see them here!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
