import React, { Suspense, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  Square,
  Star,
  Shield,
  Headphones,
  Wand2,
  Rocket,
  Heart,
  Award,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

import { Scene3D } from '../src/3d/Scene3D';
import { AudioVisualizer3D } from '../src/3d/AudioVisualizer3D';
import { Avatar3D } from '../src/3d/Avatar3D';
import { useScene3DStore, useAudio3DStore } from '../src/hooks/use3D';
import { ttsService } from '../src/services/api';
import { toast } from 'react-hot-toast';

const HomePage: React.FC = () => {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [demoText, setDemoText] = useState("Welcome to Voxly, where your words come alive with revolutionary AI-powered voice synthesis in stunning 3D environments.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [demoAudio, setDemoAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlayingDemo] = useState(false);
  const [selectedDemoVoice, setSelectedDemoVoice] = useState('emma_american_female');
  const [currentSection, setCurrentSection] = useState(0);

  // Demo voices for homepage showcase
  const demoVoices = [
    { id: 'emma_american_female', name: 'Emma', avatar: '👩‍💼', color: '#8b5cf6' },
    { id: 'james_british_male', name: 'James', avatar: '👨‍🎓', color: '#3b82f6' },
    { id: 'sophia_elegant_female', name: 'Sophia', avatar: '👸', color: '#ec4899' },
    { id: 'alex_robotic', name: 'Alex AI', avatar: '🤖', color: '#06b6d4' }
  ];

  const features = [
    {
      icon: Wand2,
      title: "AI Voice Synthesis",
      description: "Transform text into lifelike speech with our advanced AI technology",
      color: "#8b5cf6"
    },
    {
      icon: Globe,
      title: "43+ Voices",
      description: "Choose from our extensive library of international and character voices",
      color: "#10b981"
    },
    {
      icon: Sparkles,
      title: "3D Experience",
      description: "Immerse yourself in our revolutionary 3D voice interface",
      color: "#f59e0b"
    },
    {
      icon: Rocket,
      title: "Real-time Generation",
      description: "Generate high-quality audio in seconds with instant playback",
      color: "#ef4444"
    }
  ];

  const stats = [
    { label: "Voices Available", value: "43+", icon: Mic },
    { label: "Languages Supported", value: "15+", icon: Globe },
    { label: "Happy Users", value: "10K+", icon: Users },
    { label: "Audio Generated", value: "1M+", icon: Volume2 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDemoSynthesis = async () => {
    if (!demoText.trim()) return;
    
    setIsGenerating(true);
    try {
      toast.loading('Generating demo...', { id: 'demo' });
      
      const audioBlob = await ttsService.generateDemo(selectedDemoVoice, demoText);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setDemoAudio(audioUrl);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlayingDemo(true);
      }
      
      toast.success('Demo generated successfully!', { id: 'demo' });
    } catch (error) {
      console.error('Demo synthesis failed:', error);
      toast.error('Failed to generate demo', { id: 'demo' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !demoAudio) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlayingDemo(false);
    } else {
      audioRef.current.play();
      setIsPlayingDemo(true);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <Canvas>
          <Scene3D environment="space" performance="high">
            <AudioVisualizer3D
              isPlaying={isPlaying}
              type="sphere"
              color="#8b5cf6"
              intensity={2}
              size={3}
            />
            
            {/* Floating 3D Elements */}
            <Suspense fallback={null}>
              {demoVoices.map((voice, index) => (
                <Avatar3D
                  key={voice.id}
                  voice={voice}
                  position={[
                    Math.cos((index / demoVoices.length) * Math.PI * 2) * 8,
                    Math.sin(index * 0.5) * 2,
                    Math.sin((index / demoVoices.length) * Math.PI * 2) * 8
                  ]}
                  isActive={selectedDemoVoice === voice.id}
                  isSpeaking={isPlaying && selectedDemoVoice === voice.id}
                  onSelect={() => setSelectedDemoVoice(voice.id)}
                />
              ))}
            </Suspense>
          </Scene3D>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              {/* Main Headline */}
              <motion.h1 
                className="text-6xl md:text-8xl font-bold leading-tight"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Voice Synthesis
                </span>
                <br />
                <span className="text-white">
                  Reimagined in 3D
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Experience the future of AI voice technology with our revolutionary 3D interface. 
                Transform text into lifelike speech with 43+ voices in immersive environments.
              </motion.p>

              {/* Demo Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-4xl mx-auto"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
                  Try It Now - Live Demo
                </h3>

                {/* Voice Selection */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {demoVoices.map((voice) => (
                    <motion.button
                      key={voice.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDemoVoice(voice.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                        selectedDemoVoice === voice.id
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <span className="text-lg">{voice.avatar}</span>
                      <span className="font-medium">{voice.name}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Text Input */}
                <div className="mb-6">
                  <textarea
                    value={demoText}
                    onChange={(e) => setDemoText(e.target.value)}
                    placeholder="Enter text to synthesize..."
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    rows={3}
                  />
                </div>

                {/* Demo Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDemoSynthesis}
                    disabled={isGenerating || !demoText.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        <span>Generate Voice</span>
                      </>
                    )}
                  </motion.button>

                  {demoAudio && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayPause}
                      className="bg-white/10 text-white px-6 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center space-x-2"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/SignUpPage')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-purple-500/25 flex items-center space-x-2"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/VoicesPage')}
                  className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center space-x-2"
                >
                  <Globe className="w-5 h-5" />
                  <span>Explore 3D Voices</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent to-black/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Revolutionary Features
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience voice synthesis like never before with our cutting-edge 3D technology
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all group"
                  >
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: feature.color }} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-3xl p-12 border border-white/20"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Trusted by Creators Worldwide
                </h2>
                <p className="text-xl text-gray-300">
                  Join thousands of users creating amazing content with Voxly
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-gray-300">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <h2 className="text-5xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Ready to Transform Your Content?
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Join the revolution in voice synthesis. Create, share, and experience voices in stunning 3D environments.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/SignUpPage')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-3"
                >
                  <Star className="w-6 h-6" />
                  <span>Start Creating Now</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/FeaturesPage')}
                  className="bg-white/10 text-white px-10 py-5 rounded-xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center space-x-3"
                >
                  <Sparkles className="w-6 h-6" />
                  <span>Learn More</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingDemo(false)}
        onError={() => {
          setIsPlayingDemo(false);
          toast.error('Audio playback failed');
        }}
      />
    </div>
  );
};

// Force server-side rendering to prevent prerendering errors
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default HomePage;
