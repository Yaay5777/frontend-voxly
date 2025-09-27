import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { 
  Sphere, 
  Line, 
  Trail,
  MeshDistortMaterial,
  Float
} from '@react-three/drei';
import * as THREE from 'three';
import type { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { useAudioVisualization, useParticles3D } from '../hooks/use3D';

interface AudioVisualizer3DProps {
  audioElement?: HTMLAudioElement;
  isPlaying: boolean;
  type?: 'waveform' | 'spectrum' | 'circular' | 'sphere' | 'particles';
  color?: string;
  intensity?: number;
  size?: number;
}

// Waveform Visualizer
const WaveformVisualizer3D: React.FC<{ 
  audioData: Float32Array | null; 
  color: string; 
  intensity: number;
}> = ({ audioData, color, intensity }) => {
  const lineRef = useRef<Line2>(null);
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 128; i++) {
      pts.push(new THREE.Vector3((i - 64) * 0.1, 0, 0));
    }
    return pts;
  }, []);

  useFrame(() => {
    if (!lineRef.current || !audioData) return;

    // Line2 uses different geometry structure
    const geometry = lineRef.current.geometry;
    if (geometry && geometry.attributes.position) {
      const positions = geometry.attributes.position;
      for (let i = 0; i < Math.min(128, audioData.length); i++) {
        const amplitude = (audioData[i] + 140) / 140; // Normalize
        positions.setY(i, amplitude * intensity * 5);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={3}
      transparent
      opacity={0.8}
    />
  );
};

// Spectrum Analyzer Bars
const SpectrumVisualizer3D: React.FC<{ 
  audioData: Float32Array | null; 
  color: string; 
  intensity: number;
}> = ({ audioData, color, intensity }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bars = useMemo(() => Array.from({ length: 64 }, (_, i) => i), []);

  useFrame(() => {
    if (!groupRef.current || !audioData) return;

    groupRef.current.children.forEach((child, i) => {
      if (i < audioData.length) {
        const amplitude = (audioData[i] + 140) / 140;
        child.scale.y = Math.max(0.1, amplitude * intensity * 10);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {bars.map((_, i) => (
        <mesh key={i} position={[(i - 32) * 0.3, 0, 0]}>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

// Circular Spectrum Visualizer
const CircularVisualizer3D: React.FC<{ 
  audioData: Float32Array | null; 
  color: string; 
  intensity: number;
}> = ({ audioData, color, intensity }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bars = useMemo(() => Array.from({ length: 64 }, (_, i) => i), []);

  useFrame((state) => {
    if (!groupRef.current || !audioData) return;

    groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    
    groupRef.current.children.forEach((child, i) => {
      if (i < audioData.length) {
        const amplitude = (audioData[i] + 140) / 140;
        child.scale.y = Math.max(0.1, amplitude * intensity * 8);
      }
    });
  });

  const radius = 5;
  return (
    <group ref={groupRef}>
      {bars.map((_, i) => {
        const angle = (i / bars.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.3, 1, 0.3]} />
            <meshStandardMaterial 
              color={color} 
              emissive={color}
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Sphere Audio Visualizer
const SphereVisualizer3D: React.FC<{ 
  audioData: Float32Array | null; 
  color: string; 
  intensity: number;
}> = ({ audioData, color, intensity }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { frequency } = useAudioVisualization();

  const { scale, distortion } = useSpring({
    scale: frequency > 0 ? 1 + (frequency * intensity * 0.01) : 1,
    distortion: frequency > 0 ? frequency * intensity * 0.1 : 0.3,
    config: { tension: 300, friction: 30 }
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
  });

  return (
    <animated.mesh ref={meshRef} scale={scale}>
      <Sphere args={[2, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          distort={distortion}
          speed={5}
          roughness={0.1}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Sphere>
    </animated.mesh>
  );
};

// Particle Audio Visualizer
const ParticleVisualizer3D: React.FC<{ 
  audioData: Float32Array | null; 
  color: string; 
  intensity: number;
}> = ({ color, intensity }) => {
  const { meshRef } = useParticles3D(200, {
    color,
    size: 0.05,
    speed: intensity
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 200]}>
      <sphereGeometry args={[0.05]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  );
};

// Main Audio Visualizer Component
export const AudioVisualizer3D: React.FC<AudioVisualizer3DProps> = ({
  audioElement,
  isPlaying,
  type = 'sphere',
  color = '#8b5cf6',
  intensity = 1,
  size = 1
}) => {
  const { dataArray, isInitialized } = useAudioVisualization(audioElement);

  // Render different visualizer types
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

    switch (type) {
      case 'waveform':
        return <WaveformVisualizer3D audioData={dataArray} color={color} intensity={intensity} />;
      case 'spectrum':
        return <SpectrumVisualizer3D audioData={dataArray} color={color} intensity={intensity} />;
      case 'circular':
        return <CircularVisualizer3D audioData={dataArray} color={color} intensity={intensity} />;
      case 'sphere':
        return <SphereVisualizer3D audioData={dataArray} color={color} intensity={intensity} />;
      case 'particles':
        return <ParticleVisualizer3D audioData={dataArray} color={color} intensity={intensity} />;
      default:
        return <SphereVisualizer3D audioData={dataArray} color={color} intensity={intensity} />;
    }
  };

  return (
    <group scale={[size, size, size]}>
      {renderVisualizer()}
      
      {/* Ambient lighting for the visualizer */}
      <pointLight 
        color={color} 
        intensity={isPlaying ? intensity * 2 : 0.5} 
        distance={10} 
      />
    </group>
  );
};

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
