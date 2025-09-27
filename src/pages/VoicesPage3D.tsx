import React, { Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { 
  Play, 
  Pause, 
  Heart, 
  Star, 
  Search,
  Volume2,
  Mic,
  Globe,
  Sparkles,
  Filter,
  Grid,
  List,
  Users,
  Briefcase,
  Coffee,
  BookOpen,
  Gamepad2,
  Settings,
  Maximize,
  Minimize,
  RotateCcw,
  Zap,
  Eye,
  Headphones,
  Layers3,
  Orbit,
  Palette
} from 'lucide-react';
import { Scene3D, SpaceScene3D, CyberScene3D, StudioScene3D, NatureScene3D } from '../3d/Scene3D';
import { AvatarGallery3D } from '../3d/Avatar3D';
import { AudioVisualizer3D, VoiceWaveform3D, AudioReactiveBackground } from '../3d/AudioVisualizer3D';
import { useScene3DStore, useAudio3DStore } from '../hooks/use3D';
import { ttsService } from '../services/api';
import { toast } from 'react-hot-toast';

interface Voice {
  id: string;
  name: string;
  description: string;
  avatar: string;
  color: string;
  tags: string[];
  sample_text: string;
  type: string;
  quality: string;
  languages: string[];
  gender?: string;
  age?: string;
  accent?: string;
  category?: string;
  personality?: string;
  flag?: string;
}

const VoicesPage3D: React.FC = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedAccent, setSelectedAccent] = useState<string>('all');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [generatingDemo, setGeneratingDemo] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | '3d'>('3d');
  const [is3DMode, setIs3DMode] = useState(true);
  const [selectedVisualizerType, setSelectedVisualizerType] = useState<'sphere' | 'waveform' | 'spectrum' | 'circular' | 'particles'>('sphere');
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [scene3DEnvironment, setScene3DEnvironment] = useState<'space' | 'cyber' | 'studio' | 'nature'>('space');

  // Enhanced voice categories with 3D visualization data
  const categories = [
    { id: 'all', name: 'All Voices', icon: Users, description: 'Browse all 43+ available voices', count: 0, color: '#8b5cf6', environment: 'space' as const },
    { id: 'professional', name: 'Professional', icon: Briefcase, description: 'Corporate and business voices', count: 0, color: '#3b82f6', environment: 'studio' as const },
    { id: 'international', name: 'International', icon: Globe, description: 'Multilingual and accented voices', count: 0, color: '#10b981', environment: 'nature' as const },
    { id: 'technical', name: 'AI & Robotic', icon: Settings, description: 'Synthetic and futuristic voices', count: 0, color: '#06b6d4', environment: 'cyber' as const },
    { id: 'celebrity', name: 'Celebrity Style', icon: Star, description: 'Famous narrator and personality styles', count: 0, color: '#f59e0b', environment: 'space' as const },
    { id: 'casual', name: 'Casual & Friendly', icon: Coffee, description: 'Warm and conversational voices', count: 0, color: '#ef4444', environment: 'studio' as const },
    { id: 'storytelling', name: 'Storytelling', icon: BookOpen, description: 'Narrative and dramatic voices', count: 0, color: '#8b5cf6', environment: 'nature' as const },
    { id: 'character', name: 'Character & Fun', icon: Gamepad2, description: 'Animated and entertaining voices', count: 0, color: '#ec4899', environment: 'cyber' as const }
  ];

  // 3D Visualizer types
  const visualizerTypes = [
    { id: 'sphere', name: 'Sphere', icon: Globe, description: 'Audio-reactive sphere' },
    { id: 'waveform', name: 'Waveform', icon: RotateCcw, description: 'Classic waveform display' },
    { id: 'spectrum', name: 'Spectrum', icon: Zap, description: 'Frequency spectrum bars' },
    { id: 'circular', name: 'Circular', icon: Eye, description: 'Circular spectrum analyzer' },
    { id: 'particles', name: 'Particles', icon: Star, description: 'Particle system visualization' }
  ];

  // 3D Environment options
  const environments = [
    { id: 'space', name: 'Space', icon: Orbit, description: 'Cosmic environment with stars and nebula' },
    { id: 'cyber', name: 'Cyber', icon: Layers3, description: 'Futuristic cyberpunk environment' },
    { id: 'studio', name: 'Studio', icon: Palette, description: 'Professional studio lighting' },
    { id: 'nature', name: 'Nature', icon: Globe, description: 'Natural environment with sky and clouds' }
  ];

  useEffect(() => {
    loadVoices();
    loadFavorites();
    checkAuthStatus();
  }, []);

  // Update 3D environment when category changes
  useEffect(() => {
    const category = categories.find(cat => cat.id === selectedCategory);
    if (category && category.environment) {
      setScene3DEnvironment(category.environment);
    }
  }, [selectedCategory]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  };

  const loadVoices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await ttsService.getVoices();
      const speakersArray = data.speakers || data || [];
      
      const voicesData = speakersArray.map((speaker: any, index: number) => ({
        id: speaker.id || `voice-${index}`,
        name: speaker.name || `Voice ${index + 1}`,
        description: speaker.description || 'AI-generated voice',
        avatar: speaker.avatar || 'sphere',
        color: speaker.color || '#3b82f6',
        tags: speaker.tags || ['ai', 'synthetic'],
        sample_text: speaker.sample_text || 'Hello, this is a sample of my voice.',
        type: speaker.type || 'preset',
        quality: speaker.quality || 'high',
        languages: speaker.languages || ['en'],
        gender: speaker.gender,
        age: speaker.age,
        accent: speaker.accent,
        category: speaker.category || 'general',
        personality: speaker.personality || 'neutral',
        flag: speaker.flag || '🎭',
      }));
      
      setVoices(voicesData);
      toast.success(`Loaded ${voicesData.length} voices successfully!`);
    } catch (error) {
      console.error('Failed to load voices:', error);
      setError('Unable to connect to voice service. Please check your connection and try again.');
      toast.error('Failed to load voices');
      setVoices([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('voxly_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (voiceId: string) => {
    const newFavorites = favorites.includes(voiceId)
      ? favorites.filter(id => id !== voiceId)
      : [...favorites, voiceId];
    
    setFavorites(newFavorites);
    localStorage.setItem('voxly_favorites', JSON.stringify(newFavorites));
    toast.success(favorites.includes(voiceId) ? 'Removed from favorites' : 'Added to favorites');
  };

  const generateVoiceDemo = async (voice: Voice) => {
    setGeneratingDemo(voice.id);
    try {
      toast.loading('Generating voice demo...', { id: 'demo' });
      
      const audioBlob = await ttsService.generateDemo(
        voice.id,
        voice.sample_text || "Hello, this is a sample of my voice."
      );
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.addEventListener('loadeddata', () => {
        setPlayingVoice(voice.id);
        setAudioElement(audio);
        toast.success('Demo generated successfully!', { id: 'demo' });
      });
      
      audio.addEventListener('ended', () => {
        setPlayingVoice(null);
        setAudioElement(null);
      });
      
      audio.addEventListener('error', (error) => {
        console.error('Audio playback failed:', error);
        setPlayingVoice(null);
        setAudioElement(null);
        toast.error('Audio playback failed', { id: 'demo' });
      });
      
      await audio.play();
      
    } catch (error) {
      console.error('Failed to generate demo:', error);
      toast.error('Failed to generate demo', { id: 'demo' });
    } finally {
      setGeneratingDemo(null);
    }
  };

  const filteredVoices = voices.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         voice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         voice.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           selectedCategory === 'favorites' && favorites.includes(voice.id) ||
                           voice.category === selectedCategory;
    
    const matchesGender = selectedGender === 'all' || voice.gender === selectedGender;
    const matchesAccent = selectedAccent === 'all' || voice.accent === selectedAccent;
    
    return matchesSearch && matchesCategory && matchesGender && matchesAccent;
  });

  const handleVoiceSelect = (voice: Voice) => {
    generateVoiceDemo(voice);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl">Loading 3D Voice Gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-semibold mb-2">Connection Error</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={loadVoices}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background Scene */}
      {is3DMode && (
        <div className="fixed inset-0 z-0">
          <Scene3D environment={scene3DEnvironment} performance="high">
            <AudioReactiveBackground 
              audioElement={audioElement || undefined}
              colors={[categories.find(cat => cat.id === selectedCategory)?.color || '#8b5cf6']}
            />
            
            {/* Main Audio Visualizer */}
            <AudioVisualizer3D
              audioElement={audioElement || undefined}
              isPlaying={!!playingVoice}
              type={selectedVisualizerType}
              color={categories.find(cat => cat.id === selectedCategory)?.color || '#8b5cf6'}
              intensity={1.5}
              size={2}
            />
            
            {/* 3D Avatar Gallery */}
            {viewMode === '3d' && (
              <AvatarGallery3D
                voices={filteredVoices}
                onVoiceSelect={handleVoiceSelect}
              />
            )}
          </Scene3D>
        </div>
      )}

      {/* UI Overlay */}
      <div className="relative z-10 min-h-screen">
        {/* Header with 3D Controls */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-black/20 backdrop-blur-md border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                3D Voice Galaxy
              </h1>
              <p className="text-gray-300 mt-1">Experience voices in immersive 3D space</p>
            </div>

            {/* 3D Controls */}
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-white/10 rounded-lg p-1">
                {[
                  { mode: '3d', icon: Layers3, label: '3D' },
                  { mode: 'grid', icon: Grid, label: 'Grid' },
                  { mode: 'list', icon: List, label: 'List' }
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as any)}
                    className={`px-3 py-2 rounded-md transition-all ${
                      viewMode === mode
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* Immersive Mode Toggle */}
              <button
                onClick={() => setIsImmersiveMode(!isImmersiveMode)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  isImmersiveMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {isImmersiveMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.header>

        {/* Advanced Control Panel */}
        {!isImmersiveMode && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-black/20 backdrop-blur-md border-b border-white/10"
          >
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search voices in 3D space..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                  />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = selectedCategory === category.id;
                    
                    return (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all backdrop-blur-sm ${
                          isActive
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                        }`}
                        style={{
                          backgroundColor: isActive ? category.color : undefined,
                          boxShadow: isActive ? `0 0 20px ${category.color}40` : undefined
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* 3D Controls */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Environment Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm">Environment:</span>
                  <div className="flex bg-white/10 rounded-lg p-1">
                    {environments.map(({ id, name, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setScene3DEnvironment(id as any)}
                        className={`px-3 py-1 rounded-md transition-all ${
                          scene3DEnvironment === id
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visualizer Type */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm">Visualizer:</span>
                  <div className="flex bg-white/10 rounded-lg p-1">
                    {visualizerTypes.map(({ id, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setSelectedVisualizerType(id as any)}
                        className={`px-3 py-1 rounded-md transition-all ${
                          selectedVisualizerType === id
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-400">
                  {filteredVoices.length} voices in 3D space
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Traditional Grid/List View (when not in 3D mode) */}
        {viewMode !== '3d' && (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {filteredVoices.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🎭</div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    No voices found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1 max-w-4xl mx-auto'
                }`}>
                  {filteredVoices.map((voice, index) => (
                    <motion.div
                      key={voice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group"
                    >
                      {/* Voice Card Content */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-white">{voice.name}</h3>
                          <button
                            onClick={() => toggleFavorite(voice.id)}
                            className={`p-2 rounded-full transition-all ${
                              favorites.includes(voice.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white/10 text-gray-400 hover:bg-red-500 hover:text-white'
                            }`}
                          >
                            <Heart className="w-4 h-4" fill={favorites.includes(voice.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>

                        <p className="text-gray-300">{voice.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {voice.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => generateVoiceDemo(voice)}
                            disabled={generatingDemo === voice.id}
                            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                          >
                            {generatingDemo === voice.id ? (
                              'Generating...'
                            ) : playingVoice === voice.id ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Playing
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Demo
                              </>
                            )}
                          </button>

                          {isAuthenticated && (
                            <button
                              onClick={() => navigate(`/synthesis?voice=${voice.id}`)}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                              <Mic className="w-4 h-4 mr-2" />
                              Use Voice
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Audio Controls */}
        <AnimatePresence>
          {playingVoice && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-black/80 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {voices.find(v => v.id === playingVoice)?.name}
                  </p>
                  <p className="text-gray-400 text-sm">Playing demo...</p>
                </div>
                <VoiceWaveform3D
                  isGenerating={false}
                  isPlaying={true}
                  voiceColor={categories.find(cat => cat.id === selectedCategory)?.color || '#8b5cf6'}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        {!isAuthenticated && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="py-16 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-md border-t border-white/10"
          >
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ready to Create in 3D?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Sign up now to access all voices and experience the future of voice synthesis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-purple-500/25"
                >
                  Get Started Free
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-lg font-medium backdrop-blur-sm hover:bg-white/20 transition-all"
                >
                  Sign In
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {/* Hidden audio element for audio context */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default VoicesPage3D;
