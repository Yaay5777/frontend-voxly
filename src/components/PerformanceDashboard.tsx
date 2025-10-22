/**
 * Performance Dashboard Component
 * Shows real-time performance metrics and cache statistics
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Zap, X } from 'lucide-react';
import { webVitals } from '../services/webVitals';
import { voiceCache } from '../services/voiceCache';
import { ENV } from '../config/env';

interface PerformanceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [cacheStats, setCacheStats] = useState({ count: 0, size: 0 });
  const [performanceScore, setPerformanceScore] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const updateStats = async () => {
      // Get Web Vitals metrics
      const currentMetrics = webVitals.getMetrics();
      setMetrics(currentMetrics);

      // Get performance score
      const score = webVitals.getScore();
      setPerformanceScore(score);

      // Get cache stats
      const stats = await voiceCache.getStats();
      setCacheStats(stats);
    };

    updateStats();
    const interval = setInterval(updateStats, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  const getRating = (metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds: Record<string, [number, number]> = {
      'CLS': [0.1, 0.25],
      'FID': [100, 300],
      'FCP': [1800, 3000],
      'LCP': [2500, 4000],
      'TTFB': [800, 1800],
      'INP': [200, 500],
    };

    const [good, poor] = thresholds[metric] || [0, 0];
    
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  };

  const getRatingColor = (rating: string): string => {
    switch (rating) {
      case 'good': return 'text-green-400';
      case 'needs-improvement': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRatingEmoji = (rating: string): string => {
    switch (rating) {
      case 'good': return '✅';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '❌';
      default: return '📊';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getUnit = (metric: string): string => {
    return metric === 'CLS' ? '' : 'ms';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Performance Dashboard</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Performance Score */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Overall Performance</h3>
                </div>
                <div className={`text-4xl font-bold ${getScoreColor(performanceScore)}`}>
                  {performanceScore}/100
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    performanceScore >= 90
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : performanceScore >= 70
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-red-500 to-rose-500'
                  }`}
                  style={{ width: `${performanceScore}%` }}
                />
              </div>
            </div>

            {/* Web Vitals */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Core Web Vitals
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(metrics).map(([name, value]) => {
                  const rating = getRating(name, value);
                  const emoji = getRatingEmoji(rating);
                  const color = getRatingColor(rating);
                  const unit = getUnit(name);

                  return (
                    <div key={name} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-400">{name}</span>
                        <span className="text-lg">{emoji}</span>
                      </div>
                      <div className={`text-2xl font-bold ${color}`}>
                        {Math.round(value)}{unit}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 capitalize">{rating}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cache Statistics */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                Voice Cache Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-sm font-medium text-gray-400 mb-2">Cached Voices</div>
                  <div className="text-3xl font-bold text-cyan-400">{cacheStats.count}</div>
                  <div className="text-xs text-gray-500 mt-1">voice samples</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-sm font-medium text-gray-400 mb-2">Cache Size</div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {(cacheStats.size / 1024 / 1024).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">MB / 50 MB</div>
                </div>
              </div>
              
              {/* Clear Cache Button */}
              <button
                onClick={async () => {
                  await voiceCache.clear();
                  const stats = await voiceCache.getStats();
                  setCacheStats(stats);
                }}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Clear Voice Cache
              </button>
            </div>

            {/* Metrics Descriptions */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Metric Descriptions</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-300">LCP</span>
                  <span className="text-gray-400"> - Largest Contentful Paint: Time to load main content</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">FID</span>
                  <span className="text-gray-400"> - First Input Delay: Time until page responds to input</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">CLS</span>
                  <span className="text-gray-400"> - Cumulative Layout Shift: Visual stability (lower is better)</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">FCP</span>
                  <span className="text-gray-400"> - First Contentful Paint: Time to first render</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">TTFB</span>
                  <span className="text-gray-400"> - Time to First Byte: Server response time</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">INP</span>
                  <span className="text-gray-400"> - Interaction to Next Paint: Overall responsiveness</span>
                </div>
              </div>
            </div>

            {/* Environment Info */}
            {ENV.IS_DEV && (
              <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30 text-sm">
                <div className="text-purple-300 font-medium mb-2">🔧 Development Mode</div>
                <div className="text-purple-200 space-y-1">
                  <div>Analytics: {ENV.AUTH_URL ? '✅ Connected' : '❌ Not configured'}</div>
                  <div>Voice Cache: ✅ Active</div>
                  <div>React Query: ✅ Active</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PerformanceDashboard;
