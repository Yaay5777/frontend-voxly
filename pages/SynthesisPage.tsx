import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  Play, 
  Pause, 
  Download, 
  Settings, 
  Volume2, 
  Mic,
  Sliders,
  Save,
  Share2,
  RotateCcw,
  Zap,
  Sparkles,
  Heart,
  Star,
  Clock,
  User,
  Globe,
  Headphones
} from 'lucide-react';

import { Scene3D } from '../src/3d/Scene3D';
import { AudioVisualizer3D } from '../src/3d/AudioVisualizer3D';
import { Avatar3D } from '../src/3d/Avatar3D';
import { toast } from 'react-hot-toast';

interface Voice {
  id: string;
  name: string;
  category: string;
  gender: string;
  accent: string;
  description: string;
  avatar: string;
  color: string;
  tags: string[];
}

interface SynthesisSettings {
  pitch: number;
  speed: number;
  volume: number;
  emotion: string;
  emphasis: number;
  pause: number;
}

const SynthesisPage: React.FC = () => {
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [text, setText] = useState('Welcome to Voxly, the future of voice synthesis!');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<SynthesisSettings>({
    pitch: 1.0,
    speed: 1.0,
    volume: 1.0,
    emotion: 'neutral',
    emphasis: 0.5,
    pause: 0.5
  });

  const voices: Voice[] = [
    {
      id: 'sarah-professional',
      name: 'Sarah',
      category: 'professional',
      gender: 'female',
      accent: 'american',
      description: 'Professional and clear voice perfect for business presentations',
      avatar: '👩‍💼',
      color: '#3b82f6',
      tags: ['professional', 'clear', 'business']
    },
    {
      id: 'marcus-casual',
      name: 'Marcus',
      category: 'casual',
      gender: 'male',
      accent: 'american',
      description: 'Friendly and approachable voice for everyday content',
      avatar: '👨‍💻',
      color: '#10b981',
      tags: ['friendly', 'casual', 'warm']
    },
    {
      id: 'emma-energetic',
      name: 'Emma',
      category: 'energetic',
      gender: 'female',
      accent: 'british',
      description: 'Vibrant and enthusiastic voice for dynamic content',
      avatar: '🎭',
      color: '#f59e0b',
      tags: ['energetic', 'vibrant', 'dynamic']
    }
  ];

  const emotions = ['neutral', 'happy', 'sad', 'excited', 'calm', 'dramatic'];
  const presets = [
    { name: 'Podcast', settings: { pitch: 0.9, speed: 0.95, emotion: 'friendly' } },
    { name: 'Audiobook', settings: { pitch: 1.0, speed: 0.85, emotion: 'calm' } },
    { name: 'Commercial', settings: { pitch: 1.1, speed: 1.1, emotion: 'excited' } },
    { name: 'News', settings: { pitch: 1.0, speed: 1.0, emotion: 'neutral' } }
  ];

  useEffect(() => {
    if (voices.length > 0) {
      setSelectedVoice(voices[0]);
    }
  }, []);

  const handleSynthesize = async () => {
    if (!selectedVoice || !text.trim()) {
      toast.error('Please select a voice and enter text');
      return;
    }

    setIsSynthesizing(true);
    try {
      // Mock API call - in real app, this would call the TTS service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock audio URL
      setAudioUrl('mock-audio-url');
      toast.success('Voice synthesis completed!');
    } catch (error) {
      console.error('Synthesis failed:', error);
      toast.error('Synthesis failed. Please try again.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handlePlay = () => {
    if (audioUrl) {
      setIsPlaying(!isPlaying);
      toast.success(isPlaying ? 'Paused' : 'Playing');
    } else {
      toast.error('Please synthesize audio first');
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      toast.success('Download started');
    } else {
      toast.error('No audio to download');
    }
  };

  const applyPreset = (preset: any) => {
    setSettings(prev => ({ ...prev, ...preset.settings }));
    toast.success(`Applied ${preset.name} preset`);
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
          <Scene3D environment="studio" performance="high">
            <AudioVisualizer3D
              isPlaying={isPlaying}
              type="waveform"
              color={selectedVoice?.color || "#3b82f6"}
              intensity={0.9}
              size={2}
            />
            
            {selectedVoice && (
              <Avatar3D
                voice={selectedVoice}
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
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Voice Synthesis
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Create lifelike AI voices with our revolutionary 3D synthesis interface
            </p>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Voice Selection */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <User className="w-6 h-6" />
                  <span>Select Voice</span>
                </h2>

                <div className="space-y-4">
                  {voices.map((voice) => (
                    <motion.button
                      key={voice.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedVoice(voice)}
                      className={`w-full p-4 rounded-xl border transition-all text-left ${
                        selectedVoice?.id === voice.id
                          ? 'border-white/40 shadow-lg'
                          : 'border-white/20 hover:border-white/30'
                      }`}
                      style={{
                        backgroundColor: selectedVoice?.id === voice.id 
                          ? `${voice.color}20` 
                          : 'rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{voice.avatar}</span>
                        <div className="flex-1">
                          <div className="text-white font-semibold">{voice.name}</div>
                          <div className="text-sm text-gray-400 capitalize">
                            {voice.gender} • {voice.accent}
                          </div>
                        </div>
                        {selectedVoice?.id === voice.id && (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: voice.color }} />
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mt-2">{voice.description}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Voice Settings */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Sliders className="w-5 h-5" />
                  <span>Voice Settings</span>
                </h3>

                <div className="space-y-6">
                  {/* Pitch */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Pitch: {settings.pitch.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.pitch}
                      onChange={(e) => setSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                      className="w-full"
                      style={{ accentColor: selectedVoice?.color }}
                    />
                  </div>

                  {/* Speed */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Speed: {settings.speed.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.speed}
                      onChange={(e) => setSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                      className="w-full"
                      style={{ accentColor: selectedVoice?.color }}
                    />
                  </div>

                  {/* Emotion */}
                  <div>
                    <label className="block text-white font-medium mb-2">Emotion</label>
                    <select
                      value={settings.emotion}
                      onChange={(e) => setSettings(prev => ({ ...prev, emotion: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                    >
                      {emotions.map((emotion) => (
                        <option key={emotion} value={emotion} className="bg-gray-800">
                          {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Presets */}
                  <div>
                    <label className="block text-white font-medium mb-3">Quick Presets</label>
                    <div className="grid grid-cols-2 gap-2">
                      {presets.map((preset) => (
                        <motion.button
                          key={preset.name}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => applyPreset(preset)}
                          className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium border border-white/20 transition-all"
                        >
                          {preset.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Text Input and Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Text Input */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Mic className="w-6 h-6" />
                  <span>Text to Synthesize</span>
                </h2>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the text you want to convert to speech..."
                  className="w-full h-40 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-400">
                    {text.length} characters • ~{Math.ceil(text.length / 10)} seconds
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setText('')}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium border border-white/20 transition-all flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Clear</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Synthesis Controls */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Volume2 className="w-5 h-5" />
                    <span>Audio Controls</span>
                  </h3>
                  
                  {audioUrl && (
                    <div className="flex items-center space-x-2 text-green-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">Ready to play</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Synthesize Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSynthesize}
                    disabled={isSynthesizing || !selectedVoice || !text.trim()}
                    className={`col-span-1 md:col-span-2 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                      isSynthesizing || !selectedVoice || !text.trim()
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    }`}
                  >
                    {isSynthesizing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Generate Voice</span>
                      </>
                    )}
                  </motion.button>

                  {/* Play/Pause Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlay}
                    disabled={!audioUrl}
                    className={`py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                      !audioUrl
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : isPlaying
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </motion.button>
                </div>

                {/* Additional Controls */}
                {audioUrl && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t border-white/10"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownload}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium border border-white/20 transition-all flex items-center justify-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium border border-white/20 transition-all flex items-center justify-center space-x-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium border border-white/20 transition-all flex items-center justify-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Recent Syntheses */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Recent Syntheses</span>
                </h3>

                <div className="space-y-4">
                  {[
                    { text: 'Welcome to our podcast...', voice: 'Sarah', duration: '0:45', date: '2 hours ago' },
                    { text: 'Chapter 1: The Beginning...', voice: 'Marcus', duration: '2:30', date: '1 day ago' },
                    { text: 'Try our new product today...', voice: 'Emma', duration: '0:30', date: '2 days ago' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-black/30 rounded-xl hover:bg-black/40 transition-all cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="text-white font-medium truncate">{item.text}</div>
                        <div className="text-sm text-gray-400">{item.voice} • {item.duration} • {item.date}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 transition-all"
                        >
                          <Play className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
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

export default SynthesisPage;
