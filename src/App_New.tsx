import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';

// Store imports
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useAudioStore } from './store/useAudioStore';

// Component imports
import GlassCard from './components/ui/GlassCard';
import GlowButton from './components/ui/GlowButton';
import WaveformVisualizer from './components/audio/WaveformVisualizer';
import Avatar3D from './3d/Avatar3D';

// Page imports (lazy loaded for performance)
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const VoicesPage = React.lazy(() => import('./pages/VoicesPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/ui/LoadingScreen';
import ParticleBackground from './components/effects/ParticleBackground';

// Hooks
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { useGSAPAnimations } from './hooks/useGSAPAnimations';

const App: React.FC = () => {
  const { isAuthenticated, user, token } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { currentAudio, isPlaying, audioData } = useAudioStore();

  // Initialize GSAP animations
  useGSAPAnimations();

  // Initialize audio analyzer
  const { frequencies, amplitude } = useAudioAnalyzer(currentAudio?.url, isPlaying);

  // Update audio data in store
  useEffect(() => {
    if (frequencies.length > 0) {
      useAudioStore.getState().setAudioData(frequencies);
    }
  }, [frequencies]);

  // Protected route wrapper
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  // Loading screen component
  const AppLoadingScreen = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-voxly-900 via-accent-900 to-voxly-800 flex items-center justify-center z-50">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 mx-auto mb-4">
          <Canvas>
            <Suspense fallback={null}>
              <Avatar3D
                config={{
                  geometry: 'sphere',
                  material: 'glass',
                  animation: 'pulse',
                  particles: true,
                  color: '#3b82f6',
                  intensity: 1,
                }}
                scale={1}
                isPlaying={true}
              />
            </Suspense>
          </Canvas>
        </div>
        <motion.h2
          className="text-2xl font-display font-bold text-white mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Voxly
        </motion.h2>
        <p className="text-white/70">Loading your voice experience...</p>
      </motion.div>
    </div>
  );

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-500 ${
        isDark ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }`}>
        {/* Particle Background */}
        <ParticleBackground />

        {/* Main App Structure */}
        <div className="relative z-10">
          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main className="min-h-screen">
            <AnimatePresence mode="wait">
              <Suspense fallback={<AppLoadingScreen />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/voices" element={<VoicesPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </main>

          {/* Global Audio Player */}
          {currentAudio && (
            <motion.div
              className="fixed bottom-6 right-6 z-40"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
            >
              <GlassCard className="w-80" variant="dark">
                <WaveformVisualizer
                  audioUrl={currentAudio.url}
                  isPlaying={isPlaying}
                  variant="compact"
                  realTime={true}
                  audioData={audioData}
                />
              </GlassCard>
            </motion.div>
          )}

          {/* Footer */}
          <Footer />
        </div>

        {/* Development Tools (only in dev mode) */}
        {process.env.NODE_ENV === 'development' && <Leva collapsed />}
      </div>
    </Router>
  );
};

export default App;
