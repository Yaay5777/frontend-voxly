import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  Mic, 
  Volume2, 
  Zap, 
  Globe, 
  Shield, 
  Cpu, 
  Palette, 
  Users,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Sparkles,
  Brain,
  Headphones,
  Radio
} from 'lucide-react';

import { Scene3D } from '../src/3d/Scene3D';
import { AudioVisualizer3D } from '../src/3d/AudioVisualizer3D';
import { Avatar3D } from '../src/3d/Avatar3D';
import { toast } from 'react-hot-toast';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  demo?: {
    type: 'audio' | 'visual' | 'interactive';
    content: any;
  };
  stats?: {
    label: string;
    value: string;
  }[];
}

const FeaturesPage: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>('voice-synthesis');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<string | null>(null);

  const features: Feature[] = [
    {
      id: 'voice-synthesis',
      title: '3D Voice Synthesis',
      description: 'Revolutionary 3D interface for creating lifelike AI voices with spatial audio and immersive visualization.',
      icon: <Mic className="w-8 h-8" />,
      color: '#3b82f6',
      gradient: 'from-blue-600 to-cyan-600',
      demo: {
        type: 'audio',
        content: { visualizer: 'sphere', environment: 'space' }
      },
      stats: [
        { label: 'Voice Models', value: '43+' },
        { label: 'Languages', value: '25+' },
        { label: 'Quality', value: '99.9%' }
      ]
    },
    {
      id: 'real-time-processing',
      title: 'Real-Time Processing',
      description: 'Lightning-fast voice generation with sub-second latency and real-time audio streaming.',
      icon: <Zap className="w-8 h-8" />,
      color: '#f59e0b',
      gradient: 'from-yellow-600 to-orange-600',
      demo: {
        type: 'visual',
        content: { visualizer: 'waveform', speed: 'fast' }
      },
      stats: [
        { label: 'Latency', value: '<500ms' },
        { label: 'Throughput', value: '1000+/min' },
        { label: 'Uptime', value: '99.99%' }
      ]
    },
    {
      id: 'multi-language',
      title: 'Multi-Language Support',
      description: 'Support for 25+ languages with native pronunciation and cultural nuances.',
      icon: <Globe className="w-8 h-8" />,
      color: '#10b981',
      gradient: 'from-green-600 to-emerald-600',
      demo: {
        type: 'interactive',
        content: { languages: ['en', 'es', 'fr', 'de', 'ja', 'zh'] }
      },
      stats: [
        { label: 'Languages', value: '25+' },
        { label: 'Accents', value: '100+' },
        { label: 'Accuracy', value: '98.5%' }
      ]
    },
    {
      id: 'ai-powered',
      title: 'AI-Powered Intelligence',
      description: 'Advanced neural networks and machine learning for natural, expressive voice generation.',
      icon: <Brain className="w-8 h-8" />,
      color: '#8b5cf6',
      gradient: 'from-purple-600 to-indigo-600',
      demo: {
        type: 'visual',
        content: { visualizer: 'particles', intelligence: true }
      },
      stats: [
        { label: 'Neural Models', value: '12+' },
        { label: 'Training Data', value: '1M+ hrs' },
        { label: 'Accuracy', value: '99.2%' }
      ]
    },
    {
      id: 'customization',
      title: 'Voice Customization',
      description: 'Fine-tune pitch, speed, emotion, and style to create unique voice personalities.',
      icon: <Palette className="w-8 h-8" />,
      color: '#ef4444',
      gradient: 'from-red-600 to-pink-600',
      demo: {
        type: 'interactive',
        content: { controls: ['pitch', 'speed', 'emotion', 'style'] }
      },
      stats: [
        { label: 'Parameters', value: '50+' },
        { label: 'Presets', value: '200+' },
        { label: 'Combinations', value: '∞' }
      ]
    },
    {
      id: 'enterprise-security',
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, GDPR compliance, and secure API endpoints for enterprise use.',
      icon: <Shield className="w-8 h-8" />,
      color: '#6b7280',
      gradient: 'from-gray-600 to-slate-600',
      demo: {
        type: 'visual',
        content: { security: true, encryption: 'AES-256' }
      },
      stats: [
        { label: 'Encryption', value: 'AES-256' },
        { label: 'Compliance', value: 'GDPR' },
        { label: 'Uptime SLA', value: '99.9%' }
      ]
    }
  ];

  const selectedFeatureData = features.find(f => f.id === selectedFeature);

  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeature(featureId);
    setCurrentDemo(featureId);
    toast.success(`Exploring ${features.find(f => f.id === featureId)?.title}`);
  };

  const handlePlayDemo = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.success('Demo started!');
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
          <Scene3D 
            environment={selectedFeatureData?.demo?.content?.environment || "cyber"} 
            performance="high"
          >
          <AudioVisualizer3D
            isPlaying={isPlaying}
            type={selectedFeatureData?.demo?.content?.visualizer || "spectrum"}
            color={selectedFeatureData?.color || "#3b82f6"}
            intensity={0.8}
            size={2}
          />
          
          {selectedFeature === 'voice-synthesis' && (
            <Avatar3D
              voice={{
                id: 'demo-avatar',
                name: 'Demo Voice',
                category: 'professional',
                gender: 'female',
                accent: 'american',
                description: 'Professional demo voice',
                avatar: '👩‍💼',
                color: '#3b82f6',
                tags: ['demo', 'professional']
              }}
              position={[0, 0, 0]}
              isActive={true}
              isSpeaking={isPlaying}
            />
          )}
        </Scene3D>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-black/20 backdrop-blur-md border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Revolutionary Features
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the cutting-edge technology powering the future of voice synthesis
            </p>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">Core Features</h2>
              
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl cursor-pointer transition-all backdrop-blur-sm border ${
                    selectedFeature === feature.id
                      ? 'border-white/40 shadow-lg'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  style={{
                    backgroundColor: selectedFeature === feature.id 
                      ? `${feature.color}20` 
                      : 'rgba(255, 255, 255, 0.05)'
                  }}
                  onClick={() => handleFeatureSelect(feature.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${feature.color}30` }}
                    >
                      <div style={{ color: feature.color }}>
                        {feature.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {feature.description}
                      </p>
                    </div>

                    {selectedFeature === feature.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: feature.color }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feature Details */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {selectedFeatureData && (
                  <motion.div
                    key={selectedFeature}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                  >
                    {/* Feature Header */}
                    <div className={`bg-gradient-to-r ${selectedFeatureData.gradient} p-8 rounded-2xl text-white`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="p-4 bg-white/20 rounded-xl">
                            {selectedFeatureData.icon}
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold">{selectedFeatureData.title}</h2>
                            <p className="text-white/80 mt-2">{selectedFeatureData.description}</p>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handlePlayDemo}
                          className="bg-white/20 hover:bg-white/30 p-4 rounded-xl transition-all backdrop-blur-sm"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </motion.button>
                      </div>

                      {/* Stats */}
                      {selectedFeatureData.stats && (
                        <div className="grid grid-cols-3 gap-4">
                          {selectedFeatureData.stats.map((stat, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.6, delay: index * 0.1 }}
                              className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm"
                            >
                              <div className="text-2xl font-bold">{stat.value}</div>
                              <div className="text-sm text-white/70">{stat.label}</div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Interactive Demo Area */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white">Interactive Demo</h3>
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">Live Demo</span>
                        </div>
                      </div>

                      {/* Demo Content Based on Feature */}
                      {selectedFeature === 'voice-synthesis' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-white">Voice Controls</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-300">Pitch</span>
                                  <input 
                                    type="range" 
                                    min="0.5" 
                                    max="2" 
                                    step="0.1" 
                                    className="w-32"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-300">Speed</span>
                                  <input 
                                    type="range" 
                                    min="0.5" 
                                    max="2" 
                                    step="0.1" 
                                    className="w-32"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-300">Emotion</span>
                                  <select className="bg-white/10 text-white rounded px-3 py-1">
                                    <option>Neutral</option>
                                    <option>Happy</option>
                                    <option>Sad</option>
                                    <option>Excited</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-white">Sample Text</h4>
                              <textarea
                                className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 resize-none"
                                placeholder="Enter text to synthesize..."
                                defaultValue="Welcome to Voxly, the future of voice synthesis!"
                              />
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                              >
                                <Volume2 className="w-5 h-5" />
                                <span>Generate Voice</span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedFeature === 'real-time-processing' && (
                        <div className="space-y-6">
                          <div className="bg-black/30 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-white">Processing Metrics</h4>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-400 text-sm">Live</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-400">247ms</div>
                                <div className="text-sm text-gray-400">Latency</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">1,247</div>
                                <div className="text-sm text-gray-400">Requests/min</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">99.98%</div>
                                <div className="text-sm text-gray-400">Uptime</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-400">12</div>
                                <div className="text-sm text-gray-400">Active Models</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedFeature === 'multi-language' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'].map((lang, index) => (
                              <motion.button
                                key={lang}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/10 hover:bg-green-600/20 border border-white/20 hover:border-green-500/50 rounded-xl p-4 text-white transition-all"
                              >
                                <div className="text-lg font-semibold">{lang}</div>
                                <div className="text-sm text-gray-400">Native Support</div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedFeature === 'ai-powered' && (
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-white mb-4">Neural Network Architecture</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center">
                                <Cpu className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                                <div className="text-lg font-bold text-white">Transformer</div>
                                <div className="text-sm text-gray-400">Architecture</div>
                              </div>
                              <div className="text-center">
                                <Brain className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                                <div className="text-lg font-bold text-white">Deep Learning</div>
                                <div className="text-sm text-gray-400">Models</div>
                              </div>
                              <div className="text-center">
                                <Radio className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                <div className="text-lg font-bold text-white">Audio Processing</div>
                                <div className="text-sm text-gray-400">Pipeline</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedFeature === 'customization' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-white">Voice Parameters</h4>
                              {['Pitch', 'Speed', 'Volume', 'Emotion', 'Accent', 'Style'].map((param, index) => (
                                <div key={param} className="flex items-center justify-between">
                                  <span className="text-gray-300">{param}</span>
                                  <input 
                                    type="range" 
                                    className="w-32"
                                    style={{ accentColor: '#ef4444' }}
                                  />
                                </div>
                              ))}
                            </div>
                            
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-white">Presets</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {['Professional', 'Casual', 'Energetic', 'Calm', 'Dramatic', 'Friendly'].map((preset) => (
                                  <button
                                    key={preset}
                                    className="bg-white/10 hover:bg-red-600/20 border border-white/20 hover:border-red-500/50 rounded-lg p-2 text-sm text-white transition-all"
                                  >
                                    {preset}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedFeature === 'enterprise-security' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-900/50 rounded-xl p-6">
                              <h4 className="text-lg font-semibold text-white mb-4">Security Features</h4>
                              <div className="space-y-3">
                                {[
                                  'AES-256 Encryption',
                                  'OAuth 2.0 Authentication',
                                  'API Rate Limiting',
                                  'GDPR Compliance',
                                  'SOC 2 Certified',
                                  'End-to-End Encryption'
                                ].map((feature, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4 text-green-400" />
                                    <span className="text-gray-300">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="bg-gray-900/50 rounded-xl p-6">
                              <h4 className="text-lg font-semibold text-white mb-4">Compliance</h4>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-300">GDPR</span>
                                  <span className="text-green-400">✓ Compliant</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-300">CCPA</span>
                                  <span className="text-green-400">✓ Compliant</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-300">SOC 2</span>
                                  <span className="text-green-400">✓ Certified</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-300">ISO 27001</span>
                                  <span className="text-green-400">✓ Certified</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Call to Action */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center"
                    >
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Ready to experience {selectedFeatureData.title}?
                      </h3>
                      <p className="text-gray-300 mb-6">
                        Start building with our powerful API and transform your applications
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2"
                        >
                          <span>Try Free Demo</span>
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold border border-white/20 flex items-center justify-center space-x-2"
                        >
                          <Settings className="w-5 h-5" />
                          <span>View Documentation</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
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

export default FeaturesPage;
