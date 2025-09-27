import { useEffect, useState, useRef } from 'react';

interface AudioAnalyzerData {
  frequencies: number[];
  amplitude: number;
  isAnalyzing: boolean;
}

export const useAudioAnalyzer = (audioUrl?: string, isPlaying: boolean = false): AudioAnalyzerData => {
  const [frequencies, setFrequencies] = useState<number[]>([]);
  const [amplitude, setAmplitude] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number>();
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl || !isPlaying) {
      setIsAnalyzing(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const initializeAudioAnalyzer = async () => {
      try {
        // Create audio element if it doesn't exist
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio(audioUrl);
          audioElementRef.current.crossOrigin = 'anonymous';
        }

        // Create audio context
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;
        
        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        // Create analyser node
        if (!analyserRef.current) {
          analyserRef.current = audioContext.createAnalyser();
          analyserRef.current.fftSize = 256;
          analyserRef.current.smoothingTimeConstant = 0.8;
        }

        // Create source node
        if (!sourceRef.current && audioElementRef.current) {
          sourceRef.current = audioContext.createMediaElementSource(audioElementRef.current);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContext.destination);
        }

        setIsAnalyzing(true);

        // Start analysis loop
        const analyze = () => {
          if (!analyserRef.current || !isPlaying) return;

          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Convert to normalized array
          const normalizedFrequencies = Array.from(dataArray).map(value => value / 255);
          
          // Calculate amplitude (average of all frequencies)
          const avgAmplitude = normalizedFrequencies.reduce((sum, val) => sum + val, 0) / normalizedFrequencies.length;
          
          setFrequencies(normalizedFrequencies);
          setAmplitude(avgAmplitude);
          
          animationRef.current = requestAnimationFrame(analyze);
        };

        analyze();

      } catch (error) {
        console.error('Error initializing audio analyzer:', error);
        setIsAnalyzing(false);
      }
    };

    initializeAudioAnalyzer();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    frequencies,
    amplitude,
    isAnalyzing,
  };
};
