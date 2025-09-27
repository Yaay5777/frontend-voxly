import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { 
  Sphere, 
  MeshDistortMaterial, 
  Float, 
  Text3D, 
  Center,
  Sparkles,
  Trail,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';
import { useAvatar3D, useAudioVisualization, useInteractive3D, useParticles3D } from '../hooks/use3D';
import type { VoiceAvatar3D, Interactive3D } from '../types/3d';

interface Avatar3DProps {
  voice: any; // Voice data from API
  position: [number, number, number];
  isActive: boolean;
  isSpeaking: boolean;
  audioData?: Float32Array;
  onSelect?: () => void;
}

export const Avatar3D: React.FC<Avatar3DProps> = ({
  voice,
  position,
  isActive,
  isSpeaking,
  audioData,
  onSelect
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { frequency } = useAudioVisualization();
  
  // Interactive configuration
  const interactiveConfig: Interactive3D = {
    hover: {
      enabled: true,
      scale: 1.1,
      rotation: new THREE.Euler(0, 0.1, 0),
      glow: true
    },
    click: {
      enabled: true,
      animation: {
        name: 'pulse',
        type: 'excited',
        duration: 0.5,
        loop: false,
        intensity: 1.2
      }
    },
    drag: {
      enabled: false,
      constraints: { x: false, y: false, z: false }
    }
  };

  const { bind, scale, rotation, isHovered } = useInteractive3D(interactiveConfig);

  // Avatar personality colors based on voice characteristics
  const avatarColors = useMemo(() => {
    const baseHue = voice.name ? voice.name.charCodeAt(0) * 137.5 % 360 : 200;
    return {
      primary: `hsl(${baseHue}, 70%, 60%)`,
      secondary: `hsl(${(baseHue + 60) % 360}, 80%, 70%)`,
      accent: `hsl(${(baseHue + 120) % 360}, 90%, 80%)`
    };
  }, [voice.name]);

  // Particle system for voice avatar
  const { meshRef: particleRef } = useParticles3D(50, {
    color: avatarColors.primary,
    size: 0.02,
    speed: isSpeaking ? 2.0 : 0.5
  });

  // Spring animations
  const { avatarScale, glowIntensity, distortion } = useSpring({
    avatarScale: isActive ? 1.2 : 1.0,
    glowIntensity: isSpeaking ? 2.0 : (isHovered ? 1.5 : 1.0),
    distortion: isSpeaking ? 0.6 : 0.3,
    config: { tension: 200, friction: 20 }
  });

  // Audio-reactive animations
  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    // Breathing animation
    const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1;
    meshRef.current.scale.setScalar(breathe);

    // Audio reactivity
    if (isSpeaking && frequency > 0) {
      const audioScale = 1 + (frequency * 0.1);
      meshRef.current.scale.multiplyScalar(audioScale);
      
      // Rotation based on audio
      groupRef.current.rotation.y += frequency * 0.01;
    }

    // Floating animation
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;

    // Particle animation
    if (particleRef.current) {
      particleRef.current.rotation.y += delta * 0.5;
    }
  });

  // Gender-based avatar shape
  const AvatarGeometry = () => {
    switch (voice.gender) {
      case 'female':
        return (
          <Sphere ref={meshRef} args={[1, 32, 32]} onClick={onSelect}>
            <MeshDistortMaterial
              color={avatarColors.primary}
              distort={0.4}
              speed={isSpeaking ? 5 : 2}
              roughness={0.2}
              metalness={0.8}
              emissive={avatarColors.secondary}
              emissiveIntensity={isSpeaking ? 0.6 : 0.3}
            />
          </Sphere>
        );
      case 'male':
        return (
          <mesh ref={meshRef} onClick={onSelect}>
            <boxGeometry args={[1.8, 1.8, 1.8]} />
            <MeshDistortMaterial
              color={avatarColors.primary}
              distort={0.4}
              speed={isSpeaking ? 4 : 1.5}
              roughness={0.3}
              metalness={0.6}
              emissive={avatarColors.secondary}
              emissiveIntensity={isSpeaking ? 0.4 : 0.2}
            />
          </mesh>
        );
      default:
        return (
          <mesh ref={meshRef} onClick={onSelect}>
            <octahedronGeometry args={[1.2, 2]} />
            <MeshDistortMaterial
              color={avatarColors.primary}
              distort={0.4}
              speed={isSpeaking ? 6 : 3}
              roughness={0.1}
              metalness={0.9}
              emissive={avatarColors.accent}
              emissiveIntensity={isSpeaking ? 0.8 : 0.4}
            />
          </mesh>
        );
    }
  };

  // Voice category effects
  const CategoryEffects = () => {
    switch (voice.category) {
      case 'celebrity':
        return (
          <>
            <Sparkles count={100} scale={3} size={2} speed={0.4} color={avatarColors.accent} />
            <pointLight color={avatarColors.accent} intensity={2} distance={5} />
          </>
        );
      case 'technical':
        return (
          <>
            <mesh>
              <ringGeometry args={[1.5, 2, 8]} />
              <meshBasicMaterial color={avatarColors.primary} wireframe />
            </mesh>
            <mesh>
              <ringGeometry args={[2, 2.5, 6]} />
              <meshBasicMaterial color={avatarColors.secondary} wireframe />
            </mesh>
          </>
        );
      case 'international':
        return (
          <>
            <Trail width={0.5} length={8} color={avatarColors.primary} attenuation={(t) => t * t}>
              <mesh>
                <sphereGeometry args={[0.1]} />
                <meshBasicMaterial color={avatarColors.accent} />
              </mesh>
            </Trail>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <animated.group 
      ref={groupRef} 
      position={position}
      scale={avatarScale}
      onClick={onSelect}
    >
      {/* Main Avatar */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <AvatarGeometry />
      </Float>

      {/* Voice Name Label */}
      <Center position={[0, -2.5, 0]}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.3}
          height={0.05}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.01}
          bevelOffset={0}
          bevelSegments={5}
        >
          {voice.name}
          <meshStandardMaterial 
            color={avatarColors.primary}
            emissive={avatarColors.secondary}
            emissiveIntensity={isActive ? 0.5 : 0.2}
          />
        </Text3D>
      </Center>

      {/* Voice Accent Flag */}
      {voice.flag && (
        <Center position={[0, 2.2, 0]}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.4}
            height={0.02}
          >
            {voice.flag}
            <meshBasicMaterial />
          </Text3D>
        </Center>
      )}

      {/* Audio Visualization Ring */}
      {isSpeaking && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 3, 64]} />
          <meshBasicMaterial 
            color={avatarColors.accent} 
            transparent 
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Particle System */}
      <instancedMesh ref={particleRef} args={[undefined, undefined, 50]}>
        <sphereGeometry args={[0.02]} />
        <meshBasicMaterial color={avatarColors.primary} transparent opacity={0.8} />
      </instancedMesh>

      {/* Category-specific effects */}
      <CategoryEffects />

      {/* Active Avatar Glow */}
      {isActive && (
        <>
          <pointLight 
            color={avatarColors.primary} 
            intensity={isSpeaking ? 2 : 1} 
            distance={8} 
            decay={2}
          />
          <mesh>
            <sphereGeometry args={[3, 32, 32]} />
            <meshBasicMaterial 
              color={avatarColors.primary}
              transparent
              opacity={0.1}
              side={THREE.BackSide}
            />
          </mesh>
        </>
      )}

      {/* Speaking Animation Waves */}
      {isSpeaking && (
        <>
          {[1, 2, 3].map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.5 + i * 0.5, 1.6 + i * 0.5, 32]} />
              <meshBasicMaterial 
                color={avatarColors.secondary}
                transparent
                opacity={0.3 / i}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </>
      )}
    </animated.group>
  );
};

// Voice Avatar Gallery Component
export const AvatarGallery3D: React.FC<{ voices: any[]; onVoiceSelect: (voice: any) => void }> = ({
  voices,
  onVoiceSelect
}) => {
  const [activeVoice, setActiveVoice] = useState<string | null>(null);
  const [speakingVoice, setSpeakingVoice] = useState<string | null>(null);

  // Arrange avatars in a circular formation
  const avatarPositions = useMemo(() => {
    const radius = 8;
    const angleStep = (Math.PI * 2) / voices.length;
    
    return voices.map((_, index) => {
      const angle = index * angleStep;
      return [
        Math.cos(angle) * radius,
        Math.sin(index * 0.5) * 2, // Varying heights
        Math.sin(angle) * radius
      ] as [number, number, number];
    });
  }, [voices.length]);

  const handleVoiceSelect = (voice: any, index: number) => {
    setActiveVoice(voice.id);
    onVoiceSelect(voice);
    
    // Simulate speaking animation
    setSpeakingVoice(voice.id);
    setTimeout(() => setSpeakingVoice(null), 3000);
  };

  return (
    <>
      {voices.map((voice, index) => (
        <Avatar3D
          key={voice.id}
          voice={voice}
          position={avatarPositions[index]}
          isActive={activeVoice === voice.id}
          isSpeaking={speakingVoice === voice.id}
          onSelect={() => handleVoiceSelect(voice, index)}
        />
      ))}
      
      {/* Ambient lighting for the gallery */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
      
      {/* Environment effects */}
      <fog attach="fog" args={['#1a1a2e', 20, 100]} />
    </>
  );
};
