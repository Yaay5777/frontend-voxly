import React, { Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { CheckCircle, Sparkles, Zap, Shield, ArrowRight, Home, User } from 'lucide-react';
import { Scene3D } from '../3d/Scene3D';
import { AudioVisualizer3D } from '../3d/AudioVisualizer3D';
import { toast } from 'react-hot-toast';

const AuthSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message, type, redirectTo } = location.state || {};

  useEffect(() => {
    // Show success toast
    if (message) {
      toast.success(message);
    }

    // Auto-redirect after 5 seconds if redirectTo is specified
    if (redirectTo) {
      const timer = setTimeout(() => {
        navigate(redirectTo);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, redirectTo, navigate]);

  const getSuccessContent = () => {
    switch (type) {
      case 'signup':
        return {
          title: 'Welcome to Voxly!',
          subtitle: 'Your account has been created successfully',
          description: 'You can now access all of our revolutionary voice AI features.',
          actions: [
            { label: 'Go to Dashboard', path: '/dashboard', primary: true },
            { label: 'Explore Voices', path: '/voices', primary: false }
          ]
        };
      case 'login':
        return {
          title: 'Welcome Back!',
          subtitle: 'You have successfully signed in',
          description: 'Continue your journey with cutting-edge voice synthesis.',
          actions: [
            { label: 'Go to Dashboard', path: '/dashboard', primary: true },
            { label: 'Start Synthesis', path: '/synthesis', primary: false }
          ]
        };
      case 'verification':
        return {
          title: 'Email Verified!',
          subtitle: 'Your email has been successfully verified',
          description: 'Your account is now fully activated and ready to use.',
          actions: [
            { label: 'Sign In Now', path: '/login', primary: true },
            { label: 'Learn More', path: '/features', primary: false }
          ]
        };
      case 'password-reset':
        return {
          title: 'Password Updated!',
          subtitle: 'Your password has been successfully reset',
          description: 'You can now sign in with your new password.',
          actions: [
            { label: 'Sign In Now', path: '/login', primary: true },
            { label: 'Back to Home', path: '/', primary: false }
          ]
        };
      default:
        return {
          title: 'Success!',
          subtitle: 'Operation completed successfully',
          description: message || 'Your request has been processed.',
          actions: [
            { label: 'Go to Dashboard', path: '/dashboard', primary: true },
            { label: 'Back to Home', path: '/', primary: false }
          ]
        };
    }
  };

  const content = getSuccessContent();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <Scene3D environment="space" performance="high">
          <AudioVisualizer3D
            isPlaying={false}
            type="particles"
            color="#10b981"
            intensity={0.9}
            size={1.6}
          />
        </Scene3D>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Enhanced Celebration */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-green-900/50 to-teal-900/50 backdrop-blur-sm"></div>
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
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl mx-auto mb-6 flex items-center justify-center"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                Congratulations!
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                You're now part of the voice AI revolution
              </p>
              
              <div className="space-y-6 text-left max-w-md">
                {[
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Account fully activated", color: "#10b981" },
                  { icon: <Zap className="w-5 h-5" />, text: "43+ voices available", color: "#059669" },
                  { icon: <Shield className="w-5 h-5" />, text: "Secure & private", color: "#047857" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <div style={{ color: feature.color }}>
                        {feature.icon}
                      </div>
                    </motion.div>
                    <span className="text-gray-300 font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Celebration Particles */}
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -40, 0],
                rotate: [0, 360],
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 3 + i * 0.2, 
                repeat: Infinity, 
                delay: i * 0.1,
                ease: "easeInOut"
              }}
              className={`absolute w-${2 + (i % 4)} h-${2 + (i % 4)} bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-full`}
              style={{
                top: `${10 + (i * 7)}%`,
                right: `${5 + (i % 3) * 15}%`,
                left: i % 2 === 0 ? `${5 + (i % 4) * 10}%` : undefined
              }}
            />
          ))}
        </div>

        {/* Right Side - Success Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          {/* Glassmorphism Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl w-full max-w-md"
          >
            <div className="text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className="relative mb-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                {/* Floating sparkles around the icon */}
                {Array.from({ length: 6 }, (_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                    className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                    style={{
                      top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 30}px`,
                      left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 30}px`,
                    }}
                  />
                ))}
              </motion.div>
              
              {/* Success Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-white mb-2">{content.title}</h2>
                <p className="text-lg text-emerald-300 mb-4">{content.subtitle}</p>
                <p className="text-gray-300 mb-8">{content.description}</p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-4"
              >
                {content.actions.map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={action.path}
                      className={`block w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                        action.primary
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-lg'
                          : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        {action.primary ? (
                          <ArrowRight className="w-5 h-5" />
                        ) : action.path === '/' ? (
                          <Home className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                        <span>{action.label}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Auto-redirect notice */}
              {redirectTo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mt-6 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl"
                >
                  <p className="text-emerald-300 text-sm">
                    Automatically redirecting in 5 seconds...
                  </p>
                </motion.div>
              )}

              {/* Help Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-6 text-center text-sm text-gray-400"
              >
                Need help getting started?{' '}
                <Link to="/features" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                  View Features
                </Link>
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessPage;
