import React, { useState, useRef, useEffect } from 'react';
import { Upload, Mic, Play, Pause, Square, Download, Trash2, Settings, Lock, Crown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useAuthStore } from '../store/useAuthStore';
import GlowButton from '../components/ui/GlowButton';

interface VoiceClone {
  clone_id: string;
  name: string;
  description?: string;
  language: string;
  gender: string;
  duration: number;
  status: string;
  created_at: number;
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
}

const VoiceCloningPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'record' | 'clones'>('upload');
  const [voiceClones, setVoiceClones] = useState<VoiceClone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get authentication status
  const { isAuthenticated, user } = useAuthStore();
  const isPremium = user?.is_premium || false;
  
  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Recording state
  const [recording, setRecording] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null
  });
  
  // Clone form state
  const [cloneForm, setCloneForm] = useState({
    name: '',
    description: '',
    language: 'en',
    gender: 'neutral'
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user's voice clones
  useEffect(() => {
    loadVoiceClones();
  }, []);

  const loadVoiceClones = async () => {
    try {
      const TTS_API_URL = import.meta.env.VITE_TTS_URL || 'https://yaya5777-voxly-tts.hf.space';
      const token = localStorage.getItem('token');
      const response = await fetch(`${TTS_API_URL}/tts/premium/voice-clones`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setVoiceClones(data.voice_clones);
        }
      }
    } catch (err) {
      console.error('Failed to load voice clones:', err);
    }
  };

  // Helper function to check if premium is required
  const requiresPremium = (feature: string) => {
    return !isPremium;
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('audio_file', file);
      formData.append('clone_request', JSON.stringify(cloneForm));
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tts/premium/voice-clone/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        setUploadFile(null);
        setCloneForm({ name: '', description: '', language: 'en', gender: 'neutral' });
        await loadVoiceClones();
        alert('Voice clone uploaded successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecording(prev => ({ ...prev, audioBlob }));
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setRecording(prev => ({ ...prev, isRecording: true, duration: 0 }));
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecording(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
      
    } catch (err) {
      setError('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording.isRecording) {
      mediaRecorderRef.current.stop();
      setRecording(prev => ({ ...prev, isRecording: false }));
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const uploadRecording = async () => {
    if (!recording.audioBlob) return;
    
    const file = new File([recording.audioBlob], 'recording.wav', { type: 'audio/wav' });
    await handleFileUpload(file);
    setRecording({ isRecording: false, isPaused: false, duration: 0, audioBlob: null });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Premium Upgrade Banner */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Premium Feature</h3>
                  <p className="text-yellow-200">Voice cloning is available with a premium subscription</p>
                </div>
              </div>
              <Link to="/pricing">
                <GlowButton variant="primary" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Star className="w-4 h-4 mr-2" />
                  Upgrade Now
                </GlowButton>
              </Link>
            </div>
          </motion.div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎭 Premium Voice Cloning
          </h1>
          <p className="text-xl text-purple-200">
            Create your own custom voices with AI-powered cloning technology
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-1">
            {[
              { id: 'upload', label: 'Upload Audio', icon: Upload },
              { id: 'record', label: 'Record Voice', icon: Mic },
              { id: 'clones', label: 'My Clones', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all ${
                  activeTab === id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 text-red-200">
            {error}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Upload Audio File</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div
                  className="border-2 border-dashed border-purple-400 rounded-lg p-8 text-center cursor-pointer hover:border-purple-300 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={48} className="mx-auto mb-4 text-purple-400" />
                  <p className="text-white mb-2">
                    {uploadFile ? uploadFile.name : 'Click to upload audio file'}
                  </p>
                  <p className="text-purple-200 text-sm">
                    Supported: MP3, WAV, M4A (Max 10 minutes, 50MB)
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Voice Name *</label>
                  <input
                    type="text"
                    value={cloneForm.name}
                    onChange={(e) => setCloneForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-purple-400 rounded-lg text-white placeholder-purple-200"
                    placeholder="My Custom Voice"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Description</label>
                  <textarea
                    value={cloneForm.description}
                    onChange={(e) => setCloneForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-purple-400 rounded-lg text-white placeholder-purple-200"
                    placeholder="Describe your voice..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">Language</label>
                    <select
                      value={cloneForm.language}
                      onChange={(e) => setCloneForm(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/10 border border-purple-400 rounded-lg text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Gender</label>
                    <select
                      value={cloneForm.gender}
                      onChange={(e) => setCloneForm(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/10 border border-purple-400 rounded-lg text-white"
                    >
                      <option value="neutral">Neutral</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={() => uploadFile && handleFileUpload(uploadFile)}
                  disabled={!uploadFile || !cloneForm.name || loading || requiresPremium('upload')}
                  className={`w-full text-white py-3 rounded-lg font-semibold transition-colors relative ${
                    requiresPremium('upload') 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600'
                  }`}
                >
                  {loading ? 'Processing...' : 'Create Voice Clone'}
                  {requiresPremium('upload') && (
                    <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
                      <div className="flex items-center space-x-2 text-white">
                        <Lock size={16} />
                        <span className="text-sm">Premium Required</span>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Record Tab */}
        {activeTab === 'record' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Record Your Voice</h2>
            
            <div className="text-center mb-8">
              <div className="bg-white/5 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                {recording.isRecording ? (
                  <div className="w-16 h-16 bg-red-500 rounded-full animate-pulse" />
                ) : (
                  <Mic size={64} className="text-purple-400" />
                )}
              </div>
              
              <div className="text-3xl font-mono text-white mb-4">
                {formatDuration(recording.duration)}
              </div>
              
              <div className="flex justify-center gap-4 mb-6">
                {!recording.isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={requiresPremium('record')}
                    className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors relative ${
                      requiresPremium('record') 
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <Mic size={20} />
                    Start Recording
                    {requiresPremium('record') && (
                      <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
                        <div className="flex items-center space-x-2 text-white">
                          <Lock size={16} />
                          <span className="text-sm">Premium Required</span>
                        </div>
                      </div>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                  >
                    <Square size={20} />
                    Stop Recording
                  </button>
                )}
              </div>
              
              {recording.audioBlob && (
                <div className="space-y-4">
                  <audio controls className="mx-auto">
                    <source src={URL.createObjectURL(recording.audioBlob)} type="audio/wav" />
                  </audio>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={uploadRecording}
                      disabled={!cloneForm.name || loading}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg"
                    >
                      Create Voice Clone
                    </button>
                    
                    <button
                      onClick={() => setRecording(prev => ({ ...prev, audioBlob: null }))}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-white mb-2">Voice Name *</label>
                <input
                  type="text"
                  value={cloneForm.name}
                  onChange={(e) => setCloneForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-purple-400 rounded-lg text-white placeholder-purple-200"
                  placeholder="My Recorded Voice"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Language</label>
                  <select
                    value={cloneForm.language}
                    onChange={(e) => setCloneForm(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-purple-400 rounded-lg text-white"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white mb-2">Gender</label>
                  <select
                    value={cloneForm.gender}
                    onChange={(e) => setCloneForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-purple-400 rounded-lg text-white"
                  >
                    <option value="neutral">Neutral</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Clones Tab */}
        {activeTab === 'clones' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">My Voice Clones</h2>
            
            {voiceClones.length === 0 ? (
              <div className="text-center py-12">
                <Settings size={64} className="mx-auto mb-4 text-purple-400" />
                <p className="text-white text-xl mb-2">{isPremium ? 'No voice clones yet' : 'Voice cloning available with premium'}</p>
                <p className="text-purple-200">
                  {isPremium 
                    ? 'Upload or record your first voice to get started!' 
                    : 'Upgrade to premium to create and manage your custom voice clones'
                  }
                </p>
                {!isPremium && (
                  <div className="mt-6">
                    <Link to="/pricing">
                      <GlowButton variant="primary" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Premium
                      </GlowButton>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {voiceClones.map((clone) => (
                  <div key={clone.clone_id} className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-white font-semibold text-lg mb-2">{clone.name}</h3>
                    <p className="text-purple-200 text-sm mb-4">{clone.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-300">Language:</span>
                        <span className="text-white">{clone.language.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Gender:</span>
                        <span className="text-white">{clone.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Duration:</span>
                        <span className="text-white">{formatDuration(Math.floor(clone.duration))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Status:</span>
                        <span className={`${clone.status === 'processed' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {clone.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button 
                        className={`flex-1 py-2 px-4 rounded text-sm transition-colors relative ${
                          requiresPremium('use_clone') 
                            ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        Use Voice
                        {requiresPremium('use_clone') && (
                          <div className="absolute inset-0 bg-gray-900/50 rounded flex items-center justify-center">
                            <div className="flex items-center space-x-2 text-white">
                              <Lock size={12} />
                              <span className="text-xs">Premium</span>
                            </div>
                          </div>
                        )}
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceCloningPage;
