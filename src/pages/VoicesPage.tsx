import React, { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Removed WebGL import to prevent context overflow
import { useNavigate } from 'react-router-dom';
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
  Crown,
  Zap,
  Languages,
  Clock
} from 'lucide-react';

// Component imports
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import Avatar3D from '../3d/Avatar3D';
import LoadingScreen from '../components/ui/LoadingScreen';
import { VoiceHistoryPanel } from '../components/VoiceHistoryPanel';

// Store imports
import { useAuthStore } from '../store/useAuthStore';
import { useAudioStore } from '../store/useAudioStore';
import { useVoiceStore } from '../store/useVoiceStore';

// Custom hooks
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useVoiceHistory } from '../hooks/useVoiceHistory';
import { showToast } from '../utils/toast';

// Services
import { getVoices, synthesizeText, generateVoiceDemo as apiGenerateVoiceDemo } from '../services/api';
import { voiceCache } from '../services/voiceCache';
import { Voice } from '../types';

const VoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setCurrentAudio, setPlaying } = useAudioStore();
  const { setSelectedVoice } = useVoiceStore();
  
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expert voice mode state
  const [expertMode, setExpertMode] = useState(false);
  const [expertVoices, setExpertVoices] = useState<any>({});
  const [expertSelectedAccent, setExpertSelectedAccent] = useState<string>('new_zero');
  const [accentStrength, setAccentStrength] = useState<string>('medium');
  const [multilingualMode, setMultilingualMode] = useState(false);
  
  // Voice player state
  const [selectedVoice, setSelectedVoiceLocal] = useState<Voice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedAccent, setSelectedAccent] = useState<string>('all');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [generatingDemo, setGeneratingDemo] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  // Voice history hook
  const voiceHistory = useVoiceHistory();

  // Audio player hook for demo playback
  const audioPlayer = useAudioPlayer({
    onEnded: () => {
      setPlayingVoice(null);
    },
    onError: (error) => {
      console.error('Audio error:', error);
      setPlayingVoice(null);
      showToast.error(error.message);
    }
  });

  // Voice categories with icons and descriptions
  const categories = [
    { id: 'all', name: 'All Voices', icon: Users, description: 'Browse all available voices' },
    { id: 'professional', name: 'Professional', icon: Briefcase, description: 'Corporate and business voices' },
    { id: 'casual', name: 'Casual & Friendly', icon: Coffee, description: 'Warm and conversational voices' },
    { id: 'storytelling', name: 'Storytelling', icon: BookOpen, description: 'Narrative and dramatic voices' },
    { id: 'character', name: 'Character & Fun', icon: Gamepad2, description: 'Animated and entertaining voices' },
    { id: 'international', name: 'International', icon: Globe, description: 'Accented and multilingual voices' },
    { id: 'technical', name: 'AI & Technical', icon: Settings, description: 'Assistant and specialized voices' },
    { id: 'educational', name: 'Educational', icon: Star, description: 'Teaching and mentoring voices' }
  ];

  // Load voices on component mount
  useEffect(() => {
    loadVoices();
    loadFavorites();
  }, []);

  const loadVoices = async () => {
    try {
      setLoading(true);
      console.log('Loading voices from API...');
      
      // Use the proper TTS API URL from environment variables
      const TTS_API_URL = import.meta.env.VITE_TTS_URL || 'https://yaya5777-voxly-tts.hf.space';
      
      try {
        const response = await fetch(`${TTS_API_URL}/voices`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        
        const rawData = await response.json();
        console.log('Raw API response:', rawData);
        
        // TTS service returns voices in rawData.voices array
        const speakersArray = Array.isArray(rawData) ? rawData : (rawData.voices || rawData.speakers || []);
        console.log('Speakers array:', speakersArray.length, 'voices found');
        
        // Transform the data to match our Voice interface
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
        }));
        
        console.log('Voices loaded successfully:', voicesData.length, 'voices');
        console.log('First voice sample:', voicesData[0]);
        setVoices(voicesData);
        return;
      } catch (fetchError) {
        console.error('Direct fetch failed:', fetchError);
        
        // Fallback to API service
        const voicesData = await getVoices();
        console.log('API service worked:', voicesData.length, 'voices');
        setVoices(voicesData);
      }
    } catch (error) {
      console.error('Failed to load voices:', error);
      console.error('Error details:', error);
      
      // Show error message instead of fallback test voice
      setError('Unable to connect to voice service. Please check your connection and try again.');
      setVoices([]); // Empty array instead of test voice
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
  };

  const generateVoiceDemo = async (voice: Voice) => {
    // Check for token (not isAuthenticated which might be loading)
    const { token } = useAuthStore.getState();
    if (!token) {
      showToast.warning('Please login to play voice demos.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    // Stop any currently playing audio
    if (audioPlayer.isPlaying) {
      audioPlayer.stop();
    }

    setGeneratingDemo(voice.id);
    try {
      console.log('🎵 Demo requested for:', voice.name, 'ID:', voice.id);
      
      // Try to load from cache first for instant playback
      const cachedBlob = await voiceCache.get(voice.id);
      let audioBlob: Blob;
      let fromCache = false;
      
      if (cachedBlob) {
        console.log('✅ Loaded from cache:', voice.id);
        audioBlob = cachedBlob;
        fromCache = true;
      } else {
        console.log('⏳ Generating new demo (20s)...');
        // Use the API function which now uses /synthesize endpoint
        // Authentication token is automatically added by interceptor
        audioBlob = await apiGenerateVoiceDemo(
          voice.sample_text || "Hello, this is a sample of my voice.",
          voice.id,
          'en'
        );
        
        console.log('✅ Audio generated, size:', audioBlob.size, 'bytes');
        
        // Cache the audio for future instant playback
        await voiceCache.set(voice.id, audioBlob);
      }
      
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Play audio using the custom hook (handles all edge cases)
      setPlayingVoice(voice.id);
      await audioPlayer.play(audioUrl);
      
      if (fromCache) {
        showToast.success(`🚀 ${voice.name} (cached - instant playback)`);
      }
      
      // Update audio store for global player
      setCurrentAudio({
        id: `demo-${voice.id}`,
        filename: `${voice.name} Demo`,
        url: audioUrl,
        duration: 0,
        size: audioBlob.size,
        created_at: new Date().toISOString(),
        voice_id: voice.id,
        text: voice.sample_text || "Hello, this is a sample of my voice.",
        language: 'en'
      });
    } catch (error: any) {
      console.error('❌ Demo generation failed:', error);
      setPlayingVoice(null);
      
      // Show user-friendly error message
      let errorMessage = 'Failed to generate demo. ';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication error with TTS backend. You are still logged in.';
        // Don't redirect - it's a backend issue, not a session issue
      } else if (error.response?.status === 404) {
        errorMessage += 'Voice not found or TTS service unavailable.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. Please try again.';
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage += 'Cannot connect to TTS service.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      showToast.error(errorMessage);
    } finally {
      setGeneratingDemo(null);
    }
  };

  // Get all unique tags from voices for tag filter
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    voices.forEach(voice => {
      voice.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [voices]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Get voices for history panel
  const recentVoiceIds = voiceHistory.getRecentVoiceIds();
  const recentVoices = voices.filter(v => recentVoiceIds.includes(v.id));
  const favoriteVoices = voices.filter(v => favorites.includes(v.id));
  const mostUsedVoices = voiceHistory.getMostUsed(5);

  // Advanced filtering system for the new voice library
  const filteredVoices = voices.filter(voice => {
    // Enhanced search: name, description, tags, gender, accent
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
                         voice.name.toLowerCase().includes(searchLower) ||
                         voice.description.toLowerCase().includes(searchLower) ||
                         voice.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                         (voice.gender && voice.gender.toLowerCase().includes(searchLower)) ||
                         (voice.accent && voice.accent.toLowerCase().includes(searchLower));
    
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'favorites' && favorites.includes(voice.id)) ||
                           (selectedCategory === 'recent' && recentVoiceIds.includes(voice.id)) ||
                           voice.category === selectedCategory;
    
    const matchesGender = selectedGender === 'all' || voice.gender?.toLowerCase() === selectedGender.toLowerCase();
    
    const matchesAccent = selectedAccent === 'all' || voice.accent === selectedAccent;
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => voice.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesGender && matchesAccent && matchesTags;
  });


  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="py-12 bg-gradient-to-br from-voxly-50 to-accent-50 dark:from-voxly-900 dark:to-accent-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-voxly-600 to-accent-600 bg-clip-text text-transparent">
                Voice Gallery
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore our collection of AI-powered voices. Each voice comes with a unique 3D avatar 
              and can be customized to match your creative vision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, accent, gender, style... (e.g., 'British female', 'professional', 'Australian')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-voxly-500 focus:border-transparent outline-none transition-all text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span className="text-xl">×</span>
                </button>
              )}
            </div>

            {/* View Toggle & Quick Access */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-voxly-500 text-white'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-voxly-500 text-white'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              
              {/* Quick Access Button */}
              <button
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  showHistoryPanel
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/20'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Quick Access</span>
                {(recentVoices.length > 0 || favoriteVoices.length > 0) && (
                  <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {recentVoices.length + favoriteVoices.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Advanced Filters Row */}
          <div className="mt-4 flex flex-wrap gap-3">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-voxly-500 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            
            {/* Gender Filter */}
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-voxly-500 outline-none"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="neutral">Neutral</option>
            </select>
            
            {/* Accent Filter */}
            <select
              value={selectedAccent}
              onChange={(e) => setSelectedAccent(e.target.value)}
              className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-voxly-500 outline-none"
            >
              <option value="all">All Accents</option>
              {Array.from(new Set(voices.map(v => v.accent).filter(Boolean))).sort().map(accent => (
                <option key={accent} value={accent}>{accent}</option>
              ))}
            </select>
            
            {/* Favorites Button */}
            <button
              onClick={() => setSelectedCategory(selectedCategory === 'favorites' ? 'all' : 'favorites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedCategory === 'favorites'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-red-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${selectedCategory === 'favorites' ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">Favorites</span>
              {favorites.length > 0 && (
                <span className={`text-xs rounded-full px-2 py-0.5 ${
                  selectedCategory === 'favorites'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {favorites.length}
                </span>
              )}
            </button>
            
            {/* Clear Filters Button */}
            {(searchQuery || selectedCategory !== 'all' || selectedGender !== 'all' || selectedAccent !== 'all' || selectedTags.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedGender('all');
                  setSelectedAccent('all');
                  setSelectedTags([]);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                <span className="text-sm font-medium">Clear All Filters</span>
              </button>
            )}
          </div>

          {/* Tag Filter Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredVoices.length} of {voices.length} voices
              {selectedTags.length > 0 && (
                <span className="ml-2 text-voxly-600 dark:text-voxly-400">
                  · {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selected
                </span>
              )}
            </div>
            <button
              onClick={() => setShowTagFilter(!showTagFilter)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg hover:bg-voxly-100 dark:hover:bg-voxly-900 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Filter by Tags</span>
              {selectedTags.length > 0 && (
                <span className="bg-voxly-500 text-white text-xs rounded-full px-2 py-0.5">
                  {selectedTags.length}
                </span>
              )}
            </button>
          </div>

          {/* Tag Filter Panel */}
          {showTagFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-voxly-500" />
                  <span>Filter by Personality & Style</span>
                </h3>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="text-xs text-voxly-600 dark:text-voxly-400 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-voxly-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-voxly-100 dark:hover:bg-voxly-900'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                💡 Tip: Select multiple tags to find voices that match all selected traits
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Voices Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredVoices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No voices found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <GlowButton onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}>
                Clear Filters
              </GlowButton>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredVoices.map((voice, index) => (
                <motion.div
                  key={voice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={() => {
                    // Auto-play demo on hover if authenticated
                    if (isAuthenticated && !generatingDemo && playingVoice !== voice.id) {
                      generateVoiceDemo(voice);
                    }
                  }}
                >
                  <GlassCard className="p-6 h-full group hover:scale-105 transition-transform duration-300">
                    {/* AI Avatar Display */}
                    <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-voxly-100 to-accent-100 dark:from-voxly-900 dark:to-accent-900 flex items-center justify-center">
                      {(voice as any).avatar_url ? (
                        <motion.div
                          className="w-32 h-32 rounded-full overflow-hidden"
                          animate={playingVoice === voice.id ? {
                            scale: [1, 1.1, 1],
                          } : {}}
                          transition={{
                            duration: 1.5,
                            repeat: playingVoice === voice.id ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                        >
                          <img
                            src={(voice as any).avatar_url}
                            alt={voice.name}
                            className={`w-full h-full object-cover transition-all duration-300 ${
                              playingVoice === voice.id ? 'ring-4 ring-voxly-500' : ''
                            }`}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          className={`text-6xl transition-all duration-300 ${
                            playingVoice === voice.id ? 'animate-bounce scale-110' : ''
                          }`}
                          animate={playingVoice === voice.id ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0],
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: playingVoice === voice.id ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                        >
                          {voice.flag || '🎤'}
                        </motion.div>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(voice.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
                          favorites.includes(voice.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart className="w-4 h-4" fill={favorites.includes(voice.id) ? 'currentColor' : 'none'} />
                      </button>

                      {/* Quality Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
                          voice.quality === 'high' 
                            ? 'bg-green-500/80 text-white'
                            : voice.quality === 'medium'
                            ? 'bg-yellow-500/80 text-white'
                            : 'bg-gray-500/80 text-white'
                        }`}>
                          {voice.quality?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Voice Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {voice.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[40px]">
                          {voice.description || 'A unique AI-generated voice with natural intonation and clarity.'}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {voice.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-voxly-100 dark:bg-voxly-900 text-voxly-700 dark:text-voxly-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {voice.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            +{voice.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Voice Details */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">{voice.languages?.join(', ') || 'Multi-language'}</span>
                        <span className="capitalize">{voice.gender || 'Neutral'} • {voice.age || 'Adult'}</span>
                      </div>

                      {/* Character Count Info */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                        <span className="font-semibold">✨ Sample:</span> {voice.sample_text?.length || 0} characters
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <GlowButton
                          size="sm"
                          variant="ghost"
                          onClick={() => generateVoiceDemo(voice)}
                          loading={generatingDemo === voice.id}
                          disabled={!isAuthenticated || generatingDemo === voice.id}
                          className="flex-1"
                        >
                          {generatingDemo === voice.id ? (
                            'Generating...'
                          ) : playingVoice === voice.id ? (
                            <>
                              <Pause className="w-4 h-4 mr-1" />
                              Playing
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-1" />
                              Demo
                            </>
                          )}
                        </GlowButton>

                        {isAuthenticated && (
                          <GlowButton
                            size="sm"
                            onClick={() => {
                              voiceHistory.addToHistory(voice.id, voice.name);
                              setSelectedVoice(voice);
                              navigate(`/synthesis?voice=${voice.id}`);
                            }}
                            className="flex-1"
                          >
                            <Mic className="w-4 h-4 mr-1" />
                            Use Voice
                          </GlowButton>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-gradient-to-br from-voxly-50 to-accent-50 dark:from-voxly-900 dark:to-accent-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                <span className="bg-gradient-to-r from-voxly-600 to-accent-600 bg-clip-text text-transparent">
                  Ready to Create with AI Voices?
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Sign up now to access all voices, create custom clones, and bring your content to life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlowButton size="lg" onClick={() => window.location.href = '/register'}>
                  Get Started Free
                </GlowButton>
                <GlowButton variant="ghost" size="lg" onClick={() => window.location.href = '/login'}>
                  Sign In
                </GlowButton>
              </div>
            </motion.div>
          </div>
        </section>
      )}
      
      {/* Voice History Panel */}
      {showHistoryPanel && (
        <VoiceHistoryPanel
          recentVoices={recentVoices}
          favoriteVoices={favoriteVoices}
          mostUsedVoices={mostUsedVoices}
          onVoiceSelect={(voice) => {
            voiceHistory.addToHistory(voice.id, voice.name);
            setSelectedVoice(voice);
            setShowHistoryPanel(false);
            navigate(`/synthesis?voice=${voice.id}`);
          }}
          onClose={() => setShowHistoryPanel(false)}
        />
      )}
    </div>
  );
};

export default VoicesPage;
