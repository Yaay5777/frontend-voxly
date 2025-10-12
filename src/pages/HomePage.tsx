import React, { Suspense, useState, useRef } from 'react';
import { motion } from 'framer-motion';
// Removed WebGL imports to prevent context overflow
import { Link } from 'react-router-dom';
import { 
  Play, 
  Mic, 
  Sparkles, 
  Zap, 
  Users, 
  Globe,
  ArrowRight,
  Volume2,
  Download,
  Pause,
  Square
} from 'lucide-react';

// Component imports
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import WaveformVisualizer from '../components/audio/WaveformVisualizer';
import Avatar3D from '../3d/Avatar3D';
import LoadingScreen from '../components/ui/LoadingScreen';
import OptimizedAvatarShowcase from '../components/showcase/OptimizedAvatarShowcase';

// Store imports
import { useAuthStore } from '../store/useAuthStore';
import { useAudioStore } from '../store/useAudioStore';
import { showToast } from '../utils/toast';

// Services
import { synthesizeText, generateVoiceDemo } from '../services/api';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { setCurrentAudio, setPlaying } = useAudioStore();
  
  const [demoText, setDemoText] = useState("Welcome to Voxly, where your words come alive with AI-powered voice synthesis.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [demoAudio, setDemoAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlayingDemo] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Demo voice synthesis
  const handleDemoSynthesis = async () => {
    if (!demoText.trim()) return;
    
    // Check authentication
    if (!isAuthenticated) {
      showToast.warning('Please login to try voice synthesis.');
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }
    
    setIsGenerating(true);
    try {
      // Use the API service which now uses /synthesize endpoint
      // Authentication token is automatically added by interceptor
      const audioBlob = await generateVoiceDemo(demoText, 'emma_american_female', 'en');
      
      const audioUrl = URL.createObjectURL(audioBlob);
      setDemoAudio(audioUrl);
      
      // Auto-play demo
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlayingDemo(true);
      }
    } catch (error: any) {
      console.error('Demo synthesis failed:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Voice synthesis failed. ';
      if (error.response?.status === 401) {
        errorMessage = 'TTS backend authentication issue. Please contact support.';
        // Don't redirect - it's a backend configuration issue
      } else if (error.response?.status === 404) {
        errorMessage += 'TTS service unavailable.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. Please try again.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      showToast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleDemoPlayback = () => {
    if (!audioRef.current || !demoAudio) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlayingDemo(false);
    } else {
      audioRef.current.play();
      setIsPlayingDemo(true);
    }
  };

  const stopDemoPlayback = () => {
    if (!audioRef.current || !demoAudio) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlayingDemo(false);
  };

  const features = [
    {
      icon: Mic,
      title: "Voice Cloning",
      description: "Clone any voice with just a few seconds of audio sample",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Advanced neural networks for natural-sounding speech",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate high-quality audio in seconds, not minutes",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "Multilingual Voices",
      description: "112 authentic voices speak any language while keeping their natural accent",
      color: "from-green-500 to-teal-500"
    }
  ];

  const stats = [
    { label: "Voices Generated", value: "1M+", icon: Volume2 },
    { label: "Happy Users", value: "50K+", icon: Users },
    { label: "Languages", value: "25+", icon: Globe },
    { label: "Audio Hours", value: "100K+", icon: Download }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-voxly-500/10 to-accent-500/10 border border-voxly-500/20 rounded-full px-4 py-2"
                >
                  <Sparkles className="w-4 h-4 text-voxly-500" />
                  <span className="text-sm font-medium text-voxly-600 dark:text-voxly-400">
                    AI-Powered Voice Synthesis
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight"
                >
                  <span className="bg-gradient-to-r from-gray-900 via-voxly-600 to-accent-600 dark:from-white dark:via-voxly-400 dark:to-accent-400 bg-clip-text text-transparent">
                    Transform Text
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-voxly-600 to-accent-600 bg-clip-text text-transparent">
                    Into Voice
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
                >
                  Create lifelike voices, clone existing ones, and bring your content to life with 
                  cutting-edge AI technology. Perfect for creators, developers, and businesses.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <GlowButton size="lg" className="w-full sm:w-auto">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </GlowButton>
                  </Link>
                ) : (
                  <Link to="/register">
                    <GlowButton size="lg" className="w-full sm:w-auto">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </GlowButton>
                  </Link>
                )}
                
                <Link to="/voices">
                  <GlowButton variant="ghost" size="lg" className="w-full sm:w-auto">
                    <Play className="w-5 h-5 mr-2" />
                    Try Demo
                  </GlowButton>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8"
              >
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Icon className="w-5 h-5 text-voxly-500 mr-2" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Clean Synthesis Demo */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <GlassCard className="p-8 h-96 relative overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Try Voice Synthesis
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Globe className="w-4 h-4" />
                      <span>112 Voices Available</span>
                    </div>
                  </div>
                  
                  {/* Clean Synthesis Interface */}
                  <div className="flex-1 flex flex-col space-y-4">
                    <textarea
                      value={demoText}
                      onChange={(e) => setDemoText(e.target.value)}
                      placeholder="Enter text to synthesize with any of our 112 global voices..."
                      className="flex-1 p-4 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-voxly-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      maxLength={500}
                      rows={4}
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {demoText.length}/500 characters
                      </span>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={handleDemoSynthesis}
                          disabled={!demoText.trim() || isGenerating}
                          className="px-6 py-2 bg-voxly-500 text-white rounded-lg hover:bg-voxly-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Mic className="w-4 h-4" />
                              <span>Synthesize Voice</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Clean Audio Player - Single Instance */}
                    {demoAudio && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-voxly-50 to-purple-50 dark:from-gray-800 dark:to-purple-900 rounded-lg border border-voxly-200 dark:border-voxly-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-voxly-500 rounded-full flex items-center justify-center">
                              <Mic className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">Demo Audio Ready</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Emma (American Female)</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={toggleDemoPlayback}
                              className="p-2 bg-voxly-500 text-white rounded-lg hover:bg-voxly-600 transition-colors"
                              title={isPlaying ? 'Pause' : 'Play'}
                            >
                              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            
                            <button
                              onClick={stopDemoPlayback}
                              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                              title="Stop"
                            >
                              <Square className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Hidden Audio Element */}
                        <audio
                          ref={audioRef}
                          src={demoAudio}
                          onEnded={() => setIsPlayingDemo(false)}
                          onPlay={() => setIsPlayingDemo(true)}
                          onPause={() => setIsPlayingDemo(false)}
                          className="hidden"
                        />
                      </div>
                    )}
                    
                    {/* Voice Selection Info */}
                    {!demoAudio && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Demo Voice: <span className="font-semibold text-voxly-600 dark:text-voxly-400">Emma (American Female)</span>
                          </span>
                          <Link to="/voices" className="text-voxly-500 hover:text-voxly-600 font-medium">
                            Browse All 112 Voices →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4D Emoji Avatar Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Global Voice Family
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the diversity of our 112 authentic voices from around the world
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-96 max-w-4xl mx-auto"
          >
            <GlassCard className="h-full relative overflow-hidden">
              {/* 4D Emoji Avatar Experience */}
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900 dark:to-pink-900">
                {/* Background Gradient Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 opacity-30 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-blue-400 via-green-500 to-yellow-500 opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                {/* Central Avatar Showcase */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="relative z-10"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <div className="text-8xl animate-bounce drop-shadow-lg">
                      🌍
                    </div>
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-800 dark:text-white bg-white/80 dark:bg-black/80 px-3 py-1 rounded-full">
                      112 Global Voices
                    </div>
                  </motion.div>
                  
                  {/* Orbiting Emoji Avatars */}
                  {[
                    { emoji: '👩🏻‍💼', name: 'Emma', angle: 0, color: 'from-blue-400 to-blue-600', country: '🇺🇸' },
                    { emoji: '👨🏽‍🎓', name: 'Arjun', angle: 45, color: 'from-orange-400 to-orange-600', country: '🇮🇳' },
                    { emoji: '👩🏻‍🎨', name: 'Marie', angle: 90, color: 'from-pink-400 to-pink-600', country: '🇫🇷' },
                    { emoji: '👨🏻‍💻', name: 'Kenji', angle: 135, color: 'from-green-400 to-green-600', country: '🇯🇵' },
                    { emoji: '👩🏽‍🚀', name: 'Sofia', angle: 180, color: 'from-purple-400 to-purple-600', country: '🇪🇸' },
                    { emoji: '👨🏽‍🎤', name: 'Ahmed', angle: 225, color: 'from-yellow-400 to-yellow-600', country: '🇦🇪' },
                    { emoji: '👩🏻‍🎭', name: 'Olivia', angle: 270, color: 'from-teal-400 to-teal-600', country: '🇬🇧' },
                    { emoji: '👨🏿‍🎨', name: 'Thabo', angle: 315, color: 'from-red-400 to-red-600', country: '🇿🇦' },
                  ].map((avatar, i) => (
                    <motion.div
                      key={avatar.name}
                      className="absolute z-20"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) rotate(${avatar.angle}deg) translateY(-120px) rotate(-${avatar.angle}deg)`,
                      }}
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 12 + i * 0.5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.3,
                      }}
                    >
                      <div className={`relative p-3 rounded-full bg-gradient-to-br ${avatar.color} shadow-xl backdrop-blur-sm border-2 border-white/30`}>
                        <div className="text-2xl filter drop-shadow-lg">{avatar.emoji}</div>
                        <div className="absolute -top-2 -right-2 text-lg">{avatar.country}</div>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-800 dark:text-white bg-white/90 dark:bg-black/80 px-2 py-1 rounded-full whitespace-nowrap shadow-lg">
                          {avatar.name}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Floating Sparkles */}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-yellow-300"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        fontSize: `${0.8 + Math.random() * 0.4}rem`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 4,
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Voice Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
          >
            {[
              { number: '112', label: 'Unique Voices', icon: '🎤' },
              { number: '22', label: 'Languages', icon: '🌍' },
              { number: '30+', label: 'Countries', icon: '🗺️' },
              { number: '100%', label: 'Authentic', icon: '✨' },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.number}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-voxly-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-voxly-600 dark:from-white dark:to-voxly-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to create, customize, and deploy AI-generated voices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassCard className="p-6 h-full text-center group hover:scale-105 transition-transform duration-300">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Animated Avatar Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-voxly-50 to-accent-50 dark:from-voxly-950 dark:to-accent-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-voxly-600 dark:from-white dark:to-voxly-400 bg-clip-text text-transparent">
                Meet Our Global Voices
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience authentic voices from around the world. Each voice is crafted with AI precision 
              to capture the unique accents, tones, and cultural nuances of different regions.
            </p>
          </motion.div>

          {/* Animated Avatar Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <OptimizedAvatarShowcase />
          </motion.div>

          {/* Voice Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <GlassCard className="p-6">
              <div className="text-3xl font-bold text-voxly-600 dark:text-voxly-400 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-300">Different Countries</div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="text-3xl font-bold text-voxly-600 dark:text-voxly-400 mb-2">25+</div>
              <div className="text-gray-600 dark:text-gray-300">Unique Accents</div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="text-3xl font-bold text-voxly-600 dark:text-voxly-400 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-300">Authentic Sound</div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              <span className="bg-gradient-to-r from-voxly-600 to-accent-600 bg-clip-text text-transparent">
                Ready to Transform Your Content?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of creators using Voxly to bring their ideas to life with AI-powered voices.
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <GlowButton size="lg" className="w-full sm:w-auto">
                    Start Creating Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GlowButton>
                </Link>
                <Link to="/voices">
                  <GlowButton variant="ghost" size="lg" className="w-full sm:w-auto">
                    Explore Voices
                  </GlowButton>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
