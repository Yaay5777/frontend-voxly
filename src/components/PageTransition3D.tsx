import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';

interface PageTransition3DProps {
  children: React.ReactNode;
  transitionType?: 'slide' | 'fade' | 'scale' | 'rotate' | 'wipe';
  duration?: number;
  showLoader?: boolean;
}

const PageTransition3D: React.FC<PageTransition3DProps> = ({
  children,
  transitionType = 'slide',
  duration = 0.6,
  showLoader = true
}) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== currentPath) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setCurrentPath(location.pathname);
        setIsTransitioning(false);
      }, duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, currentPath, duration]);

  const getPageTitle = (path: string): string => {
    const titles: { [key: string]: string } = {
      '/': 'Home',
      '/voices': 'Voice Library',
      '/features': 'Features',
      '/pricing': 'Pricing',
      '/about': 'About Us',
      '/blog': 'Blog',
      '/contact': 'Contact',
      '/dashboard': 'Dashboard',
      '/synthesis': 'Voice Synthesis',
      '/api-docs': 'API Documentation',
      '/careers': 'Careers',
      '/login': 'Sign In',
      '/signup': 'Sign Up',
      '/forgot-password': 'Reset Password',
      '/reset-password': 'New Password',
      '/email-verification': 'Email Verification',
      '/auth-success': 'Success'
    };
    return titles[path] || 'Voxly';
  };

  const getTransitionVariants = () => {
    switch (transitionType) {
      case 'slide':
        return {
          initial: { x: '100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-100%', opacity: 0 }
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case 'scale':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 }
        };
      case 'rotate':
        return {
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 }
        };
      case 'wipe':
        return {
          initial: { clipPath: 'circle(0% at 50% 50%)', opacity: 0 },
          animate: { clipPath: 'circle(100% at 50% 50%)', opacity: 1 },
          exit: { clipPath: 'circle(0% at 50% 50%)', opacity: 0 }
        };
      default:
        return {
          initial: { x: '100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-100%', opacity: 0 }
        };
    }
  };

  const variants = getTransitionVariants();

  const TransitionLoader: React.FC = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-2">
            Loading {getPageTitle(location.pathname)}
          </h3>
          <p className="text-gray-400 text-sm">
            Preparing your immersive experience...
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: duration * 0.8, ease: "easeOut" }}
          className="w-48 h-1 bg-gray-800 rounded-full mx-auto mt-6 overflow-hidden"
        >
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        </motion.div>

        {/* Floating Elements */}
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            className={`absolute w-2 h-2 bg-blue-400 rounded-full`}
            style={{
              top: `${45 + i * 5}%`,
              left: `${45 + i * 5}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );

  const PageIndicator: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
    >
      <div className="bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-white font-medium text-sm">
            {getPageTitle(location.pathname)}
          </div>
          <div className="text-gray-400 text-xs">
            {location.pathname}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Transition Loader */}
      <AnimatePresence>
        {isTransitioning && showLoader && <TransitionLoader />}
      </AnimatePresence>

      {/* Page Content with Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPath}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            duration,
            ease: "easeInOut"
          }}
          className="relative"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Page Indicator */}
      <AnimatePresence>
        {isTransitioning && <PageIndicator />}
      </AnimatePresence>

      {/* Transition Effects Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 pointer-events-none"
          >
            {/* Particle Effects */}
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 50,
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  y: -50,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: duration * 2,
                  delay: i * 0.05,
                  ease: "easeOut"
                }}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
              />
            ))}

            {/* Gradient Sweep */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: duration * 1.5, ease: "easeInOut" }}
              className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageTransition3D;
