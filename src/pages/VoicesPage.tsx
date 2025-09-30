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
  Languages
} from 'lucide-react';

// Component imports
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import Avatar3D from '../3d/Avatar3D';
import LoadingScreen from '../components/ui/LoadingScreen';

// Store imports
import { useAuthStore } from '../store/useAuthStore';
import { useAudioStore } from '../store/useAudioStore';
import { useVoiceStore } from '../store/useVoiceStore';

// Services
import { getVoices, synthesizeText } from '../services/api';
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
      
      // Try direct fetch first to bypass any axios issues
      try {
        const response = await fetch('https://yaya5777-voxly-tts.hf.space/voices', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json();
        console.log('Raw API response:', rawData);
        
        // TTS service returns voices directly as an array, not wrapped in speakers property
        const speakersArray = Array.isArray(rawData) ? rawData : (rawData.speakers || []);
        console.log('Speakers array:', speakersArray);
        
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
    setGeneratingDemo(voice.id);
    try {
      console.log('Generating demo for voice:', voice.name);
      
      // Use the new demo endpoint that doesn't require authentication
      const formData = new FormData();
      formData.append('text', voice.sample_text || "Hello, this is a sample of my voice.");
      formData.append('speaker_id', voice.id);  // Fixed: use speaker_id instead of speaker_idx
      formData.append('language', 'en');
      
      const response = await fetch('https://yaya5777-voxly-tts.hf.space/demo', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const audioBlob = await response.blob();
      console.log('Audio generated successfully, size:', audioBlob.size);
      
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create and play audio directly
      const audio = new Audio(audioUrl);
      
      // Set up audio event listeners
      audio.addEventListener('loadeddata', () => {
        console.log('Audio loaded successfully');
        setPlayingVoice(voice.id);
      });
      
      audio.addEventListener('ended', () => {
        console.log('Audio playback ended');
        setPlayingVoice(null);
      });
      
      audio.addEventListener('error', (error) => {
        console.error('Audio playback failed:', error);
        setPlayingVoice(null);
      });
      
      // Play the audio
      audio.play().then(() => {
        console.log('Audio playing successfully');
        setPlayingVoice(voice.id);
      }).catch((error) => {
        console.error('Audio playback failed:', error);
        setPlayingVoice(null);
      });
      
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
      setPlayingVoice(voice.id);
    } catch (error) {
      console.error('Failed to generate demo:', error);
    } finally {
      setGeneratingDemo(null);
    }
  };

  // Advanced filtering system for the new voice library
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
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search voices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-voxly-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-voxly-500 text-white shadow-lg'
                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-voxly-100 dark:hover:bg-voxly-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.name}</span>
                    {category.id === 'favorites' && favorites.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {favorites.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredVoices.length} of {voices.length} voices
          </div>
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
                >
                  <GlassCard className="p-6 h-full group hover:scale-105 transition-transform duration-300">
                    {/* Optimized Avatar - No WebGL */}
                    <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
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
                        {voice.flag}
                      </motion.div>

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
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {voice.description}
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
                        <span>{voice.languages.join(', ')}</span>
                        <span>{voice.gender} • {voice.age}</span>
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
    </div>
  );
};

export default VoicesPage;
