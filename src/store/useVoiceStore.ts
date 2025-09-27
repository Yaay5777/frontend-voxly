import { create } from 'zustand';
import { Voice } from '../types';
import { getVoices } from '../services/api';

interface VoiceState {
  voices: Voice[];
  selectedVoice: Voice | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setVoices: (voices: Voice[]) => void;
  setSelectedVoice: (voice: Voice | null) => void;
  loadVoices: () => Promise<void>;
  clearError: () => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  voices: [],
  selectedVoice: null,
  loading: false,
  error: null,

  setVoices: (voices) => set({ voices }),
  
  setSelectedVoice: (voice) => set({ selectedVoice: voice }),
  
  loadVoices: async () => {
    // Don't reload if we already have voices
    if (get().voices.length > 0) return;
    
    set({ loading: true, error: null });
    try {
      const voices = await getVoices();
      set({ voices, loading: false });
    } catch (error) {
      console.error('Failed to load voices:', error);
      set({ 
        error: 'Failed to load voices. Please try again.', 
        loading: false 
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));
