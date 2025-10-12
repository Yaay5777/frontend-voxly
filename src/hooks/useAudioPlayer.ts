import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioPlayerOptions {
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

export const useAudioPlayer = (options: UseAudioPlayerOptions = {}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {
        // Ignore cleanup errors
      });
      audioContextRef.current = null;
    }
  }, []);

  // Play audio from URL or Blob
  const play = useCallback(async (audioUrl: string) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current && currentAudio !== audioUrl) {
        cleanup();
      }

      // Create new audio element if needed
      if (!audioRef.current) {
        audioRef.current = new Audio();
        
        // Set up event listeners
        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          options.onEnded?.();
        });

        audioRef.current.addEventListener('error', (event) => {
          console.error('Audio error:', event);
          setIsPlaying(false);
          setCurrentAudio(null);
          options.onError?.(new Error('Audio playback failed'));
        });
      }

      // Set audio source and play
      audioRef.current.src = audioUrl;
      setCurrentAudio(audioUrl);

      // Play with proper error handling
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        console.log('✅ Audio playback started successfully');
      }
    } catch (error: any) {
      console.error('❌ Audio play failed:', error);
      setIsPlaying(false);
      setCurrentAudio(null);

      if (error.name === 'NotAllowedError') {
        options.onError?.(new Error('Please click the button again. Browser requires direct user interaction to play audio.'));
      } else {
        options.onError?.(new Error('Failed to play audio. Please try again.'));
      }
    }
  }, [currentAudio, cleanup, options]);

  // Stop playback
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentAudio(null);
  }, []);

  // Pause playback
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Resume playback
  const resume = useCallback(() => {
    if (audioRef.current && currentAudio) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Resume failed:', error);
        options.onError?.(error);
      });
    }
  }, [currentAudio, options]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    play,
    stop,
    pause,
    resume,
    isPlaying,
    currentAudio,
  };
};
