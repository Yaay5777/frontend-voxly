// Core Types for Voxly TTS Application
export interface User {
  id: number;
  username: string;
  email?: string;
  tier: 'free' | 'premium';
  weekly_quota: number;
  weekly_used: number;
  quota_cycle_start: number;
  avatar?: string;
}

export interface Voice {
  id: string;
  name: string;
  description: string;
  avatar: string;
  color: string;
  tags: string[];
  sample_text: string;
  type: 'preset' | 'custom' | 'cloned';
  quality: 'high' | 'medium' | 'low';
  languages: string[];
  gender?: 'male' | 'female' | 'unisex' | 'neutral';
  age?: 'young' | 'young_adult' | 'adult' | 'mature' | 'elderly' | 'teenager' | 'ageless';
  accent?: string;
  category?: string;
  personality?: string;
}

export interface AudioFile {
  id: string;
  filename: string;
  url: string;
  duration: number;
  size: number;
  created_at: string;
  voice_id: string;
  text: string;
  language: string;
}

export interface SynthesisRequest {
  text: string;
  voice_id: string;
  language: string;
  speed?: number;
  pitch?: number;
  emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm';
}

export interface SynthesisResponse {
  success: boolean;
  audio_url?: string;
  job_id?: string;
  message?: string;
  error?: string;
}

export interface QuotaInfo {
  current_usage: number;
  weekly_limit: number;
  reset_date: string;
  tier: 'free' | 'premium';
  percentage_used: number;
}

export interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

export interface AudioVisualization {
  frequencies: number[];
  amplitude: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export interface Avatar3D {
  geometry: 'sphere' | 'cube' | 'torus' | 'octahedron';
  material: 'glass' | 'metal' | 'neon' | 'hologram';
  animation: 'float' | 'rotate' | 'pulse' | 'wave';
  particles: boolean;
  color: string;
  intensity: number;
}

export interface AnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
}

export interface GlassmorphismStyle {
  blur: number;
  opacity: number;
  border: boolean;
  shadow: boolean;
  gradient: boolean;
}
