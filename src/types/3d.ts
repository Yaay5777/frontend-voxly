import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ReactThreeFiber } from '@react-three/fiber';

// Extend Three.js types for React Three Fiber
declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
    }
  }
}

// Voice Avatar 3D Types
export interface VoiceAvatar3D {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  modelUrl?: string;
  animations: Animation3D[];
  materials: Material3D[];
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  personality: AvatarPersonality;
}

export interface Animation3D {
  name: string;
  type: 'idle' | 'speaking' | 'listening' | 'thinking' | 'excited' | 'calm';
  duration: number;
  loop: boolean;
  intensity: number;
}

export interface Material3D {
  name: string;
  type: 'standard' | 'physical' | 'toon' | 'shader';
  color: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  transparent?: boolean;
  opacity?: number;
}

export interface AvatarPersonality {
  energy: number; // 0-1
  friendliness: number; // 0-1
  professionalism: number; // 0-1
  creativity: number; // 0-1
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  particleEffects: ParticleEffect[];
}

export interface ParticleEffect {
  type: 'sparkles' | 'energy' | 'sound_waves' | 'magic' | 'tech' | 'nature';
  count: number;
  size: number;
  speed: number;
  color: string;
  opacity: number;
  lifetime: number;
}

// 3D Scene Types
export interface Scene3D {
  id: string;
  name: string;
  environment: Environment3D;
  lighting: Lighting3D;
  camera: Camera3D;
  postProcessing: PostProcessing3D;
  interactive: boolean;
}

export interface Environment3D {
  type: 'studio' | 'space' | 'nature' | 'cyber' | 'minimal' | 'futuristic';
  skybox?: string;
  fog?: {
    color: string;
    near: number;
    far: number;
  };
  ground?: {
    type: 'plane' | 'infinite' | 'custom';
    material: Material3D;
  };
}

export interface Lighting3D {
  ambient: {
    color: string;
    intensity: number;
  };
  directional: {
    color: string;
    intensity: number;
    position: THREE.Vector3;
    castShadow: boolean;
  };
  point: PointLight3D[];
  spot: SpotLight3D[];
}

export interface PointLight3D {
  color: string;
  intensity: number;
  position: THREE.Vector3;
  distance: number;
  decay: number;
}

export interface SpotLight3D {
  color: string;
  intensity: number;
  position: THREE.Vector3;
  target: THREE.Vector3;
  angle: number;
  penumbra: number;
  distance: number;
  decay: number;
}

export interface Camera3D {
  type: 'perspective' | 'orthographic';
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov?: number;
  near: number;
  far: number;
  controls: {
    enabled: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableZoom: boolean;
    enablePan: boolean;
    minDistance: number;
    maxDistance: number;
  };
}

export interface PostProcessing3D {
  bloom: {
    enabled: boolean;
    intensity: number;
    threshold: number;
    radius: number;
  };
  chromaticAberration: {
    enabled: boolean;
    offset: number;
  };
  vignette: {
    enabled: boolean;
    darkness: number;
    offset: number;
  };
  glitch: {
    enabled: boolean;
    strength: number;
  };
  pixelation: {
    enabled: boolean;
    granularity: number;
  };
}

// Audio Visualization Types
export interface AudioVisualization3D {
  type: 'waveform' | 'spectrum' | 'circular' | 'sphere' | 'particles' | 'mesh';
  sensitivity: number;
  smoothing: number;
  color: {
    start: string;
    end: string;
  };
  animation: {
    speed: number;
    amplitude: number;
    frequency: number;
  };
  reactive: {
    scale: boolean;
    rotation: boolean;
    color: boolean;
    particles: boolean;
  };
}

// Interactive 3D Elements
export interface Interactive3D {
  hover: {
    enabled: boolean;
    scale: number;
    rotation: THREE.Euler;
    color?: string;
    glow?: boolean;
  };
  click: {
    enabled: boolean;
    animation: Animation3D;
    sound?: string;
    haptic?: boolean;
  };
  drag: {
    enabled: boolean;
    constraints: {
      x: boolean;
      y: boolean;
      z: boolean;
    };
    bounds?: {
      min: THREE.Vector3;
      max: THREE.Vector3;
    };
  };
}

// VR/AR Types
export interface XRConfig {
  vr: {
    enabled: boolean;
    controllers: boolean;
    handTracking: boolean;
    roomScale: boolean;
  };
  ar: {
    enabled: boolean;
    planeDetection: boolean;
    lightEstimation: boolean;
    occlusionMesh: boolean;
  };
}

// Performance Types
export interface Performance3D {
  lod: {
    enabled: boolean;
    levels: LODLevel[];
  };
  culling: {
    frustum: boolean;
    occlusion: boolean;
    distance: number;
  };
  shadows: {
    enabled: boolean;
    type: 'basic' | 'pcf' | 'pcfsoft' | 'vsm';
    mapSize: number;
  };
  antialiasing: {
    enabled: boolean;
    type: 'msaa' | 'fxaa' | 'smaa' | 'taa';
    samples: number;
  };
}

export interface LODLevel {
  distance: number;
  geometry: string;
  material: string;
  visible: boolean;
}

// Animation System Types
export interface AnimationSystem3D {
  mixer: THREE.AnimationMixer;
  actions: Map<string, THREE.AnimationAction>;
  currentAction?: THREE.AnimationAction;
  transitions: AnimationTransition[];
}

export interface AnimationTransition {
  from: string;
  to: string;
  duration: number;
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

// Shader Types
export interface CustomShader {
  name: string;
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [key: string]: THREE.IUniform };
  transparent?: boolean;
  side?: THREE.Side;
}

// Component Props Types
export interface Avatar3DProps {
  voice: VoiceAvatar3D;
  isActive: boolean;
  isSpeaking: boolean;
  audioData?: Float32Array;
  onInteraction?: (type: string, data: any) => void;
  performance?: Performance3D;
}

export interface Scene3DProps {
  scene: Scene3D;
  children?: React.ReactNode;
  onLoad?: () => void;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
}

export interface AudioVisualizer3DProps {
  audioData: Float32Array;
  config: AudioVisualization3D;
  isPlaying: boolean;
  volume: number;
}

// Store Types for 3D State Management
export interface Scene3DStore {
  currentScene: Scene3D | null;
  avatars: VoiceAvatar3D[];
  activeAvatar: string | null;
  audioContext: AudioContext | null;
  isVREnabled: boolean;
  isAREnabled: boolean;
  performance: Performance3D;
  
  // Actions
  setScene: (scene: Scene3D) => void;
  addAvatar: (avatar: VoiceAvatar3D) => void;
  removeAvatar: (id: string) => void;
  setActiveAvatar: (id: string) => void;
  updateAvatarAnimation: (id: string, animation: string) => void;
  toggleVR: () => void;
  toggleAR: () => void;
  updatePerformance: (settings: Partial<Performance3D>) => void;
}

export interface AudioStore3D {
  analyser: AnalyserNode | null;
  dataArray: Float32Array | null;
  isPlaying: boolean;
  volume: number;
  frequency: number;
  
  // Actions
  initializeAudio: (audioElement: HTMLAudioElement) => void;
  updateAudioData: () => void;
  setVolume: (volume: number) => void;
  cleanup: () => void;
}
