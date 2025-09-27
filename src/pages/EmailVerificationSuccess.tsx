import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';

const EmailVerificationSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard after a short delay
    if (isAuthenticated && user) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);

  const handleGoToDashboard = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-4xl"
          >
            ✅
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Email Verified Successfully!
          </motion.h1>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300 mb-6 space-y-3"
          >
            {isAuthenticated && user ? (
              <>
                <p>
                  Welcome to Voxly, <span className="font-semibold text-blue-600 dark:text-blue-400">{user.fullName}</span>!
                </p>
                <p className="text-sm">
                  Your email has been verified and you're now logged in. 
                  You'll be redirected to your dashboard in a few seconds.
                </p>
              </>
            ) : (
              <>
                <p>
                  Your email has been verified successfully!
                </p>
                <p className="text-sm">
                  You should now be logged in automatically. If not, please try logging in manually.
                </p>
              </>
            )}
          </motion.div>

          {/* Success Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6 text-left"
          >
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              🎉 You can now:
            </h3>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1 list-disc list-inside">
              <li>Access your personalized dashboard</li>
              <li>Create high-quality voice synthesis</li>
              <li>Clone voices with uploaded samples</li>
              <li>Explore 40+ diverse global voices</li>
            </ul>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <GlowButton
              onClick={handleGoToDashboard}
              className="w-full"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
            </GlowButton>

            {isAuthenticated && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Redirecting automatically in 3 seconds...
              </motion.p>
            )}
          </motion.div>
        </GlassCard>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help getting started?{' '}
            <button
              onClick={() => navigate('/contact')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact support
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationSuccess;
