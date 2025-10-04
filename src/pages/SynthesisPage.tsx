import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { 
  Play, 
  Pause, 
  Download, 
  ArrowLeft, 
  Volume2, 
  Settings,
  Mic,
  Type,
  Sparkles,
  Clock,
  User,
  Languages,
  Globe
} from 'lucide-react';

// Component imports
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import WaveformVisualizer from '../components/audio/WaveformVisualizer';
import Avatar3D from '../3d/Avatar3D';
import LoadingScreen from '../components/ui/LoadingScreen';

// Store imports
import { useAuthStore } from '../store/useAuthStore';
import { useVoiceStore } from '../store/useVoiceStore';

// Services
import { synthesizeText, getQuotaInfo } from '../services/api';

// Types
import { Voice, AudioFile, QuotaInfo } from '../types';

// Language interface
interface Language {
  name: string;
  native_name: string;
  flag: string;
}

const SynthesisPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuthStore();
  const { voices, selectedVoice, setSelectedVoice, loadVoices } = useVoiceStore();

  // State
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<AudioFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [availableLanguages, setAvailableLanguages] = useState<Record<string, Language>>({});
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Get voice from URL params or selected voice
  const voiceId = searchParams.get('voice') || selectedVoice?.id;
  const currentVoice = voices.find(v => v.id === voiceId) || selectedVoice;

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    // Load voices if not loaded
    if (voices.length === 0) {
      loadVoices();
    }

    // Set selected voice from URL
    if (voiceId && !selectedVoice) {
      const voice = voices.find(v => v.id === voiceId);
      if (voice) {
        setSelectedVoice(voice);
      }
    }

    // Load quota info
    loadQuotaInfo();
    
    // Load available languages
    loadAvailableLanguages();
  }, [user, token, voiceId, voices, selectedVoice]);

  const loadAvailableLanguages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_TTS_API_URL}/languages`);
      const data = await response.json();
      setAvailableLanguages(data.languages);
      setSelectedLanguage(data.default_language || 'en');
    } catch (error) {
      console.error('Failed to load languages:', error);
      // Fallback languages
      setAvailableLanguages({
        en: { name: 'English', native_name: 'English', flag: '🇺🇸' },
        es: { name: 'Spanish', native_name: 'Español', flag: '🇪🇸' },
        fr: { name: 'French', native_name: 'Français', flag: '🇫🇷' },
        de: { name: 'German', native_name: 'Deutsch', flag: '🇩🇪' },
        ar: { name: 'Arabic', native_name: 'العربية', flag: '🇸🇦' }
      });
    }
  };

  const loadQuotaInfo = async () => {
    try {
      const quota = await getQuotaInfo();
      setQuotaInfo(quota);
    } catch (error) {
      console.error('Failed to load quota info:', error);
    }
  };

  const handleSynthesize = async () => {
    if (!text.trim() || !currentVoice || !user) return;

    setIsGenerating(true);
    setError('');

    try {
      console.log('🚀 Starting synthesis for voice:', currentVoice.name);
      
      const audioBlob = await synthesizeText({
        text: text.trim(),
        voice_id: currentVoice.id,
        language: selectedLanguage
      });

      // Create AudioFile object from blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create an audio element to get the duration
      const audio = new Audio(audioUrl);
      const duration = await new Promise<number>((resolve) => {
        audio.onloadedmetadata = () => {
          resolve(audio.duration);
        };
        audio.onerror = () => {
          console.warn('Could not determine audio duration');
          resolve(0);
        };
      });
      
      const audioFile: AudioFile = {
        id: `synthesis_${Date.now()}`,
        filename: `${currentVoice.id}_${Date.now()}.wav`,
        url: audioUrl,
        size: audioBlob.size,
        duration: duration,
        created_at: new Date().toISOString(),
        voice_id: currentVoice.id,
        text: text.trim(),
        language: currentVoice.languages?.[0] || 'en'
      };

      console.log('✅ Synthesis completed:', audioFile);
      setGeneratedAudio(audioFile);
      
      // Update quota info
      await loadQuotaInfo();
      
    } catch (error: any) {
      console.error('❌ Synthesis failed:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to generate audio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (!generatedAudio) return;

    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      const audio = new Audio(generatedAudio.url);
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('error', () => {
        setError('Failed to play audio');
        setIsPlaying(false);
      });
      
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!generatedAudio) return;

    const link = document.createElement('a');
    link.href = generatedAudio.url;
    link.download = generatedAudio.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const characterCount = text.length;
  // Calculate remaining quota based on the QuotaInfo properties
  const remainingQuota = quotaInfo ? quotaInfo.weekly_limit - quotaInfo.current_usage : 0;
  const canGenerate = characterCount > 0 && characterCount <= remainingQuota;

  if (!currentVoice) {
    return (
      <LoadingScreen message="Loading voice..." />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <GlowButton
              onClick={() => navigate('/voices')}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Voices</span>
            </GlowButton>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Voice Synthesis
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Generate speech with {currentVoice.name}
              </p>
            </div>
          </div>

          {/* Quota Display */}
          {quotaInfo && (
            <GlassCard className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-voxly-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Weekly Quota
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {quotaInfo?.weekly_used?.toLocaleString() || '0'} / {quotaInfo?.weekly_quota?.toLocaleString() || '10,000'} characters
                  </p>
                </div>
              </div>
            </GlassCard>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Text Input & Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Voice Info */}
            <GlassCard className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-voxly-400 to-voxly-600">
                  <Canvas camera={{ position: [0, 0, 3] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[5, 5, 5]} />
                    <Suspense fallback={null}>
                      <Avatar3D
                        config={{
                          geometry: currentVoice.avatar as any,
                          material: 'glass',
                          animation: 'float',
                          particles: false,
                          color: currentVoice.color,
                          intensity: 0.8,
                        }}
                        scale={0.8}
                      />
                    </Suspense>
                  </Canvas>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentVoice.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentVoice.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-voxly-100 dark:bg-voxly-900 text-voxly-700 dark:text-voxly-300 rounded-full">
                      {currentVoice.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                      {currentVoice.gender}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Language Selector */}
            <GlassCard className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Languages className="w-4 h-4" />
                    <span>Language Selection</span>
                  </label>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Globe className="w-3 h-3" />
                    <span>Voice keeps its accent</span>
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                    className="w-full p-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-voxly-500 focus:border-transparent outline-none transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {availableLanguages[selectedLanguage]?.flag || '🌍'}
                      </span>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {availableLanguages[selectedLanguage]?.name || 'English'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {availableLanguages[selectedLanguage]?.native_name || 'English'}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: showLanguageSelector ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Languages className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </button>
                  
                  {showLanguageSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                    >
                      {Object.entries(availableLanguages).map(([code, language]) => (
                        <button
                          key={code}
                          onClick={() => {
                            setSelectedLanguage(code);
                            setShowLanguageSelector(false);
                          }}
                          className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                            selectedLanguage === code ? 'bg-voxly-50 dark:bg-voxly-900/20 border-r-2 border-voxly-500' : ''
                          }`}
                        >
                          <span className="text-lg">{language.flag}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {language.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {language.native_name}
                            </p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1">Multilingual Voice Technology</p>
                      <p>
                        {currentVoice.display_name || currentVoice.name} will speak {availableLanguages[selectedLanguage]?.name || 'the selected language'} while maintaining their authentic {currentVoice.accent_region || 'accent'} and natural speaking style.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Text Input */}
            <GlassCard className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Type className="w-4 h-4" />
                    <span>Text to Synthesize</span>
                  </label>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className={`${characterCount > remainingQuota ? 'text-red-500' : 'text-gray-500'}`}>
                      {characterCount.toLocaleString()} / {remainingQuota.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the text you want to convert to speech..."
                  className="w-full h-32 p-4 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-voxly-500 focus:border-transparent outline-none transition-all resize-none"
                  maxLength={remainingQuota}
                />
                
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>
            </GlassCard>

            {/* Generate Button */}
            <GlowButton
              onClick={handleSynthesize}
              disabled={!canGenerate || isGenerating}
              className="w-full flex items-center justify-center space-x-2 py-4"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  <span>Generating Audio...</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Generate Speech</span>
                </>
              )}
            </GlowButton>
          </motion.div>

          {/* Right Column - Audio Player & Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* 3D Avatar Visualization */}
            <GlassCard className="p-6 h-64">
              <div className="relative h-full">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                  <Suspense fallback={null}>
                    <Avatar3D
                      config={{
                        geometry: currentVoice.avatar as any,
                        material: 'glass',
                        animation: 'float',
                        particles: true,
                        color: currentVoice.color,
                        intensity: 1,
                      }}
                      scale={1.5}
                      isPlaying={isPlaying}
                      audioData={isPlaying ? [0.5, 0.7, 0.3, 0.8, 0.6] : []}
                    />
                  </Suspense>
                </Canvas>
              </div>
            </GlassCard>

            {/* Audio Player */}
            {generatedAudio && (
              <GlassCard className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Generated Audio
                    </h3>
                    <div className="flex items-center space-x-2">
                      <GlowButton
                        onClick={handlePlayPause}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isPlaying ? 'Pause' : 'Play'}</span>
                      </GlowButton>
                      
                      <GlowButton
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </GlowButton>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Placeholder when no audio */}
            {!generatedAudio && (
              <GlassCard className="p-6 h-48 flex items-center justify-center">
                <div className="text-center">
                  <Volume2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Your generated audio will appear here
                  </p>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SynthesisPage;
