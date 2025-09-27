import React from 'react';
import { motion } from 'framer-motion';

interface CharacterCounterProps {
  currentCount: number;
  maxCount: number;
  tier: 'free' | 'premium';
  className?: string;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  currentCount,
  maxCount,
  tier,
  className = ''
}) => {
  const percentage = (currentCount / maxCount) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = currentCount > maxCount;

  const getColorClass = () => {
    if (isOverLimit) return 'text-red-500';
    if (isNearLimit) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getBarColor = () => {
    if (isOverLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">
          Characters: <span className={getColorClass()}>{currentCount.toLocaleString()}</span>
        </span>
        <span className="text-gray-500">
          {tier === 'premium' ? 'Unlimited' : `${maxCount.toLocaleString()} max`}
        </span>
      </div>
      
      {tier !== 'premium' && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full ${getBarColor()} transition-colors duration-300`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      )}
      
      {isOverLimit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs flex items-center gap-1"
        >
          <span>⚠️</span>
          Text exceeds character limit. Please shorten your text.
        </motion.div>
      )}
      
      {isNearLimit && !isOverLimit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-yellow-600 text-xs flex items-center gap-1"
        >
          <span>⚡</span>
          Approaching character limit
        </motion.div>
      )}
    </div>
  );
};
