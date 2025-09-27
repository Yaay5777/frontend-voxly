// Enhanced 3D Avatar Reactor with voice-specific avatars
// @ts-nocheck
import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sphere, Box, Torus, Octahedron } from '@react-three/drei'
import * as THREE from 'three'

interface AvatarProps {
  enabled?: boolean
  analyser: AnalyserNode | null
  selectedVoice?: any
  isPlaying?: boolean
}

// Voice-specific avatar configurations
const AVATAR_CONFIGS = {
  emma: {
    geometry: 'sphere',
    color: '#FF6B9D',
    emissive: '#FF1744',
    particles: { color: '#FFB3C6', count: 800 },
    animation: 'professional'
  },
  james: {
    geometry: 'octahedron',
    color: '#4ECDC4',
    emissive: '#00BCD4',
    particles: { color: '#B2EBF2', count: 1000 },
    animation: 'deep'
  },
  sophia: {
    geometry: 'torus',
    color: '#45B7D1',
    emissive: '#2196F3',
    particles: { color: '#BBDEFB', count: 600 },
    animation: 'warm'
  },
  alex: {
    geometry: 'box',
    color: '#96CEB4',
    emissive: '#4CAF50',
    particles: { color: '#C8E6C9', count: 900 },
    animation: 'energetic'
  },
  luna: {
    geometry: 'sphere',
    color: '#FFEAA7',
    emissive: '#FFC107',
    particles: { color: '#FFF9C4', count: 1200 },
    animation: 'mystical'
  },
  morgan: {
    geometry: 'octahedron',
    color: '#DDA0DD',
    emissive: '#9C27B0',
    particles: { color: '#E1BEE7', count: 700 },
    animation: 'authoritative'
  }
}

function ParticleField({ config, energy }: { config: any, energy: number }) {
  const particlesRef = useRef<THREE.Points | null>(null)
  
  const { geometry, material } = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const count = config.count
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Create a more interesting distribution
      const radius = Math.random() * 4 + 1
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      const color = new THREE.Color(config.color)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    const mat = new THREE.PointsMaterial({
      size: 0.02,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    
    return { geometry: geom, material: mat }
  }, [config])
  
  useFrame((state, delta) => {
    if (particlesRef.current) {
      const scale = 1 + energy * 0.8
      particlesRef.current.scale.setScalar(scale)
      particlesRef.current.rotation.y += delta * 0.3
      particlesRef.current.rotation.x += delta * 0.1
      
      // Update material opacity based on energy
      if (material) {
        material.opacity = Math.max(0.3, 0.6 + energy * 0.4)
      }
    }
  })
  
  return <points ref={particlesRef} geometry={geometry} material={material} />
}

function AvatarGeometry({ config, energy, isPlaying }: { config: any, energy: number, isPlaying: boolean }) {
  const meshRef = useRef<THREE.Mesh | null>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base scale animation
      const baseScale = 1 + energy * 0.3
      const pulseScale = isPlaying ? 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05 : 1
      meshRef.current.scale.setScalar(baseScale * pulseScale)
      
      // Rotation based on animation type
      switch (config.animation) {
        case 'professional':
          meshRef.current.rotation.y += delta * 0.5
          break
        case 'deep':
          meshRef.current.rotation.x += delta * 0.3
          meshRef.current.rotation.z += delta * 0.2
          break
        case 'warm':
          meshRef.current.rotation.y += delta * 0.4
          meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
          break
        case 'energetic':
          meshRef.current.rotation.x += delta * 0.8
          meshRef.current.rotation.y += delta * 0.6
          break
        case 'mystical':
          meshRef.current.rotation.y += delta * 0.3
          meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2
          break
        case 'authoritative':
          meshRef.current.rotation.y += delta * 0.2
          break
        default:
          meshRef.current.rotation.y += delta * 0.5
      }
    }
  })
  
  const commonProps = {
    ref: meshRef,
    onPointerOver: () => setHovered(true),
    onPointerOut: () => setHovered(false)
  }
  
  const materialProps = {
    color: config.color,
    emissive: config.emissive,
    emissiveIntensity: hovered ? 0.3 : 0.1 + energy * 0.2,
    roughness: 0.4,
    metalness: 0.6,
    transparent: true,
    opacity: 0.9
  }
  
  switch (config.geometry) {
    case 'sphere':
      return (
        <Sphere {...commonProps} args={[1.2, 32, 32]}>
          <meshStandardMaterial {...materialProps} />
        </Sphere>
      )
    case 'box':
      return (
        <Box {...commonProps} args={[2, 2, 2]}>
          <meshStandardMaterial {...materialProps} />
        </Box>
      )
    case 'torus':
      return (
        <Torus {...commonProps} args={[1, 0.4, 16, 100]}>
          <meshStandardMaterial {...materialProps} />
        </Torus>
      )
    case 'octahedron':
      return (
        <Octahedron {...commonProps} args={[1.5]}>
          <meshStandardMaterial {...materialProps} />
        </Octahedron>
      )
    default:
      return (
        <Sphere {...commonProps} args={[1.2, 32, 32]}>
          <meshStandardMaterial {...materialProps} />
        </Sphere>
      )
  }
}

export default function EnhancedAvatarReactor({ enabled = false, analyser, selectedVoice, isPlaying = false }: AvatarProps) {
  const groupRef = useRef<THREE.Group | null>(null)
  const energyRef = useRef(0)
  const [currentEnergy, setCurrentEnergy] = useState(0)
  
  // Get configuration for selected voice
  const config = selectedVoice?.id && AVATAR_CONFIGS[selectedVoice.id] 
    ? AVATAR_CONFIGS[selectedVoice.id]
    : AVATAR_CONFIGS.emma // default
  
  // Prepare audio analysis data
  const dataArray = useMemo(() => {
    if (analyser) {
      return new Uint8Array(analyser.frequencyBinCount)
    }
    return null
  }, [analyser])
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
    }
    
    let energy = 0
    if (analyser && dataArray && isPlaying) {
      analyser.getByteFrequencyData(dataArray)
      const len = Math.min(256, dataArray.length)
      
      // Focus on different frequency ranges for different voice types
      let startBin = 0
      let endBin = len
      
      switch (config.animation) {
        case 'deep':
          startBin = 0
          endBin = Math.floor(len * 0.3) // Focus on bass
          break
        case 'professional':
          startBin = Math.floor(len * 0.2)
          endBin = Math.floor(len * 0.7) // Focus on mids
          break
        case 'energetic':
          startBin = Math.floor(len * 0.4)
          endBin = len // Focus on highs
          break
        default:
          // Use full spectrum
          break
      }
      
      let sum = 0
      let count = 0
      for (let i = startBin; i < endBin; i += 4) {
        sum += dataArray[i]
        count++
      }
      energy = count > 0 ? sum / (count * 255) : 0
    }
    
    // Smooth energy transitions
    const smoothed = THREE.MathUtils.lerp(energyRef.current, energy, 0.1)
    energyRef.current = smoothed
    setCurrentEnergy(smoothed)
  })
  
  if (!enabled) {
    return (
      <group>
        <AvatarGeometry config={config} energy={0} isPlaying={false} />
        <Text
          position={[0, -2.5, 0]}
          fontSize={0.3}
          color="#666"
          anchorX="center"
          anchorY="middle"
        >
          Select a voice to begin
        </Text>
      </group>
    )
  }
  
  return (
    <group ref={groupRef}>
      <AvatarGeometry config={config} energy={currentEnergy} isPlaying={isPlaying} />
      <ParticleField config={config.particles} energy={currentEnergy} />
      
      {/* Voice name display */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.4}
        color={config.color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {selectedVoice?.name || 'Voice Avatar'}
      </Text>
      
      {/* Energy indicator */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.2}
        color="#888"
        anchorX="center"
        anchorY="middle"
      >
        {isPlaying ? `Energy: ${Math.round(currentEnergy * 100)}%` : 'Ready'}
      </Text>
      
      {/* Ambient lighting effects */}
      <pointLight
        position={[2, 2, 2]}
        color={config.color}
        intensity={0.5 + currentEnergy * 0.5}
        distance={10}
      />
      <pointLight
        position={[-2, -2, 2]}
        color={config.emissive}
        intensity={0.3 + currentEnergy * 0.3}
        distance={8}
      />
    </group>
  )
}
