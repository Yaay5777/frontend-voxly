import { create } from 'zustand';
import { AudioFile, AudioVisualization, Voice } from '../types';

interface AudioState {
  currentAudio: AudioFile | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  audioData: number[];
  visualization: AudioVisualization;
  selectedVoice: Voice | null;
  recentAudios: AudioFile[];
  
  // Actions
  setCurrentAudio: (audio: AudioFile | null) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setAudioData: (data: number[]) => void;
  setVisualization: (viz: Partial<AudioVisualization>) => void;
  setSelectedVoice: (voice: Voice | null) => void;
  addRecentAudio: (audio: AudioFile) => void;
  clearRecentAudios: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentAudio: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  audioData: [],
  visualization: {
    frequencies: [],
    amplitude: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  },
  selectedVoice: null,
  recentAudios: [],

  setCurrentAudio: (audio) => {
    set({ currentAudio: audio });
    if (audio) {
      set({ 
        currentTime: 0,
        isPlaying: false,
      });
    }
  },

  setPlaying: (playing) => {
    set({ 
      isPlaying: playing,
      visualization: { ...get().visualization, isPlaying: playing }
    });
  },

  setCurrentTime: (time) => {
    set({ 
      currentTime: time,
      visualization: { ...get().visualization, currentTime: time }
    });
  },

  setDuration: (duration) => {
    set({ 
      duration,
      visualization: { ...get().visualization, duration }
    });
  },

  setVolume: (volume) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },

  setAudioData: (data) => {
    const amplitude = data.length > 0 ? 
      data.reduce((sum, val) => sum + val, 0) / data.length : 0;
    
    set({ 
      audioData: data,
      visualization: { 
        ...get().visualization, 
        frequencies: data,
        amplitude: amplitude / 255
      }
    });
  },

  setVisualization: (viz) => {
    set({ 
      visualization: { ...get().visualization, ...viz }
    });
  },

  setSelectedVoice: (voice) => {
    set({ selectedVoice: voice });
  },

  addRecentAudio: (audio) => {
    const current = get().recentAudios;
    const updated = [audio, ...current.filter(a => a.id !== audio.id)].slice(0, 10);
    set({ recentAudios: updated });
  },

  clearRecentAudios: () => {
    set({ recentAudios: [] });
  },
}));
