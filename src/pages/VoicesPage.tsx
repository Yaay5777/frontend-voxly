import React, { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Settings
} from 'lucide-react';

// Component imports (these would need to be created)
// import GlassCard from '../components/ui/GlassCard';
// import GlowButton from '../components/ui/GlowButton';
// import LoadingScreen from '../components/ui/LoadingScreen';

// Store imports (these would need to be created)
// import { useAuthStore } from '../store/useAuthStore';
// import { useAudioStore } from '../store/useAudioStore';
// import { useVoiceStore } from '../store/useVoiceStore';

// Services
import { ttsService } from '../services/api';

// Types
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

const VoicesPage: React.FC = () => {
  const navigate = useNavigate();
  // const { isAuthenticated } = useAuthStore();
  // const { setCurrentAudio, setPlaying } = useAudioStore();
  // const { setSelectedVoice } = useVoiceStore();
  
  // Temporary auth state (replace with actual auth store)
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Voice categories with icons and descriptions
  const categories = [
    { id: 'all', name: 'All Voices', icon: Users, description: 'Browse all 43+ available voices', count: 0 },
    { id: 'professional', name: 'Professional', icon: Briefcase, description: 'Corporate and business voices', count: 0 },
    { id: 'international', name: 'International', icon: Globe, description: 'Multilingual and accented voices', count: 0 },
    { id: 'technical', name: 'AI & Robotic', icon: Settings, description: 'Synthetic and futuristic voices', count: 0 },
    { id: 'celebrity', name: 'Celebrity Style', icon: Star, description: 'Famous narrator and personality styles', count: 0 },
    { id: 'casual', name: 'Casual & Friendly', icon: Coffee, description: 'Warm and conversational voices', count: 0 },
    { id: 'storytelling', name: 'Storytelling', icon: BookOpen, description: 'Narrative and dramatic voices', count: 0 },
    { id: 'character', name: 'Character & Fun', icon: Gamepad2, description: 'Animated and entertaining voices', count: 0 }
  ];

  // Load voices on component mount
  useEffect(() => {
    loadVoices();
    loadFavorites();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  };

  const loadVoices = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading voices from API...');
      
      // REPLACE: https://huggingface.co/spaces/Yaya5777/voxly-tts-api/speakers → ttsService.getVoices()
      const data = await ttsService.getVoices();
      console.log('Raw API response:', data);
      
      // Extract speakers array from the response (our backend returns {speakers: [...]})
      const speakersArray = data.speakers || data || [];
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
        flag: speaker.flag || '🎭',
      }));
      
      console.log('Voices loaded successfully:', voicesData.length, 'voices');
      console.log('First voice sample:', voicesData[0]);
      setVoices(voicesData);
    } catch (error) {
      console.error('Failed to load voices:', error);
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
      
      // REPLACE: https://huggingface.co/spaces/Yaya5777/voxly-tts-api/demo → ttsService.generateDemo()
      const audioBlob = await ttsService.generateDemo(
        voice.id,
        voice.sample_text || "Hello, this is a sample of my voice."
      );
      
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
      
      // Store audio info (would use audio store in real app)
      // setCurrentAudio({
      //   id: `demo-${voice.id}`,
      //   filename: `${voice.name} Demo`,
      //   url: audioUrl,
      //   duration: 0,
      //   size: audioBlob.size,
      //   created_at: new Date().toISOString(),
      //   voice_id: voice.id,
      //   text: voice.sample_text || "Hello, this is a sample of my voice.",
      //   language: 'en'
      // });
      
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading voices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadVoices}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Voice Gallery
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our collection of AI-powered voices. Each voice comes with a unique 3D avatar 
              and can be customized to match your creative vision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white/50 backdrop-blur-sm">
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
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
                        ? 'bg-indigo-500 text-white shadow-lg'
                        : 'bg-white/80 text-gray-700 hover:bg-indigo-100'
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
          <div className="mt-4 text-sm text-gray-600">
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
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No voices found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
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
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full group">
                    {/* Avatar */}
                    <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {voice.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {voice.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {voice.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {voice.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{voice.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Voice Details */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{voice.languages.join(', ')}</span>
                        <span>{voice.gender} • {voice.age}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => generateVoiceDemo(voice)}
                          disabled={generatingDemo === voice.id}
                          className="flex-1 bg-indigo-100 text-indigo-700 py-2 px-3 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-50 text-sm font-medium flex items-center justify-center"
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
                        </button>

                        {isAuthenticated && (
                          <button
                            onClick={() => {
                              // setSelectedVoice(voice);
                              navigate(`/synthesis?voice=${voice.id}`);
                            }}
                            className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center"
                          >
                            <Mic className="w-4 h-4 mr-1" />
                            Use Voice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Ready to Create with AI Voices?
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                Sign up now to access all voices, create custom clones, and bring your content to life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default VoicesPage;
