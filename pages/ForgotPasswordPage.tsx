import React, { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Canvas } from '@react-three/fiber';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Sparkles, Shield, Clock } from 'lucide-react';
import { authService } from '../src/services/api';
import { Scene3D } from '../src/3d/Scene3D';
import { AudioVisualizer3D } from '../src/3d/AudioVisualizer3D';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to send reset email. Please try again.';
      setErrors([errorMessage]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <Scene3D environment="space" performance="high">
          <AudioVisualizer3D
            isPlaying={false}
            type="circular"
            color="#10b981"
            intensity={0.6}
            size={1.2}
          />
        </Scene3D>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Enhanced Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-teal-900/50 to-cyan-900/50 backdrop-blur-sm"></div>
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Secure Recovery
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Reset your password safely and securely
              </p>
              
              <div className="space-y-6 text-left max-w-md">
                {[
                  { icon: <Mail className="w-5 h-5" />, text: "Email verification required", color: "#10b981" },
                  { icon: <Shield className="w-5 h-5" />, text: "Secure reset process", color: "#0891b2" },
                  { icon: <Clock className="w-5 h-5" />, text: "Link expires in 1 hour", color: "#0d9488" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <div style={{ color: feature.color }}>
                        {feature.icon}
                      </div>
                    </div>
                    <span className="text-gray-300 font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Enhanced Floating Elements */}
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -25, 0],
                rotate: [0, 90, 180],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 5 + i, 
                repeat: Infinity, 
                delay: i * 0.3,
                ease: "easeInOut"
              }}
              className={`absolute w-${3 + i} h-${3 + i} bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full`}
              style={{
                top: `${15 + i * 8}%`,
                right: `${5 + i * 4}%`,
                left: i % 2 === 0 ? `${5 + i * 2}%` : undefined
              }}
            />
          ))}
        </div>

        {/* Right Side - Password Reset Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          {/* Glassmorphism Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl w-full max-w-md"
          >
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Link
                href="/LoginPage"
                className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Sign In</span>
              </Link>
            </motion.div>

            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    >
                      <Mail className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                    <p className="text-gray-300">Enter your email to receive a reset link</p>
                  </div>

                  {/* Error Messages */}
                  <AnimatePresence>
                    {errors.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start space-x-3 backdrop-blur-sm"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          {errors.map((error, index) => (
                            <p key={index} className="text-red-300 text-sm">{error}</p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reset Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="email"
                          value={email}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                          placeholder="Enter your email address"
                          required
                          disabled={loading}
                        />
                      </div>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading || !email}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-4 rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Sending Reset Link...</span>
                        </div>
                      ) : (
                        'Send Reset Link'
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">Check Your Email</h2>
                  <p className="text-gray-300 mb-6">
                    We've sent a password reset link to <strong className="text-white">{email}</strong>
                  </p>
                  
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 mb-6">
                    <p className="text-emerald-300 text-sm">
                      The reset link will expire in 1 hour. Check your spam folder if you don't see the email.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSent(false);
                      setEmail('');
                    }}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 px-4 rounded-xl font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-200 mb-4"
                  >
                    Send Another Email
                  </motion.button>

                  <Link
                    href="/LoginPage"
                    className="block w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 text-center"
                  >
                    Back to Sign In
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Help Text */}
            {!sent && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-6 text-center text-sm text-gray-400"
              >
                Remember your password?{' '}
                <Link href="/LoginPage" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                  Sign in instead
                </Link>
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Force server-side rendering to prevent prerendering errors
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default ForgotPasswordPage;
