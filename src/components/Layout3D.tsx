import React, { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Loader2, Wifi, WifiOff, Volume2, VolumeX } from 'lucide-react';
import Navigation3D from './Navigation3D';
import { Scene3D } from '../3d/Scene3D';
import { AudioVisualizer3D } from '../3d/AudioVisualizer3D';
import { toast, Toaster } from 'react-hot-toast';

interface Layout3DProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  backgroundEnvironment?: 'space' | 'cyber' | 'studio' | 'nature';
  audioVisualizerType?: 'waveform' | 'spectrum' | 'circular' | 'sphere' | 'particles';
  audioColor?: string;
  className?: string;
}

const Layout3D: React.FC<Layout3DProps> = ({
  children,
  showNavigation = true,
  backgroundEnvironment = 'space',
  audioVisualizerType = 'waveform',
  audioColor = '#3b82f6',
  className = ''
}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [pageTransition, setPageTransition] = useState(false);

  // Handle page transitions
  useEffect(() => {
    setPageTransition(true);
    const timer = setTimeout(() => {
      setPageTransition(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Handle loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Loading Screen Component
  const LoadingScreen: React.FC = () => (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center"
        >
          <Loader2 className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Loading Voxly
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400"
        >
          Preparing your voice AI experience...
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-64 h-1 bg-gray-800 rounded-full mx-auto mt-6 overflow-hidden"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );

  // Status Bar Component
  const StatusBar: React.FC = () => (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-30 bg-black/20 backdrop-blur-sm border-b border-white/10"
    >
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-xs ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Current Page Indicator */}
          <div className="text-xs text-gray-400">
            {location.pathname === '/' ? 'Home' : location.pathname.slice(1).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Audio Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span>{audioEnabled ? 'Audio On' : 'Audio Off'}</span>
          </motion.button>

          {/* Performance Indicator */}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">High Performance</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Page Transition Overlay
  const PageTransition: React.FC = () => (
    <AnimatePresence>
      {pageTransition && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-40 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Error Boundary Fallback
  const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-6">
          We encountered an error while loading this page. Please try refreshing or contact support if the problem persists.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          Refresh Page
        </button>
        <details className="mt-4 text-left">
          <summary className="text-sm text-gray-500 cursor-pointer">Error Details</summary>
          <pre className="text-xs text-red-400 mt-2 p-2 bg-red-500/10 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-black relative overflow-hidden ${className}`}>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Status Bar */}
      {!isLoading && <StatusBar />}

      {/* 3D Background Scene */}
      {!isLoading && (
        <div className="fixed inset-0 z-0">
          <Suspense fallback={<div className="bg-black w-full h-full" />}>
            <Scene3D environment={backgroundEnvironment} performance="high">
              {audioEnabled && (
                <AudioVisualizer3D
                  isPlaying={false}
                  type={audioVisualizerType}
                  color={audioColor}
                  intensity={0.6}
                  size={1.2}
                />
              )}
            </Scene3D>
          </Suspense>
        </div>
      )}

      {/* Navigation */}
      {!isLoading && showNavigation && <Navigation3D />}

      {/* Main Content */}
      {!isLoading && (
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`relative z-10 ${showNavigation ? 'lg:ml-80' : ''} pt-12`}
        >
          <div className="min-h-screen">
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                  />
                </div>
              }
            >
              <React.ErrorBoundary
                fallback={ErrorFallback}
                onError={(error) => {
                  console.error('Layout3D Error:', error);
                  toast.error('An error occurred while rendering the page');
                }}
              >
                {children}
              </React.ErrorBoundary>
            </Suspense>
          </div>
        </motion.main>
      )}

      {/* Page Transition Overlay */}
      <PageTransition />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />

      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white py-2 px-4 rounded-lg"
      >
        Skip to main content
      </a>

      {/* Performance Monitor (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-2 text-xs text-gray-400">
          <div>FPS: {Math.round(performance.now() / 1000)}</div>
          <div>Memory: {(performance as any).memory?.usedJSHeapSize ? 
            Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) + 'MB' : 'N/A'}</div>
        </div>
      )}
    </div>
  );
};

export default Layout3D;
