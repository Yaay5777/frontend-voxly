import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, useSpringValue } from '@react-spring/three';
import { useGesture } from '@use-gesture/react';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { 
  VoiceAvatar3D, 
  Scene3D, 
  AudioVisualization3D, 
  Scene3DStore, 
  AudioStore3D,
  Performance3D,
  Interactive3D 
} from '../types/3d';

// 3D Scene Store
export const useScene3DStore = create<Scene3DStore>()(
  subscribeWithSelector((set, get) => ({
    currentScene: null,
    avatars: [],
    activeAvatar: null,
    audioContext: null,
    isVREnabled: false,
    isAREnabled: false,
    performance: {
      lod: { enabled: true, levels: [] },
      culling: { frustum: true, occlusion: false, distance: 100 },
      shadows: { enabled: true, type: 'pcf', mapSize: 1024 },
      antialiasing: { enabled: true, type: 'msaa', samples: 4 }
    },

    setScene: (scene) => set({ currentScene: scene }),
    addAvatar: (avatar) => set((state) => ({ 
      avatars: [...state.avatars, avatar] 
    })),
    removeAvatar: (id) => set((state) => ({ 
      avatars: state.avatars.filter(a => a.id !== id) 
    })),
    setActiveAvatar: (id) => set({ activeAvatar: id }),
    updateAvatarAnimation: (id, animation) => set((state) => ({
      avatars: state.avatars.map(avatar => 
        avatar.id === id 
          ? { ...avatar, currentAnimation: animation }
          : avatar
      )
    })),
    toggleVR: () => set((state) => ({ isVREnabled: !state.isVREnabled })),
    toggleAR: () => set((state) => ({ isAREnabled: !state.isAREnabled })),
    updatePerformance: (settings) => set((state) => ({
      performance: { ...state.performance, ...settings }
    }))
  }))
);

// Audio 3D Store
export const useAudio3DStore = create<AudioStore3D>()(
  subscribeWithSelector((set, get) => ({
    analyser: null,
    dataArray: null,
    isPlaying: false,
    volume: 0.5,
    frequency: 0,

    initializeAudio: (audioElement) => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioElement);
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const buffer = new ArrayBuffer(bufferLength * 4); // 4 bytes per float
      const dataArray = new Float32Array(buffer);
      
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      set({ analyser, dataArray });
    },

    updateAudioData: () => {
      const { analyser, dataArray } = get();
      if (analyser && dataArray) {
        try {
          // Create a new Float32Array with proper ArrayBuffer type for Web Audio API
          const bufferLength = analyser.frequencyBinCount;
          const audioData = new Float32Array(new ArrayBuffer(bufferLength * 4));
          analyser.getFloatFrequencyData(audioData);
          const average = audioData.reduce((sum, value) => sum + value, 0) / audioData.length;
          set({ frequency: Math.abs(average) });
        } catch (error) {
          console.warn('Audio data update failed:', error);
        }
      }
    },

    setVolume: (volume) => set({ volume }),
    cleanup: () => set({ analyser: null, dataArray: null, isPlaying: false })
  }))
);

// Custom 3D Hooks

// Hook for 3D Avatar Management
export const useAvatar3D = (voiceId: string) => {
  const { avatars, activeAvatar, setActiveAvatar, updateAvatarAnimation } = useScene3DStore();
  const avatar = avatars.find(a => a.id === voiceId);
  const isActive = activeAvatar === voiceId;

  const activate = useCallback(() => {
    setActiveAvatar(voiceId);
  }, [voiceId, setActiveAvatar]);

  const playAnimation = useCallback((animationName: string) => {
    updateAvatarAnimation(voiceId, animationName);
  }, [voiceId, updateAvatarAnimation]);

  return {
    avatar,
    isActive,
    activate,
    playAnimation
  };
};

// Hook for Audio Visualization
export const useAudioVisualization = (audioElement?: HTMLAudioElement) => {
  const { initializeAudio, updateAudioData, analyser, dataArray, frequency } = useAudio3DStore();
  const animationRef = useRef<number>();

  useEffect(() => {
    if (audioElement) {
      initializeAudio(audioElement);
    }
  }, [audioElement, initializeAudio]);

  useEffect(() => {
    const animate = () => {
      updateAudioData();
      animationRef.current = requestAnimationFrame(animate);
    };

    if (analyser) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, updateAudioData]);

  return {
    frequency,
    dataArray,
    isInitialized: !!analyser
  };
};

// Hook for 3D Interactions
export const useInteractive3D = (config: Interactive3D) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Spring animations for interactions
  const { scale, rotation } = useSpring({
    scale: isHovered ? config.hover.scale : 1,
    rotation: isHovered ? [
      config.hover.rotation.x,
      config.hover.rotation.y,
      config.hover.rotation.z
    ] : [0, 0, 0],
    config: { tension: 300, friction: 10 }
  });

  // Gesture handling
  const bind = useGesture({
    onHover: ({ hovering }) => {
      if (config.hover.enabled) {
        setIsHovered(hovering || false);
      }
    },
    onClick: () => {
      if (config.click.enabled) {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 200);
      }
    },
    onDrag: ({ offset: [x, y] }) => {
      if (config.drag.enabled && meshRef.current) {
        if (config.drag.constraints.x) meshRef.current.position.x = x * 0.01;
        if (config.drag.constraints.y) meshRef.current.position.y = -y * 0.01;
      }
    }
  });

  return {
    meshRef,
    bind,
    scale,
    rotation,
    isHovered,
    isClicked
  };
};

// Hook for 3D Scene Management
export const useScene3D = () => {
  const { camera, scene, gl } = useThree();
  const { currentScene, performance } = useScene3DStore();
  
  // Performance optimization
  useEffect(() => {
    if (performance.shadows.enabled) {
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    // Note: antialias is set during renderer creation, not runtime
    // This is handled in the Canvas component's gl prop
  }, [gl, performance]);

  // LOD Management
  const setupLOD = useCallback((object: THREE.Object3D, distances: number[]) => {
    const lod = new THREE.LOD();
    distances.forEach((distance, index) => {
      lod.addLevel(object.clone(), distance);
    });
    return lod;
  }, []);

  return {
    camera,
    scene,
    renderer: gl,
    currentScene,
    setupLOD
  };
};

// Hook for Particle Effects
export const useParticles3D = (count: number, config: any) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { frequency } = useAudio3DStore();
  
  const particles = useMemo(() => {
    const temp = new THREE.Object3D();
    const particles = [];
    
    for (let i = 0; i < count; i++) {
      particles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ),
        scale: Math.random() * 0.5 + 0.5,
        life: Math.random()
      });
    }
    
    return particles;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const temp = new THREE.Object3D();
    
    particles.forEach((particle, index) => {
      // Update particle physics
      particle.position.add(particle.velocity);
      particle.life -= delta * 0.5;
      
      // Audio reactivity
      const audioScale = 1 + frequency * 0.1;
      
      // Reset particle if dead
      if (particle.life <= 0) {
        particle.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );
        particle.life = 1;
      }
      
      // Update instance matrix
      temp.position.copy(particle.position);
      temp.scale.setScalar(particle.scale * audioScale);
      temp.updateMatrix();
      
      meshRef.current!.setMatrixAt(index, temp.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return { meshRef, particles };
};

// Hook for 3D Text Animation
export const useText3D = (text: string, config: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<TextGeometry | null>(null);

  useEffect(() => {
    // Load font and create text geometry
    const loader = new FontLoader();
    loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: config.size || 1,
        height: config.height || 0.1,
        curveSegments: config.curveSegments || 12,
        bevelEnabled: config.bevel || false,
        bevelThickness: config.bevelThickness || 0.03,
        bevelSize: config.bevelSize || 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      });
      
      textGeometry.computeBoundingBox();
      textGeometry.translate(
        -textGeometry.boundingBox!.max.x * 0.5,
        -textGeometry.boundingBox!.max.y * 0.5,
        -textGeometry.boundingBox!.max.z * 0.5
      );
      
      setGeometry(textGeometry);
    });
  }, [text, config]);

  return { meshRef, geometry };
};

// Hook for Camera Controls
export const useCameraControls = () => {
  const { camera } = useThree();
  const [target, setTarget] = useState(new THREE.Vector3(0, 0, 0));
  
  const focusOn = useCallback((position: THREE.Vector3, smooth = true) => {
    if (smooth) {
      // Smooth camera transition
      const startPosition = camera.position.clone();
      const startTime = Date.now();
      const duration = 1000; // 1 second
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        camera.position.lerpVectors(startPosition, position, eased);
        camera.lookAt(target);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    } else {
      camera.position.copy(position);
      camera.lookAt(target);
    }
  }, [camera, target]);

  const setLookAt = useCallback((newTarget: THREE.Vector3) => {
    setTarget(newTarget);
    camera.lookAt(newTarget);
  }, [camera]);

  return {
    focusOn,
    setLookAt,
    target
  };
};

// Hook for Performance Monitoring
export const usePerformance3D = () => {
  const [fps, setFps] = useState(60);
  const [drawCalls, setDrawCalls] = useState(0);
  const [triangles, setTriangles] = useState(0);
  const { gl } = useThree();
  
  useFrame(() => {
    // Monitor performance metrics
    setDrawCalls(gl.info.render.calls);
    setTriangles(gl.info.render.triangles);
  });

  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frames * 1000) / (currentTime - lastTime)));
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    measureFPS();
  }, []);

  return {
    fps,
    drawCalls,
    triangles,
    memory: gl.info.memory
  };
};
