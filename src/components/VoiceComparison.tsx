import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, X, Plus, Loader } from 'lucide-react';
import { showToast } from '../utils/toast';

interface Voice {
  id: string;
  name: string;
  gender: string;
  accent: string;
}

interface ComparisonSlot {
  voice: Voice | null;
  audioUrl: string | null;
  isPlaying: boolean;
  isLoading: boolean;
}

interface VoiceComparisonProps {
  availableVoices: Voice[];
  testText: string;
  onTextChange: (text: string) => void;
}

export const VoiceComparison: React.FC<VoiceComparisonProps> = ({
  availableVoices,
  testText,
  onTextChange,
}) => {
  const [slots, setSlots] = useState<ComparisonSlot[]>([
    { voice: null, audioUrl: null, isPlaying: false, isLoading: false },
    { voice: null, audioUrl: null, isPlaying: false, isLoading: false },
    { voice: null, audioUrl: null, isPlaying: false, isLoading: false },
    { voice: null, audioUrl: null, isPlaying: false, isLoading: false },
  ]);

  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  // Generate audio for a specific slot
  const generateAudio = async (slotIndex: number) => {
    const slot = slots[slotIndex];
    if (!slot.voice || !testText.trim()) {
      showToast.error('Please select a voice and enter text');
      return;
    }

    // Update loading state
    setSlots(prev => prev.map((s, i) => 
      i === slotIndex ? { ...s, isLoading: true } : s
    ));

    try {
      const formData = new FormData();
      formData.append('text', testText);
      formData.append('voice_id', slot.voice.id);
      formData.append('language', 'en');

      const response = await fetch('https://yaya5777-voxly-tts.hf.space/synthesize', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('voxly_token')}`,
        },
      });

      if (!response.ok) throw new Error('Synthesis failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      setSlots(prev => prev.map((s, i) => 
        i === slotIndex ? { ...s, audioUrl, isLoading: false } : s
      ));

      showToast.success(`Generated voice: ${slot.voice.name}`);
    } catch (error) {
      console.error('Generation error:', error);
      showToast.error('Failed to generate audio');
      setSlots(prev => prev.map((s, i) => 
        i === slotIndex ? { ...s, isLoading: false } : s
      ));
    }
  };

  // Generate all voices at once
  const generateAll = async () => {
    const validSlots = slots
      .map((slot, index) => ({ slot, index }))
      .filter(({ slot }) => slot.voice !== null);

    if (validSlots.length === 0) {
      showToast.error('Please select at least one voice');
      return;
    }

    if (!testText.trim()) {
      showToast.error('Please enter text to synthesize');
      return;
    }

    showToast.info(`Generating ${validSlots.length} voices...`);

    // Generate all in parallel for SPEED
    await Promise.all(
      validSlots.map(({ index }) => generateAudio(index))
    );

    showToast.success('All voices generated! 🎉');
  };

  // Play/pause audio for a slot
  const togglePlay = (slotIndex: number) => {
    const audio = audioRefs.current[slotIndex];
    if (!audio) return;

    if (slots[slotIndex].isPlaying) {
      audio.pause();
      setSlots(prev => prev.map((s, i) => 
        i === slotIndex ? { ...s, isPlaying: false } : s
      ));
    } else {
      // Pause all other audio
      audioRefs.current.forEach((a, i) => {
        if (a && i !== slotIndex) {
          a.pause();
        }
      });
      setSlots(prev => prev.map((s, i) => ({ ...s, isPlaying: i === slotIndex })));
      
      audio.play();
    }
  };

  // Download audio
  const downloadAudio = (slotIndex: number) => {
    const slot = slots[slotIndex];
    if (!slot.audioUrl || !slot.voice) return;

    const a = document.createElement('a');
    a.href = slot.audioUrl;
    a.download = `${slot.voice.name.replace(/\s+/g, '_')}_comparison.wav`;
    a.click();
    showToast.success('Download started!');
  };

  // Remove voice from slot
  const removeVoice = (slotIndex: number) => {
    setSlots(prev => prev.map((s, i) => 
      i === slotIndex 
        ? { voice: null, audioUrl: null, isPlaying: false, isLoading: false }
        : s
    ));
  };

  // Select voice for slot
  const selectVoice = (slotIndex: number, voice: Voice) => {
    setSlots(prev => prev.map((s, i) => 
      i === slotIndex 
        ? { ...s, voice, audioUrl: null }
        : s
    ));
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Voice Comparison</h2>
        <button
          onClick={generateAll}
          className="glass-button px-6 py-2 rounded-lg neon-glow"
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
          }}
        >
          Generate All ⚡
        </button>
      </div>

      {/* Test Text Input */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Test Text (Same for all voices)</label>
        <textarea
          value={testText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter text to compare across voices..."
          className="w-full glass-card px-4 py-3 rounded-xl min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500"
          maxLength={500}
        />
        <p className="text-sm text-gray-400 mt-1">{testText.length}/500 characters</p>
      </div>

      {/* Comparison Slots */}
      <div className="grid md:grid-cols-2 gap-6">
        {slots.map((slot, index) => (
          <div key={index} className="voice-card-glass p-6">
            {/* Voice Selection */}
            {!slot.voice ? (
              <select
                onChange={(e) => {
                  const voice = availableVoices.find(v => v.id === e.target.value);
                  if (voice) selectVoice(index, voice);
                }}
                className="w-full glass-card px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a voice...</option>
                {availableVoices
                  .filter(v => !slots.some(s => s.voice?.id === v.id))
                  .map(voice => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name} ({voice.gender}, {voice.accent})
                    </option>
                  ))}
              </select>
            ) : (
              <>
                {/* Voice Info */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{slot.voice.name}</h3>
                    <p className="text-sm text-gray-400">
                      {slot.voice.gender} • {slot.voice.accent}
                    </p>
                  </div>
                  <button
                    onClick={() => removeVoice(index)}
                    className="glass-button p-2 rounded-lg hover:bg-red-500/20"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Audio Controls */}
                {slot.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="animate-spin text-purple-400" size={32} />
                    <span className="ml-3 text-gray-400">Generating...</span>
                  </div>
                ) : slot.audioUrl ? (
                  <div className="space-y-3">
                    {/* Waveform Visualization */}
                    <div className="flex items-center justify-center gap-1 h-16 glass-card rounded-lg p-2">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="waveform-bar flex-1 rounded"
                          style={{
                            height: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.1}s`,
                            opacity: slot.isPlaying ? 1 : 0.3,
                          }}
                        />
                      ))}
                    </div>

                    {/* Play/Download Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => togglePlay(index)}
                        className="flex-1 glass-button py-3 rounded-lg flex items-center justify-center gap-2"
                      >
                        {slot.isPlaying ? (
                          <><Pause size={18} /> Pause</>
                        ) : (
                          <><Play size={18} /> Play</>
                        )}
                      </button>
                      <button
                        onClick={() => downloadAudio(index)}
                        className="glass-button px-4 py-3 rounded-lg"
                      >
                        <Download size={18} />
                      </button>
                    </div>

                    {/* Hidden audio element */}
                    <audio
                      ref={(el) => (audioRefs.current[index] = el)}
                      src={slot.audioUrl}
                      onEnded={() => {
                        setSlots(prev => prev.map((s, i) => 
                          i === index ? { ...s, isPlaying: false } : s
                        ));
                      }}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => generateAudio(index)}
                    className="w-full glass-button py-3 rounded-lg"
                  >
                    Generate Audio
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Winner Selection (optional) */}
      {slots.filter(s => s.audioUrl).length >= 2 && (
        <div className="mt-6 glass-card bg-green-500/10 p-4 rounded-xl border border-green-500/30">
          <p className="text-center text-green-200">
            🏆 Compare all voices and pick your favorite!
          </p>
        </div>
      )}
    </div>
  );
};
