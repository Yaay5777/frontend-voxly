/**
 * Floating Performance Button
 * Opens the performance dashboard (only in development)
 */

import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { ENV } from '../config/env';
import PerformanceDashboard from './PerformanceDashboard';

export const PerformanceButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (!ENV.IS_DEV) return null;

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Performance Dashboard"
      >
        <Activity className="w-6 h-6" />
      </motion.button>

      <PerformanceDashboard isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default PerformanceButton;
