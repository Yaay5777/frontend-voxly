import React, { useState } from 'react';
import { Sliders, Zap, Heart, Angry, Smile, Meh } from 'lucide-react';

interface AdvancedControlsProps {
  onControlsChange: (controls: VoiceControls) => void;
}

export interface VoiceControls {
  speed: number;
  pitch: number;
  emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'excited';
  stability: number;
}

const emotions = [
  { value: 'neutral', label: 'Neutral', icon: Meh, color: '#9ca3af' },
  { value: 'happy', label: 'Happy', icon: Smile, color: '#fbbf24' },
  { value: 'excited', label: 'Excited', icon: Zap, color: '#ec4899' },
  { value: 'sad', label: 'Sad', icon: Heart, color: '#3b82f6' },
  { value: 'angry', label: 'Angry', icon: Angry, color: '#ef4444' },
] as const;

export const AdvancedControls: React.FC<AdvancedControlsProps> = ({ onControlsChange }) => {
  const [controls, setControls] = useState<VoiceControls>({
    speed: 1.0,
    pitch: 0,
    emotion: 'neutral',
    stability: 0.5,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateControl = <K extends keyof VoiceControls>(key: K, value: VoiceControls[K]) => {
    const newControls = { ...controls, [key]: value };
    setControls(newControls);
    onControlsChange(newControls);
  };

  return (
    <div className="glass-card p-6 mb-6">
      {/* Toggle Button */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <Sliders size={24} className="text-purple-400" />
          <span className="text-xl font-bold">Advanced Voice Controls</span>
        </div>
        <span className="text-sm text-gray-400">
          {showAdvanced ? 'Hide' : 'Show'}
        </span>
      </button>

      {showAdvanced && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Speed Control */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-semibold flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" />
                Speed
              </label>
              <span className="text-sm font-mono glass-card px-3 py-1 rounded-lg">
                {controls.speed.toFixed(1)}x
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={controls.speed}
                onChange={(e) => updateControl('speed', parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-gradient"
                style={{
                  background: `linear-gradient(90deg, #ec4899 0%, #8b5cf6 ${((controls.speed - 0.5) / 1.5) * 100}%, #374151 ${((controls.speed - 0.5) / 1.5) * 100}%, #374151 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0.5x (Slow)</span>
                <span>1.0x (Normal)</span>
                <span>2.0x (Fast)</span>
              </div>
            </div>
          </div>

          {/* Pitch Control */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-semibold flex items-center gap-2">
                🎵 Pitch
              </label>
              <span className="text-sm font-mono glass-card px-3 py-1 rounded-lg">
                {controls.pitch > 0 ? '+' : ''}{controls.pitch}
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={controls.pitch}
                onChange={(e) => updateControl('pitch', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(90deg, #3b82f6 0%, #8b5cf6 ${((controls.pitch + 12) / 24) * 100}%, #374151 ${((controls.pitch + 12) / 24) * 100}%, #374151 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>-12 (Lower)</span>
                <span>0 (Normal)</span>
                <span>+12 (Higher)</span>
              </div>
            </div>
          </div>

          {/* Emotion Selection */}
          <div>
            <label className="font-semibold mb-3 block">Emotion</label>
            <div className="grid grid-cols-5 gap-3">
              {emotions.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  onClick={() => updateControl('emotion', value)}
                  className={`glass-card p-3 rounded-xl transition-all hover:scale-105 ${
                    controls.emotion === value ? 'neon-glow' : ''
                  }`}
                  style={{
                    borderColor: controls.emotion === value ? color : 'transparent',
                    borderWidth: 2,
                  }}
                >
                  <Icon
                    size={24}
                    className="mx-auto mb-1"
                    style={{ color: controls.emotion === value ? color : '#9ca3af' }}
                  />
                  <span className="text-xs block text-center">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stability Control */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-semibold flex items-center gap-2">
                ⚖️ Stability
              </label>
              <span className="text-sm font-mono glass-card px-3 py-1 rounded-lg">
                {(controls.stability * 100).toFixed(0)}%
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={controls.stability}
                onChange={(e) => updateControl('stability', parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(90deg, #ec4899 0%, #8b5cf6 ${controls.stability * 100}%, #374151 ${controls.stability * 100}%, #374151 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>More Expressive</span>
                <span>More Consistent</span>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="glass-card bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
            <p className="text-sm text-blue-200">
              💡 <strong>Pro Tip:</strong> Lower stability = more emotional variation. 
              Higher stability = more consistent voice (better for professional content).
            </p>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              const defaultControls: VoiceControls = {
                speed: 1.0,
                pitch: 0,
                emotion: 'neutral',
                stability: 0.5,
              };
              setControls(defaultControls);
              onControlsChange(defaultControls);
            }}
            className="glass-button w-full py-2 rounded-lg text-sm"
          >
            Reset to Default
          </button>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
          transition: transform 0.2s;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
          border: none;
          transition: transform 0.2s;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
