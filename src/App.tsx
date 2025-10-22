import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Removed WebGL imports to prevent context overflow

// Store imports
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useAudioStore } from './store/useAudioStore';
import ToastProvider from './components/ui/ToastProvider';

// Performance & Analytics
import { analytics, trackEvent } from './services/analytics';
import { webVitals } from './services/webVitals';
import { voiceCache } from './services/voiceCache';
import { logger } from './utils/logger';

// Component imports
import GlassCard from './components/ui/GlassCard';
import GlowButton from './components/ui/GlowButton';
import AdvancedAudioVisualizer from './components/audio/AdvancedAudioVisualizer';
import AdvancedErrorBoundary from './components/error/AdvancedErrorBoundary';
// Removed Avatar3D import to prevent WebGL context overflow

// Page imports (lazy loaded for performance)
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const VoicesPage = React.lazy(() => import('./pages/VoicesPage'));
const SynthesisPage = React.lazy(() => import('./pages/SynthesisPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const SignUpPage = React.lazy(() => import('./pages/SignUpPage'));
const AuthSuccessPage = React.lazy(() => import('./pages/AuthSuccessPage'));
const EmailVerificationPending = React.lazy(() => import('./pages/EmailVerificationPending'));
const EmailVerificationSuccess = React.lazy(() => import('./pages/EmailVerificationSuccess'));
const VerificationErrorPage = React.lazy(() => import('./pages/VerificationError'));
const CheckInboxPage = React.lazy(() => import('./pages/CheckInboxPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const VoiceCloningPage = React.lazy(() => import('./pages/VoiceCloningPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const CareersPage = React.lazy(() => import('./pages/CareersPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const FeaturesPage = React.lazy(() => import('./pages/FeaturesPage'));
const PricingPage = React.lazy(() => import('./pages/PricingPage'));
const ApiDocsPage = React.lazy(() => import('./pages/ApiDocsPage'));

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/ui/LoadingScreen';
import ParticleBackground from './components/effects/ParticleBackground';
import PerformanceButton from './components/PerformanceButton';

// Hooks
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { useGSAPAnimations } from './hooks/useGSAPAnimations';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, token } = useAuthStore();
  
  // Show loading while authentication is being initialized
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  // Check both isAuthenticated and token to prevent premature redirects
  return (isAuthenticated || token) ? <>{children}</> : <Navigate to="/login" replace />;
};

// Global Audio Player Component
const GlobalAudioPlayer: React.FC = () => {
  const { currentAudio, isPlaying, setPlaying } = useAudioStore();
  const { frequencies, amplitude } = useAudioAnalyzer(currentAudio?.url);

  if (!currentAudio) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 left-4 right-4 z-50"
    >
      <GlassCard className="p-4">
        <div className="flex items-center space-x-4">
          {/* Optimized Audio Visualizer - No WebGL */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-all duration-300 ${
            isPlaying 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse scale-110' 
              : 'bg-gradient-to-br from-gray-400 to-gray-600'
          }`}>
            🎵
          </div>

          {/* Audio Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {currentAudio.filename}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentAudio.voice_id} • {currentAudio.language}
            </p>
          </div>

          {/* Advanced Audio Visualizer */}
          <div className="flex-1 max-w-xs">
            <AdvancedAudioVisualizer
              audioUrl={currentAudio.url}
              isPlaying={isPlaying}
              onPlayPause={() => setPlaying(!isPlaying)}
              compact
              mode="bars"
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Main App Component
const App: React.FC = () => {
  const { isDark, initializeTheme } = useThemeStore();
  const { initializeAuth } = useAuthStore();
  const { currentAudio } = useAudioStore();

  // Initialize GSAP animations
  useGSAPAnimations();

  // Initialize stores on app start
  useEffect(() => {
    const initialize = async () => {
      logger.info('🚀 Initializing Voxly app...');
      
      // Initialize theme (synchronous)
      initializeTheme();
      
      // Initialize analytics & monitoring
      analytics.init();
      webVitals.init();
      voiceCache.init();
      
      // Initialize auth (asynchronous - waits for backend verification)
      await initializeAuth();
      
      // Track initial page view
      trackEvent.pageViewed('App Start', window.location.pathname);
      
      // Check for OAuth success (when redirected back from Google)
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      const message = urlParams.get('message');
      
      if (error) {
        logger.error('❌ OAuth error:', error, message);
        trackEvent.errorOccurred(error, 'OAuth', 'App');
        // Clean up URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      } else if (window.location.pathname === '/dashboard') {
        // User was redirected to dashboard after OAuth success
        logger.info('✅ OAuth success - user redirected to dashboard');
      }
      
      logger.info('✅ Voxly app initialized');
    };
    
    initialize();
  }, [initializeTheme, initializeAuth]);

  const { mode } = useThemeStore();
  
  const getBackgroundClass = () => {
    switch(mode) {
      case 'light':
        return 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';
      case 'dark':
        return 'bg-gradient-to-br from-purple-950 via-violet-950 to-fuchsia-950';
      case 'vibes':
        return 'bg-[#0a0a0a]';
      default:
        return 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';
    }
  };

  return (
    <AdvancedErrorBoundary>
      <ToastProvider />
      <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
        <div className={`min-h-screen transition-all duration-700 ${getBackgroundClass()} relative overflow-hidden`}>
          {/* Vibes mode - CRAZY COLOR BOMB */}
          {mode === 'vibes' && (
            <>
              {/* Animated gradient orbs */}
              <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-500 to-rose-500 rounded-full blur-[120px] opacity-50 animate-blob pointer-events-none" />
              <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full blur-[120px] opacity-50 animate-blob animation-delay-2000 pointer-events-none" />
              <div className="fixed bottom-0 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-[120px] opacity-50 animate-blob animation-delay-4000 pointer-events-none" />
              <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full blur-[100px] opacity-40 animate-blob animation-delay-6000 pointer-events-none" />
              <div className="fixed top-1/2 left-1/4 w-[450px] h-[450px] bg-gradient-to-br from-green-500 to-emerald-500 rounded-full blur-[110px] opacity-40 animate-blob animation-delay-8000 pointer-events-none" />
              
              {/* Floating particles */}
              <div className="fixed inset-0 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full animate-float-random"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${5 + Math.random() * 5}s`
                    }}
                  />
                ))}
              </div>
            </>
          )}
          
          <Router>
          {/* Particle Background */}
          <ParticleBackground />

          {/* Main Content */}
          <div className="relative z-10">
            <Navbar />
            
            <main className="min-h-screen">
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/auth/success" element={<AuthSuccessPage />} />
                  <Route path="/auth/error" element={<VerificationErrorPage />} />
                  <Route path="/auth/verified" element={<EmailVerificationSuccess />} />
                  <Route path="/auth/verify-error" element={<VerificationErrorPage />} />
                  <Route path="/check-inbox" element={<CheckInboxPage />} />
                  <Route path="/verify-email-pending" element={<EmailVerificationPending />} />
                  <Route path="/verification-error" element={<VerificationErrorPage />} />
                  <Route path="/verify-email-success" element={<EmailVerificationSuccess />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/voices" element={<VoicesPage />} />
                  <Route 
                    path="/cloning" 
                    element={<VoiceCloningPage />}
                  />
                  <Route 
                    path="/synthesis" 
                    element={
                      <ProtectedRoute>
                        <SynthesisPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  {/* Footer Pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/docs" element={<ApiDocsPage />} />
                  <Route path="/help" element={<ContactPage />} />
                  <Route path="/community" element={<AboutPage />} />
                  <Route path="/status" element={<AboutPage />} />
                  <Route path="/privacy" element={<AboutPage />} />
                  <Route path="/terms" element={<AboutPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />

            {/* Global Audio Player */}
            <AnimatePresence>
              {currentAudio && <GlobalAudioPlayer />}
            </AnimatePresence>
            
            {/* Performance Dashboard (Dev Only) */}
            <PerformanceButton />
          </div>

          {/* Development Tools removed to prevent WebGL context overflow */}
          </Router>
        </div>
      </div>
    </AdvancedErrorBoundary>
  );
};

export default App;
