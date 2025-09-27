import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Canvas } from '@react-three/fiber';
import { Mail, CheckCircle, AlertCircle, RefreshCw, Sparkles, Shield, Clock } from 'lucide-react';
import { authService } from '../src/services/api';
import { Scene3D } from '../src/3d/Scene3D';
import { AudioVisualizer3D } from '../src/3d/AudioVisualizer3D';
import { toast } from 'react-hot-toast';

const EmailVerificationPage: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid verification link');
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        // Get email from URL params or use empty string as fallback
        const { email: emailParam } = router.query;
        const email = Array.isArray(emailParam) ? emailParam[0] : emailParam || '';
        await authService.verifyEmail(Array.isArray(token) ? token[0] : token, email);
        setVerified(true);
        toast.success('Email verified successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/LoginPage');
        }, 3000);
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Email verification failed';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  const handleResendVerification = async () => {
    setResending(true);
    try {
      // Get email from localStorage or prompt user
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const email = user?.email;

      if (!email) {
        toast.error('Please sign up again to receive a new verification email');
        router.push('/SignUpPage');
        return;
      }

      await authService.resendVerification({ email });
      toast.success('Verification email sent!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to resend verification email';
      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <Canvas
          shadows
          dpr={Math.min(window.devicePixelRatio, 2)}
          gl={{ 
            antialias: true,
            powerPreference: 'high-performance',
            alpha: true,
            stencil: false,
            depth: true
          }}
          camera={{
            position: [0, 5, 15],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
        >
          <Scene3D environment="nature" performance="high">
            <AudioVisualizer3D
              isPlaying={false}
              type="sphere"
              color={verified ? "#10b981" : error ? "#ef4444" : "#3b82f6"}
              intensity={0.7}
              size={1.4}
            />
          </Scene3D>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Enhanced Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className={`absolute inset-0 backdrop-blur-sm ${
            verified 
              ? 'bg-gradient-to-br from-emerald-900/50 via-green-900/50 to-teal-900/50'
              : error
              ? 'bg-gradient-to-br from-red-900/50 via-rose-900/50 to-pink-900/50'
              : 'bg-gradient-to-br from-blue-900/50 via-indigo-900/50 to-purple-900/50'
          }`}></div>
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
                <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
                  verified 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                    : error
                    ? 'bg-gradient-to-r from-red-500 to-rose-500'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}>
                  {verified ? (
                    <CheckCircle className="w-10 h-10 text-white" />
                  ) : error ? (
                    <AlertCircle className="w-10 h-10 text-white" />
                  ) : (
                    <Mail className="w-10 h-10 text-white" />
                  )}
                </div>
              </motion.div>
              
              <h1 className={`text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent ${
                verified 
                  ? 'bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400'
                  : error
                  ? 'bg-gradient-to-r from-red-400 via-rose-400 to-pink-400'
                  : 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
              }`}>
                {verified ? 'Verified!' : error ? 'Verification Failed' : 'Verifying...'}
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                {verified 
                  ? 'Your email has been successfully verified'
                  : error
                  ? 'There was an issue verifying your email'
                  : 'Please wait while we verify your email address'
                }
              </p>
              
              <div className="space-y-6 text-left max-w-md">
                {(verified ? [
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Email verified successfully", color: "#10b981" },
                  { icon: <Shield className="w-5 h-5" />, text: "Account fully activated", color: "#059669" },
                  { icon: <Sparkles className="w-5 h-5" />, text: "Ready to use Voxly", color: "#047857" }
                ] : error ? [
                  { icon: <AlertCircle className="w-5 h-5" />, text: "Verification link expired", color: "#ef4444" },
                  { icon: <RefreshCw className="w-5 h-5" />, text: "Request new verification", color: "#dc2626" },
                  { icon: <Mail className="w-5 h-5" />, text: "Check your email inbox", color: "#b91c1c" }
                ] : [
                  { icon: <Mail className="w-5 h-5" />, text: "Processing verification", color: "#3b82f6" },
                  { icon: <Shield className="w-5 h-5" />, text: "Secure verification process", color: "#2563eb" },
                  { icon: <Clock className="w-5 h-5" />, text: "This may take a moment", color: "#1d4ed8" }
                ]).map((feature, index) => (
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
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -25, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4 + i * 0.5, 
                repeat: Infinity, 
                delay: i * 0.3,
                ease: "easeInOut"
              }}
              className={`absolute w-${4 + i} h-${4 + i} rounded-full ${
                verified 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20'
                  : error
                  ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20'
                  : 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20'
              }`}
              style={{
                top: `${20 + i * 10}%`,
                right: `${10 + i * 5}%`,
                left: i % 2 === 0 ? `${10 + i * 3}%` : undefined
              }}
            />
          ))}
        </div>

        {/* Right Side - Verification Status */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          {/* Glassmorphism Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl w-full max-w-md"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                  >
                    <Mail className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">Verifying Email</h2>
                  <p className="text-gray-300 mb-6">
                    Please wait while we verify your email address...
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-indigo-500 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-purple-500 rounded-full"
                    />
                  </div>
                </motion.div>
              ) : verified ? (
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
                    className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">Email Verified!</h2>
                  <p className="text-gray-300 mb-6">
                    Your email has been successfully verified. You can now access all Voxly features.
                  </p>
                  
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 mb-6">
                    <p className="text-emerald-300 text-sm">
                      Redirecting to sign in page in a few seconds...
                    </p>
                  </div>

                  <Link
                    href="/LoginPage"
                    className="block w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-4 rounded-xl font-medium hover:from-emerald-700 hover:to-green-700 transition-all duration-200 text-center"
                  >
                    Sign In Now
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                  >
                    <AlertCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">Verification Failed</h2>
                  <p className="text-gray-300 mb-6">
                    {error || 'The verification link is invalid or has expired.'}
                  </p>
                  
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
                    <p className="text-red-300 text-sm">
                      Don't worry! You can request a new verification email below.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    {resending ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5 inline mr-2" />
                        Resend Verification Email
                      </>
                    )}
                  </motion.button>

                  <Link
                    href="/SignUpPage"
                    className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 px-4 rounded-xl font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-200 text-center"
                  >
                    Sign Up Again
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Help Text */}
            {!loading && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-6 text-center text-sm text-gray-400"
              >
                Need help?{' '}
                <Link href="/ContactPage" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Contact Support
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

export default EmailVerificationPage;
