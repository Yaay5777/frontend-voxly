import React, { useState, useRef } from 'react';
import { Upload, Mic, X, Play, Pause, Check, Loader, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';
import '../styles/glassmorphism.css';

interface ClonedVoice {
  id: string;
  name: string;
  audioUrl: string;
  createdAt: Date;
  status: 'processing' | 'ready' | 'failed';
}

export const VoiceClonePage: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [voiceName, setVoiceName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [clonedVoices, setClonedVoices] = useState<ClonedVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  // File upload handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        showToast.error('Please upload an audio file (MP3, WAV, etc.)');
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        showToast.error('File size must be less than 50MB');
        return;
      }

      setAudioFile(file);
      setRecordedBlob(null);
      showToast.success('Audio file uploaded successfully!');
    }
  };

  // Start recording
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
        setRecordedBlob(audioBlob);
        setAudioFile(null);
        stream.getTracks().forEach(track => track.stop());
        showToast.success('Recording saved!');
      };

      mediaRecorder.start();
      setIsRecording(true);
      showToast.info('Recording... Speak for 30-60 seconds');
    } catch (error) {
      console.error('Recording error:', error);
      showToast.error('Could not access microphone. Please check permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Clone voice (FAST processing)
  const cloneVoice = async () => {
    if (!voiceName.trim()) {
      showToast.error('Please enter a name for your voice');
      return;
    }

    if (!audioFile && !recordedBlob) {
      showToast.error('Please upload or record audio first');
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Simulate progress (in production, get real progress from backend)
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      const formData = new FormData();
      formData.append('name', voiceName);
      
      if (audioFile) {
        formData.append('audio', audioFile);
      } else if (recordedBlob) {
        formData.append('audio', recordedBlob, 'recording.wav');
      }

      // Call backend API
      const response = await fetch('https://yaya5777-voxly-tts.hf.space/voices/clone', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('voxly_token')}`,
        },
      });

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (!response.ok) {
        throw new Error('Voice cloning failed');
      }

      const data = await response.json();

      // Add to cloned voices list
      const newVoice: ClonedVoice = {
        id: data.voice_id,
        name: voiceName,
        audioUrl: data.sample_url,
        createdAt: new Date(),
        status: 'ready',
      };

      setClonedVoices(prev => [newVoice, ...prev]);
      
      showToast.success(`🎉 Voice "${voiceName}" cloned successfully!`);
      
      // Reset form
      setVoiceName('');
      setAudioFile(null);
      setRecordedBlob(null);
      setProcessingProgress(0);
      
    } catch (error) {
      console.error('Cloning error:', error);
      showToast.error('Voice cloning failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Play preview
  const playPreview = (audioUrl: string) => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Clone Any Voice</span>
          </h1>
          <p className="text-xl text-gray-400">
            Upload 30-60 seconds of audio and create a perfect AI voice clone ⚡
          </p>
        </div>

        {/* Main Upload/Record Card */}
        <div className="glass-card gradient-border p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Step 1: Provide Audio Sample</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Upload Option */}
            <div
              className={`glass-card p-6 cursor-pointer hover:scale-105 transition-transform ${
                audioFile ? 'neon-glow' : ''
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <Upload size={48} className="mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-bold mb-2">Upload Audio</h3>
                <p className="text-gray-400 mb-4">
                  MP3, WAV, or any audio format
                </p>
                {audioFile && (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Check size={20} />
                    <span>{audioFile.name}</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Record Option */}
            <div
              className={`glass-card p-6 cursor-pointer hover:scale-105 transition-transform ${
                recordedBlob ? 'neon-glow' : ''
              } ${isRecording ? 'animate-pulse' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <div className="text-center">
                <Mic size={48} className={`mx-auto mb-4 ${isRecording ? 'text-red-500' : 'text-blue-400'}`} />
                <h3 className="text-xl font-bold mb-2">
                  {isRecording ? 'Recording...' : 'Record Audio'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {isRecording ? 'Click to stop' : 'Click to start recording'}
                </p>
                {recordedBlob && !isRecording && (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Check size={20} />
                    <span>Recording saved</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Voice Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Step 2: Name Your Voice</label>
            <input
              type="text"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              placeholder="e.g., My Professional Voice, Mom's Voice, etc."
              className="w-full glass-card px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isProcessing}
            />
          </div>

          {/* Clone Button */}
          <button
            onClick={cloneVoice}
            disabled={isProcessing || (!audioFile && !recordedBlob) || !voiceName.trim()}
            className={`w-full glass-button py-4 text-lg font-bold rounded-xl transition-all ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 neon-glow'
            }`}
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
            }}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-3">
                <Loader className="animate-spin" size={24} />
                Processing... {processingProgress}%
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <Sparkles size={24} />
                Clone Voice (Fast AI Processing ⚡)
              </span>
            )}
          </button>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mt-4 glass-card rounded-full h-3 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${processingProgress}%`,
                  background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
                }}
              />
            </div>
          )}
        </div>

        {/* Cloned Voices List */}
        {clonedVoices.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">
              <span className="gradient-text">Your Cloned Voices</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clonedVoices.map((voice) => (
                <div key={voice.id} className="voice-card-glass">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{voice.name}</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                      Ready
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Created {voice.createdAt.toLocaleDateString()}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => playPreview(voice.audioUrl)}
                      className="flex-1 glass-button py-2 rounded-lg"
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                      <span className="ml-2">Preview</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/synthesis', { state: { voiceId: voice.id } });
                      }}
                      className="flex-1 glass-button py-2 rounded-lg bg-purple-500/20"
                    >
                      Use Voice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden audio player */}
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      </div>
    </div>
  );
};
