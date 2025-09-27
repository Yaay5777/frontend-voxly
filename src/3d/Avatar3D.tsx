import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus, Octahedron, MeshDistortMaterial, Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Avatar3D as Avatar3DType } from '../types';

interface Avatar3DProps {
  config: Avatar3DType;
  audioData?: number[];
  isPlaying?: boolean;
  scale?: number;
  position?: [number, number, number];
}

const Avatar3D: React.FC<Avatar3DProps> = ({
  config,
  audioData = [],
  isPlaying = false,
  scale = 1,
  position = [0, 0, 0],
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Calculate audio-reactive intensity
  const audioIntensity = useMemo(() => {
    if (!audioData.length) return 0;
    const average = audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
    return Math.min(average * 2, 1);
  }, [audioData]);

  // Animate based on audio and configuration
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const intensity = isPlaying ? audioIntensity : 0.3;

    // Base animations
    switch (config.animation) {
      case 'float':
        meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3 * intensity;
        break;
      case 'rotate':
        meshRef.current.rotation.y = time * 0.5;
        meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
        break;
      case 'pulse':
        const pulseScale = 1 + Math.sin(time * 2) * 0.1 * intensity;
        meshRef.current.scale.setScalar(scale * pulseScale);
        break;
      case 'wave':
        meshRef.current.rotation.z = Math.sin(time * 1.5) * 0.3 * intensity;
        break;
    }

    // Audio-reactive scaling
    if (isPlaying && audioIntensity > 0.1) {
      const reactiveScale = 1 + audioIntensity * 0.3;
      meshRef.current.scale.setScalar(scale * reactiveScale);
    }

    // Animate particles
    if (particlesRef.current && config.particles) {
      particlesRef.current.rotation.y = time * 0.1;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.01 * intensity;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Generate geometry based on config
  const renderGeometry = () => {
    const color = config.color || '#3b82f6';
    const materialProps = {
      color,
      transparent: true,
      opacity: 0.8,
    };

    switch (config.geometry) {
      case 'sphere':
        return (
          <Sphere ref={meshRef} args={[1, 32, 32]} position={position} scale={scale}>
            {config.material === 'glass' ? (
              <MeshDistortMaterial
                {...materialProps}
                distort={0.3}
                speed={2}
                roughness={0}
                metalness={0.1}
              />
            ) : (
              <meshStandardMaterial {...materialProps} />
            )}
          </Sphere>
        );
      case 'cube':
        return (
          <Box ref={meshRef} args={[1, 1, 1]} position={position} scale={scale}>
            <MeshDistortMaterial
              {...materialProps}
              distort={0.2}
              speed={1.5}
            />
          </Box>
        );
      case 'torus':
        return (
          <Torus ref={meshRef} args={[1, 0.4, 16, 100]} position={position} scale={scale}>
            <MeshDistortMaterial
              {...materialProps}
              distort={0.4}
              speed={3}
            />
          </Torus>
        );
      case 'octahedron':
        return (
          <Octahedron ref={meshRef} args={[1]} position={position} scale={scale}>
            <MeshDistortMaterial
              {...materialProps}
              distort={0.5}
              speed={2.5}
            />
          </Octahedron>
        );
      default:
        return null;
    }
  };

  // Generate particle system
  const particleCount = 100;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    return positions;
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* Main avatar geometry */}
        {renderGeometry()}
        
        {/* Particle system */}
        {config.particles && (
          <points ref={particlesRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={particleCount}
                array={particles}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.05}
              color={config.color}
              transparent
              opacity={0.6}
              sizeAttenuation
            />
          </points>
        )}
        
        {/* Ambient lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color={config.color} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          color={config.color}
        />
      </group>
    </Float>
  );
};

export default Avatar3D;
