import React from 'react';
import { motion } from 'framer-motion';

interface QuotaDisplayProps {
  currentUsage: number;
  monthlyLimit: number;
  tier: 'free' | 'premium';
  resetDate?: string;
  className?: string;
}

export const QuotaDisplay: React.FC<QuotaDisplayProps> = ({
  currentUsage,
  monthlyLimit,
  tier,
  resetDate,
  className = ''
}) => {
  const percentage = tier === 'premium' ? 0 : (currentUsage / monthlyLimit) * 100;
  const remaining = Math.max(0, monthlyLimit - currentUsage);
  const isNearLimit = percentage > 80;
  const isOverLimit = currentUsage >= monthlyLimit;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Next month';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = () => {
    if (tier === 'premium') return 'text-purple-600';
    if (isOverLimit) return 'text-red-500';
    if (isNearLimit) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressColor = () => {
    if (isOverLimit) return 'from-red-500 to-red-600';
    if (isNearLimit) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Monthly Quota</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          tier === 'premium' 
            ? 'bg-purple-100 text-purple-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {tier === 'premium' ? '✨ Premium' : '🆓 Free'}
        </div>
      </div>

      {tier === 'premium' ? (
        <div className="text-center py-4">
          <div className="text-2xl mb-2">∞</div>
          <p className="text-sm text-gray-600">Unlimited characters</p>
          <p className="text-xs text-gray-500 mt-1">
            Used: {currentUsage.toLocaleString()} characters this month
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used</span>
              <span className={getStatusColor()}>
                {currentUsage.toLocaleString()} / {monthlyLimit.toLocaleString()}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getProgressColor()}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              {remaining.toLocaleString()} remaining
            </span>
            <span>
              Resets {formatDate(resetDate)}
            </span>
          </div>

          {isOverLimit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-700 text-xs">
                <span>🚫</span>
                <span>Quota exceeded. Upgrade to continue.</span>
              </div>
            </motion.div>
          )}

          {isNearLimit && !isOverLimit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-yellow-700 text-xs">
                <span>⚠️</span>
                <span>Running low on quota. Consider upgrading.</span>
              </div>
            </motion.div>
          )}
        </>
      )}

      {tier === 'free' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
        >
          ✨ Upgrade to Premium
        </motion.button>
      )}
    </motion.div>
  );
};
