import React, { 
  useRef, 
  useEffect, 
  useMemo, 
  useCallback, 
  Suspense, 
  useState,
  memo
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated, config } from '@react-spring/three';
import { 
  Sphere, 
  Line, 
  Trail,
  MeshDistortMaterial,
  Float,
  Text,
  Sparkles,
  Stars,
  Environment,
  Instances,
  Instance,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import type { Line2 } from 'three/examples/jsm/lines/Line2.js';
import type { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';

// Production-safe imports with fallbacks
let EffectComposer: any, Bloom: any, ChromaticAberration: any, Glitch: any;
try {
  const postprocessing = require('@react-three/postprocessing');
  EffectComposer = postprocessing.EffectComposer;
  Bloom = postprocessing.Bloom;
  ChromaticAberration = postprocessing.ChromaticAberration;
  Glitch = postprocessing.Glitch;
} catch (error) {
  console.warn('Postprocessing effects not available:', error);
}

// Safe hook imports with fallbacks
let useAudioVisualization: any, useParticles3D: any;
try {
  const hooks = require('../hooks/use3D');
  useAudioVisualization = hooks.useAudioVisualization || (() => ({ dataArray: null, isInitialized: false, frequency: 0 }));
  useParticles3D = hooks.useParticles3D || (() => ({ meshRef: { current: null } }));
} catch (error) {
  console.warn('3D hooks not available, using fallbacks:', error);
  useAudioVisualization = () => ({ dataArray: null, isInitialized: false, frequency: 0 });
  useParticles3D = () => ({ meshRef: { current: null } });
}

// Enhanced interface with better typing
interface AudioVisualizer3DProps {
  audioElement?: HTMLAudioElement | null;
  isPlaying: boolean;
  type?: 'waveform' | 'spectrum' | 'circular' | 'sphere' | 'particles' | 'neural' | 'galaxy' | 'dna';
  color?: string;
  intensity?: number;
  size?: number;
  enableEffects?: boolean;
  enableParticles?: boolean;
  quality?: 'low' | 'medium' | 'high';
  enablePostProcessing?: boolean;
  enablePerformanceMonitoring?: boolean;
}

// Performance metrics interface
interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
}

// Advanced color palette generator
const generateColorPalette = (baseColor: string, count: number = 5): string[] => {
  try {
    const color = new THREE.Color(baseColor);
    const hsl = { h: 0, s: 0, l: 0 };
    color.getHSL(hsl);
    
    return Array.from({ length: count }, (_, i) => {
      const hue = (hsl.h + (i * 0.2)) % 1;
      const saturation = Math.max(0.3, hsl.s - (i * 0.1));
      const lightness = Math.min(0.9, hsl.l + (i * 0.1));
      return new THREE.Color().setHSL(hue, saturation, lightness).getStyle();
    });
  } catch (error) {
    console.warn('Color generation failed, using fallback:', error);
    return [baseColor, '#ffffff', '#ff6b6b', '#4ecdc4', '#45b7d1'];
  }
};

// Error Boundary Component
class AudioVisualizerErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('AudioVisualizer3D Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <mesh>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ff6b6b" wireframe />
        </mesh>
      );
    }

    return this.props.children;
  }
}

// Fallback components for production safety
const VisualizerErrorFallback: React.FC<{ color: string }> = ({ color }) => (
  <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
    <mesh>
      <sphereGeometry args={[1]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.3}
        wireframe
      />
    </mesh>
    <Html position={[0, -2, 0]} center>
      <div style={{ color: 'white', textAlign: 'center', fontSize: '14px' }}>
        Visualizer Error
      </div>
    </Html>
  </Float>
);

const VisualizerLoadingFallback: React.FC<{ color: string }> = ({ color }) => (
  <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
    <mesh>
      <sphereGeometry args={[0.8]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.6}
        wireframe
      />
    </mesh>
    <Html position={[0, -2, 0]} center>
      <div style={{ color: 'white', textAlign: 'center', fontSize: '14px' }}>
        Loading Visualizer...
      </div>
    </Html>
  </Float>
);

// Performance monitoring hook
const usePerformanceMonitor = () => {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frameCount.current++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime.current >= 1000) {
      setFps(frameCount.current);
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  });

  return fps;
};

// Enhanced Waveform Visualizer with Trails and Effects
const WaveformVisualizer3D: React.FC<{ 
  audioData: Float32Array | null; 
  color: string; 
  intensity: number;
  quality: 'low' | 'medium' | 'high';
}> = memo(({ audioData, color, intensity, quality }) => {
  const trailRef = useRef<THREE.Group>(null);
  const [colorPalette] = useState(() => generateColorPalette(color));
  
  const pointCount = useMemo(() => {
    switch (quality) {
      case 'low': return 64;
      case 'medium': return 128;
      case 'high': return 256;
      default: return 128;
    }
  }, [quality]);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < pointCount; i++) {
      pts.push(new THREE.Vector3((i - pointCount / 2) * 0.05, 0, 0));
    }
    return pts;
  }, [pointCount]);

  const trailPoints = useMemo(() => {
    return Array.from({ length: 5 }, () => [...points]);
  }, [points]);

  // Update points based on audio data
  const animatedPoints = useMemo(() => {
    if (!audioData) return points;
    
    return points.map((point, i) => {
      const amplitude = i < audioData.length ? Math.max(0, (audioData[i] + 140) / 140) : 0;
      return new THREE.Vector3(point.x, amplitude * intensity * 3, point.z);
    });
  }, [audioData, points, intensity]);

  useFrame((state) => {
    if (!audioData) return;

    try {
      const time = state.clock.elapsedTime;

      // Animate trail effect
      if (trailRef.current) {
        trailRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
      }
    } catch (error) {
      console.warn('Waveform animation error:', error);
    }
  });

  return (
    <group ref={trailRef}>
      <Trail
        width={2}
        length={10}
        color={colorPalette[0]}
        attenuation={(t) => t * t}
      >
        <Line
          points={animatedPoints}
          color={color}
          lineWidth={quality === 'high' ? 4 : 3}
          transparent
          opacity={0.9}
        />
      </Trail>
      
      {/* Additional glow effect */}
      <Line
        points={animatedPoints}
        color={color}
        lineWidth={quality === 'high' ? 8 : 6}
        transparent
        opacity={0.3}
      />
      
      {/* Sparkle particles at peaks */}
      <Sparkles
        count={quality === 'high' ? 50 : 25}
        scale={[10, 2, 1]}
        size={2}
        speed={0.5}
        color={colorPalette[1]}
      />
    </group>
  );
});

// Neural Network Visualizer (New Creative Type)
const NeuralVisualizer3D: React.FC<{
  audioData: Float32Array | null;
  color: string;
  intensity: number;
}> = memo(({ audioData, color, intensity }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [colorPalette] = useState(() => generateColorPalette(color));
  
  const nodes = useMemo(() => {
    const nodeArray = [];
    for (let layer = 0; layer < 4; layer++) {
      for (let node = 0; node < 8; node++) {
        nodeArray.push({
          position: [
            (layer - 1.5) * 3,
            (node - 3.5) * 0.8,
            Math.sin(layer + node) * 0.5
          ] as [number, number, number],
          connections: layer < 3 ? Array.from({ length: 8 }, (_, i) => i) : []
        });
      }
    }
    return nodeArray;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !audioData) return;

    const time = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((child, i) => {
      if (i < audioData.length) {
        const amplitude = (audioData[i % audioData.length] + 140) / 140;
        const pulse = Math.sin(time * 3 + i * 0.5) * 0.3;
        child.scale.setScalar(0.5 + amplitude * intensity * 0.5 + pulse);
        
        // Dynamic color based on activity
        const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (material) {
          const colorIndex = Math.floor(amplitude * colorPalette.length);
          material.color.set(colorPalette[colorIndex] || color);
          material.emissiveIntensity = amplitude * intensity * 0.8;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Neural connections */}
      {nodes.map((node, i) => 
        node.connections.map((connection, j) => {
          const nextLayer = Math.floor(i / 8) + 1;
          const targetIndex = nextLayer * 8 + connection;
          if (targetIndex < nodes.length) {
            return (
              <Line
                key={`${i}-${j}`}
                points={[node.position, nodes[targetIndex].position]}
                color={colorPalette[2]}
                lineWidth={1}
                transparent
                opacity={0.4}
              />
            );
          }
          return null;
        })
      )}
    </group>
  );
});

// Galaxy Visualizer (New Creative Type)
const GalaxyVisualizer3D: React.FC<{
  audioData: Float32Array | null;
  color: string;
  intensity: number;
}> = memo(({ audioData, color, intensity }) => {
  const galaxyRef = useRef<THREE.Group>(null);
  const [colorPalette] = useState(() => generateColorPalette(color));
  
  const stars = useMemo(() => {
    return Array.from({ length: 1000 }, (_, i) => {
      const radius = Math.random() * 8 + 2;
      const angle = (i / 1000) * Math.PI * 4;
      const spiral = i * 0.01;
      
      return {
        position: [
          Math.cos(angle + spiral) * radius,
          (Math.random() - 0.5) * 2,
          Math.sin(angle + spiral) * radius
        ] as [number, number, number],
        size: Math.random() * 0.05 + 0.02,
        speed: Math.random() * 0.02 + 0.01
      };
    });
  }, []);

  useFrame((state) => {
    if (!galaxyRef.current || !audioData) return;

    const time = state.clock.elapsedTime;
    const avgAmplitude = audioData.reduce((sum, val) => sum + Math.max(0, (val + 140) / 140), 0) / audioData.length;
    
    galaxyRef.current.rotation.y = time * 0.1 * (1 + avgAmplitude * intensity);
    galaxyRef.current.scale.setScalar(1 + avgAmplitude * intensity * 0.3);
  });

  return (
    <group ref={galaxyRef}>
      <Instances limit={1000}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={color} />
        {stars.map((star, i) => (
          <Instance
            key={i}
            position={star.position}
            scale={[star.size, star.size, star.size]}
            color={colorPalette[i % colorPalette.length]}
          />
        ))}
      </Instances>
      
      {/* Central black hole effect */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Accretion disk */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 2, 64]} />
        <meshBasicMaterial
          color={colorPalette[0]}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
});

// DNA Helix Visualizer (New Creative Type)
const DNAVisualizer3D: React.FC<{
  audioData: Float32Array | null;
  color: string;
  intensity: number;
}> = memo(({ audioData, color, intensity }) => {
  const dnaRef = useRef<THREE.Group>(null);
  const [colorPalette] = useState(() => generateColorPalette(color));
  
  const helixPoints = useMemo(() => {
    const points1: THREE.Vector3[] = [];
    const points2: THREE.Vector3[] = [];
    const connections: [THREE.Vector3, THREE.Vector3][] = [];
    
    for (let i = 0; i < 100; i++) {
      const y = (i - 50) * 0.1;
      const angle = i * 0.2;
      const radius = 1.5;
      
      const point1 = new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      );
      
      const point2 = new THREE.Vector3(
        Math.cos(angle + Math.PI) * radius,
        y,
        Math.sin(angle + Math.PI) * radius
      );
      
      points1.push(point1);
      points2.push(point2);
      
      if (i % 5 === 0) {
        connections.push([point1, point2]);
      }
    }
    
    return { points1, points2, connections };
  }, []);

  useFrame((state) => {
    if (!dnaRef.current || !audioData) return;

    const time = state.clock.elapsedTime;
    const avgAmplitude = audioData.reduce((sum, val) => sum + Math.max(0, (val + 140) / 140), 0) / audioData.length;
    
    dnaRef.current.rotation.y = time * 0.5 * (1 + avgAmplitude * intensity);
    dnaRef.current.scale.y = 1 + Math.sin(time * 2) * 0.2 * avgAmplitude * intensity;
  });

  return (
    <group ref={dnaRef}>
      {/* First helix strand */}
      <Line
        points={helixPoints.points1}
        color={colorPalette[0]}
        lineWidth={3}
        transparent
        opacity={0.8}
      />
      
      {/* Second helix strand */}
      <Line
        points={helixPoints.points2}
        color={colorPalette[1]}
        lineWidth={3}
        transparent
        opacity={0.8}
      />
      
      {/* Base pair connections */}
      {helixPoints.connections.map((connection, i) => (
        <Line
          key={i}
          points={connection}
          color={colorPalette[2]}
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      ))}
      
      {/* Nucleotide spheres */}
      {helixPoints.points1.map((point, i) => (
        <React.Fragment key={i}>
          <mesh position={point.toArray()}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={colorPalette[i % 4]}
              emissive={colorPalette[i % 4]}
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={helixPoints.points2[i].toArray()}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={colorPalette[(i + 2) % 4]}
              emissive={colorPalette[(i + 2) % 4]}
              emissiveIntensity={0.3}
            />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
});

// Enhanced Spectrum Analyzer with Instancing
const SpectrumVisualizer3D: React.FC<{ 
  audioData: Float32Array | null; 
  color: string; 
  intensity: number;
  quality: 'low' | 'medium' | 'high';
}> = memo(({ audioData, color, intensity, quality }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [colorPalette] = useState(() => generateColorPalette(color));
  
  const barCount = useMemo(() => {
    switch (quality) {
      case 'low': return 32;
      case 'medium': return 64;
      case 'high': return 128;
      default: return 64;
    }
  }, [quality]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current || !audioData) return;

    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < barCount; i++) {
      const amplitude = i < audioData.length ? Math.max(0, (audioData[i] + 140) / 140) : 0;
      const height = Math.max(0.1, amplitude * intensity * 8);
      const wave = Math.sin(time * 2 + i * 0.1) * 0.1;
      
      dummy.position.set((i - barCount / 2) * 0.2, height / 2 + wave, 0);
      dummy.scale.set(1, height, 1);
      dummy.rotation.y = Math.sin(time + i * 0.1) * 0.1;
      
      // Dynamic color
      const colorIndex = Math.floor(amplitude * colorPalette.length);
      const barColor = new THREE.Color(colorPalette[colorIndex] || color);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, barColor);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, barCount]}>
      <boxGeometry args={[0.15, 1, 0.15]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        metalness={0.6}
        roughness={0.3}
      />
    </instancedMesh>
  );
});

// Enhanced Circular Spectrum Visualizer
const CircularVisualizer3D: React.FC<{ 
  audioData: Float32Array | null; 
  color: string; 
  intensity: number;
  quality: 'low' | 'medium' | 'high';
}> = memo(({ audioData, color, intensity, quality }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [colorPalette] = useState(() => generateColorPalette(color));
  
  const barCount = useMemo(() => {
    switch (quality) {
      case 'low': return 32;
      case 'medium': return 64;
      case 'high': return 128;
      default: return 64;
    }
  }, [quality]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const radius = 5;

  useFrame((state) => {
    if (!meshRef.current || !audioData) return;

    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const amplitude = i < audioData.length ? Math.max(0, (audioData[i] + 140) / 140) : 0;
      const height = Math.max(0.1, amplitude * intensity * 6);
      
      const x = Math.cos(angle + time * 0.2) * radius;
      const z = Math.sin(angle + time * 0.2) * radius;
      const y = height / 2;
      
      dummy.position.set(x, y, z);
      dummy.scale.set(1, height, 1);
      dummy.rotation.set(0, angle + time * 0.1, 0);
      
      // Dynamic color based on amplitude
      const colorIndex = Math.floor(amplitude * colorPalette.length);
      const barColor = new THREE.Color(colorPalette[colorIndex] || color);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, barColor);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, barCount]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.2}
        />
      </instancedMesh>
      
      {/* Central energy core */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={colorPalette[0]}
          emissive={colorPalette[0]}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
});

// Enhanced Sphere Audio Visualizer
const SphereVisualizer3D: React.FC<{ 
  audioData: Float32Array | null; 
  color: string; 
  intensity: number;
  quality: 'low' | 'medium' | 'high';
}> = memo(({ audioData, color, intensity, quality }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [colorPalette] = useState(() => generateColorPalette(color));
  const [frequency, setFrequency] = useState(0);

  // Calculate average frequency from audio data
  useEffect(() => {
    if (audioData) {
      const avg = audioData.reduce((sum, val) => sum + Math.max(0, (val + 140) / 140), 0) / audioData.length;
      setFrequency(avg);
    }
  }, [audioData]);

  const { scale, distortion } = useSpring({
    scale: frequency > 0 ? 1 + (frequency * intensity * 0.5) : 1,
    distortion: frequency > 0 ? frequency * intensity * 2 : 0.3,
    config: config.wobbly
  });

  const sphereDetail = useMemo(() => {
    switch (quality) {
      case 'low': return [1.5, 32, 32] as [number, number, number];
      case 'medium': return [2, 64, 64] as [number, number, number];
      case 'high': return [2.5, 128, 128] as [number, number, number];
      default: return [2, 64, 64] as [number, number, number];
    }
  }, [quality]);

  useFrame((state) => {
    if (!meshRef.current || !audioData) return;
    
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.y = time * 0.3;
    meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    
    // Dynamic material properties based on audio
    const material = meshRef.current.material as any;
    if (material) {
      material.emissiveIntensity = 0.3 + frequency * intensity * 0.7;
    }
  });

  return (
    <group>
      <animated.mesh ref={meshRef} scale={scale}>
        <Sphere args={sphereDetail}>
          <MeshDistortMaterial
            color={color}
            distort={0.5}
            speed={3}
            roughness={0.1}
            metalness={0.9}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </Sphere>
      </animated.mesh>
      
      {/* Outer energy ring */}
      <animated.mesh scale={scale.to(s => s * 1.5)}>
        <ringGeometry args={[2.5, 3, 64]} />
        <meshBasicMaterial
          color={colorPalette[1]}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </animated.mesh>
      
      {/* Particle effects around sphere */}
      <Sparkles
        count={quality === 'high' ? 100 : 50}
        scale={[6, 6, 6]}
        size={3}
        speed={0.8}
        color={colorPalette[2]}
      />
    </group>
  );
});

// Enhanced Particle Audio Visualizer
const ParticleVisualizer3D: React.FC<{ 
  audioData: Float32Array | null; 
  color: string; 
  intensity: number;
  quality?: 'low' | 'medium' | 'high';
}> = memo(({ audioData, color, intensity, quality = 'medium' }) => {
  const meshRef = useRef<THREE.Points>(null);
  const [colorPalette] = useState(() => generateColorPalette(color));
  
  const particleCount = useMemo(() => {
    switch (quality) {
      case 'low': return 500;
      case 'medium': return 1000;
      case 'high': return 2000;
      default: return 1000;
    }
  }, [quality]);

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [particleCount]);

  const colors = useMemo(() => {
    const cols = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const color = new THREE.Color(colorPalette[i % colorPalette.length]);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return cols;
  }, [particleCount, colorPalette]);

  useFrame((state) => {
    if (!meshRef.current || !audioData) return;

    const time = state.clock.elapsedTime;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const audioIndex = Math.floor((i / particleCount) * audioData.length);
      const amplitude = audioData[audioIndex] ? Math.max(0, (audioData[audioIndex] + 140) / 140) : 0;
      
      // Audio-reactive movement
      positions[i3] += Math.sin(time + i * 0.01) * amplitude * intensity * 0.1;
      positions[i3 + 1] += Math.cos(time + i * 0.01) * amplitude * intensity * 0.1;
      positions[i3 + 2] += Math.sin(time * 0.5 + i * 0.02) * amplitude * intensity * 0.05;
      
      // Boundary wrapping
      if (Math.abs(positions[i3]) > 10) positions[i3] *= -0.9;
      if (Math.abs(positions[i3 + 1]) > 10) positions[i3 + 1] *= -0.9;
      if (Math.abs(positions[i3 + 2]) > 10) positions[i3 + 2] *= -0.9;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        transparent 
        opacity={0.8}
        sizeAttenuation
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

// Main Audio Visualizer Component with Production Features
export const AudioVisualizer3D: React.FC<AudioVisualizer3DProps> = memo(({
  audioElement,
  isPlaying,
  type = 'sphere',
  color = '#8b5cf6',
  intensity = 1,
  size = 1,
  quality = 'medium',
  enablePostProcessing = true,
  enablePerformanceMonitoring = false
}) => {
  const { dataArray, isInitialized, error } = useAudioVisualization(audioElement);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0
  });

  // Performance monitoring
  useFrame((state, delta) => {
    if (enablePerformanceMonitoring) {
      setPerformanceMetrics(prev => ({
        fps: Math.round(1 / delta),
        frameTime: delta * 1000,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
      }));
    }
  });

  // Error boundary fallback
  if (error) {
    console.warn('AudioVisualizer3D error:', error);
    return (
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh>
          <sphereGeometry args={[1]} />
          <meshStandardMaterial 
            color="#666666" 
            transparent 
            opacity={0.5}
            wireframe
          />
        </mesh>
      </Float>
    );
  }

  // Render different visualizer types with quality settings
  const renderVisualizer = () => {
    if (!isInitialized || !isPlaying) {
      return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh>
            <sphereGeometry args={[1]} />
            <meshStandardMaterial 
              color={color} 
              transparent 
              opacity={0.3}
              wireframe
            />
          </mesh>
        </Float>
      );
    }

    const commonProps = {
      audioData: dataArray,
      color,
      intensity,
      quality
    };

    switch (type) {
      case 'waveform':
        return <WaveformVisualizer3D {...commonProps} />;
      case 'spectrum':
        return <SpectrumVisualizer3D {...commonProps} />;
      case 'circular':
        return <CircularVisualizer3D {...commonProps} />;
      case 'sphere':
        return <SphereVisualizer3D {...commonProps} />;
      case 'particles':
        return <ParticleVisualizer3D {...commonProps} />;
      case 'neural':
        return <NeuralVisualizer3D {...commonProps} />;
      case 'galaxy':
        return <GalaxyVisualizer3D {...commonProps} />;
      case 'dna':
        return <DNAVisualizer3D {...commonProps} />;
      default:
        return <SphereVisualizer3D {...commonProps} />;
    }
  };

  return (
    <AudioVisualizerErrorBoundary fallback={<VisualizerErrorFallback color={color} />}>
      <Suspense fallback={<VisualizerLoadingFallback color={color} />}>
        <group scale={[size, size, size]}>
          {renderVisualizer()}
          
          {/* Dynamic lighting system */}
          <pointLight 
            color={color} 
            intensity={isPlaying ? intensity * 1.5 : 0.3} 
            distance={15}
            decay={2}
          />
          <ambientLight intensity={0.2} />
          
          {/* Conditional post-processing effects */}
          {enablePostProcessing && (
            <EffectComposer>
              <Bloom 
                intensity={intensity * 0.5}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
              />
              <ChromaticAberration offset={[0.002, 0.002]} />
            </EffectComposer>
          )}
          
          {/* Performance monitoring display */}
          {enablePerformanceMonitoring && (
            <Html position={[5, 5, 0]}>
              <div style={{ 
                color: 'white', 
                fontSize: '12px', 
                fontFamily: 'monospace',
                background: 'rgba(0,0,0,0.7)',
                padding: '8px',
                borderRadius: '4px'
              }}>
                FPS: {performanceMetrics.fps}<br/>
                Frame: {performanceMetrics.frameTime.toFixed(2)}ms<br/>
                Memory: {(performanceMetrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
              </div>
            </Html>
          )}
        </group>
      </Suspense>
    </AudioVisualizerErrorBoundary>
  );
});

// Voice Waveform Component for TTS Preview
export const VoiceWaveform3D: React.FC<{
  isGenerating: boolean;
  isPlaying: boolean;
  voiceColor: string;
}> = ({ isGenerating, isPlaying, voiceColor }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wavePoints = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => i);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((child, i) => {
      if (isGenerating || isPlaying) {
        const wave = Math.sin(time * 3 + i * 0.3) * 0.5;
        const noise = (Math.random() - 0.5) * 0.2;
        child.scale.y = Math.abs(wave + noise) * 3 + 0.1;
      } else {
        child.scale.y = 0.1;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {wavePoints.map((_, i) => (
        <mesh key={i} position={[(i - 25) * 0.2, 0, 0]}>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial 
            color={voiceColor}
            emissive={voiceColor}
            emissiveIntensity={isGenerating || isPlaying ? 0.5 : 0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

// Audio Reactive Background
export const AudioReactiveBackground: React.FC<{
  audioElement?: HTMLAudioElement;
  colors: string[];
}> = ({ audioElement, colors }) => {
  const { frequency } = useAudioVisualization(audioElement);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const scale = 1 + frequency * 0.1;
    meshRef.current.scale.setScalar(scale);
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -20]}>
      <sphereGeometry args={[15, 32, 32]} />
      <meshBasicMaterial 
        color={colors[0]} 
        transparent 
        opacity={0.1}
        side={THREE.BackSide}
      />
    </mesh>
  );
};
