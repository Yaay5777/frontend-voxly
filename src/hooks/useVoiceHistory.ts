// Voice History Hook - Track recently used voices
import { useState, useEffect } from 'react';

interface VoiceHistoryItem {
  voiceId: string;
  voiceName: string;
  lastUsed: number;
  useCount: number;
}

const MAX_HISTORY_ITEMS = 10;
const STORAGE_KEY = 'voxly_voice_history';

export const useVoiceHistory = () => {
  const [history, setHistory] = useState<VoiceHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load voice history:', error);
      setHistory([]);
    }
  };

  const addToHistory = (voiceId: string, voiceName: string) => {
    setHistory(prevHistory => {
      // Check if voice already exists in history
      const existingIndex = prevHistory.findIndex(item => item.voiceId === voiceId);
      
      let newHistory: VoiceHistoryItem[];
      
      if (existingIndex !== -1) {
        // Update existing entry
        newHistory = [...prevHistory];
        newHistory[existingIndex] = {
          ...newHistory[existingIndex],
          lastUsed: Date.now(),
          useCount: newHistory[existingIndex].useCount + 1,
        };
        // Move to front
        const [updated] = newHistory.splice(existingIndex, 1);
        newHistory.unshift(updated);
      } else {
        // Add new entry
        const newItem: VoiceHistoryItem = {
          voiceId,
          voiceName,
          lastUsed: Date.now(),
          useCount: 1,
        };
        newHistory = [newItem, ...prevHistory];
      }
      
      // Keep only MAX_HISTORY_ITEMS
      newHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to save voice history:', error);
      }
      
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const removeFromHistory = (voiceId: string) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item.voiceId !== voiceId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  // Get recently used voice IDs (for quick filtering)
  const getRecentVoiceIds = (): string[] => {
    return history.map(item => item.voiceId);
  };

  // Get most used voices
  const getMostUsed = (limit: number = 5): VoiceHistoryItem[] => {
    return [...history]
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, limit);
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
    getRecentVoiceIds,
    getMostUsed,
  };
};
