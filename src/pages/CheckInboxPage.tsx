import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';

const CheckInboxPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  
  const email = searchParams.get('email') || '';
  const source = searchParams.get('source') || 'manual'; // 'manual' or 'google'

  const handleResendVerification = async () => {
    if (!email) return;
    
    setIsResending(true);
    setResendMessage('');
    
    try {
      const response = await fetch('https://auth-service-ancient-frost-8646.fly.dev/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResendMessage('✅ Verification email sent successfully!');
      } else {
        setResendMessage(`❌ ${data.error || 'Failed to resend verification email'}`);
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setResendMessage('❌ Network error. Please try again.');
    } finally {
      setIsResending(false);
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
          {/* Email Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl"
          >
            📧
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Check Your Inbox
          </motion.h1>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300 mb-6 space-y-3"
          >
            <p>
              We've sent a verification email to:
            </p>
            <p className="font-semibold text-blue-600 dark:text-blue-400 break-all">
              {email}
            </p>
            <p className="text-sm">
              {source === 'google' 
                ? 'Even though you signed up with Google, we need to verify your email address for security.'
                : 'Please click the verification link in the email to complete your registration.'
              }
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The verification link expires in 24 hours.
            </p>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-left"
          >
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              What to do next:
            </h3>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the "Verify Email Address" button</li>
              <li>You'll be automatically logged in to Voxly</li>
            </ol>
          </motion.div>

          {/* Resend Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <GlowButton
              onClick={handleResendVerification}
              disabled={isResending || !email}
              className="w-full"
              variant="secondary"
            >
              {isResending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                'Resend Verification Email'
              )}
            </GlowButton>

            {resendMessage && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm ${
                  resendMessage.startsWith('✅') 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {resendMessage}
              </motion.p>
            )}
          </motion.div>

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already verified?{' '}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </GlassCard>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Having trouble?{' '}
            <Link
              to="/contact"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact support
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckInboxPage;
