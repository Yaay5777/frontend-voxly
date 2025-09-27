import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface OptimizedAvatarReactorProps {
  voiceId: string;
  isPlaying: boolean;
  audioData?: number[];
  className?: string;
  quality?: 'low' | 'medium' | 'high';
  enableParticles?: boolean;
}

// Performance monitoring hook
const usePerformanceMonitor = () => {
  const [fps, setFps] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const currentFPS = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setFps(currentFPS);
        setIsLowPerformance(currentFPS < 30);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    measureFPS();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return { fps, isLowPerformance };
};

// Loading fallback component
const LoadingFallback: React.FC = () => {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 p-4 bg-white/90 backdrop-blur-sm rounded-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
        />
        <div className="text-sm text-gray-600">
          Loading 3D Avatar... {Math.round(progress)}%
        </div>
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </Html>
  );
};

// Optimized avatar geometry based on performance
const AvatarGeometry: React.FC<{
  voiceId: string;
  audioData: number[];
  isPlaying: boolean;
  quality: 'low' | 'medium' | 'high';
}> = ({ voiceId, audioData, isPlaying, quality }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  
  // Geometry complexity based on quality
  const geometryProps = useMemo(() => {
    switch (quality) {
      case 'low':
        return { segments: 8, rings: 6 };
      case 'medium':
        return { segments: 16, rings: 12 };
      case 'high':
        return { segments: 32, rings: 24 };
      default:
        return { segments: 16, rings: 12 };
    }
  }, [quality]);

  // Voice-specific geometry
  const getGeometry = () => {
    const { segments, rings } = geometryProps;
    
    switch (voiceId) {
      case 'emma':
      case 'luna':
        return <sphereGeometry args={[1, segments, rings]} />;
      case 'james':
      case 'morgan':
        return <octahedronGeometry args={[1, quality === 'low' ? 0 : 1]} />;
      case 'sophia':
        return <torusGeometry args={[1, 0.4, segments / 2, segments]} />;
      case 'alex':
        return <boxGeometry args={[1.5, 1.5, 1.5, segments / 4, segments / 4, segments / 4]} />;
      default:
        return <sphereGeometry args={[1, segments, rings]} />;
    }
  };

  // Audio-reactive animation
  useEffect(() => {
    if (!meshRef.current || !isPlaying) return;

    const animate = () => {
      if (meshRef.current && audioData.length > 0) {
        const avgAmplitude = audioData.reduce((a, b) => a + b, 0) / audioData.length;
        const scale = 1 + avgAmplitude * 0.3;
        
        meshRef.current.scale.setScalar(scale);
        meshRef.current.rotation.y += 0.01 * (1 + avgAmplitude);
      }
      
      if (isPlaying) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [audioData, isPlaying]);

  const voiceColors = {
    emma: '#FF6B9D',
    james: '#4ECDC4',
    sophia: '#45B7D1',
    alex: '#96CEB4',
    luna: '#FFEAA7',
    morgan: '#DDA0DD'
  };

  return (
    <mesh ref={meshRef}>
      {getGeometry()}
      <meshStandardMaterial
        color={voiceColors[voiceId as keyof typeof voiceColors] || '#8B5CF6'}
        metalness={0.3}
        roughness={0.4}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

// Optimized particle system
const OptimizedParticles: React.FC<{
  voiceId: string;
  audioData: number[];
  isPlaying: boolean;
  quality: 'low' | 'medium' | 'high';
}> = ({ voiceId, audioData, isPlaying, quality }) => {
  const particlesRef = React.useRef<THREE.Points>(null);
  
  // Particle count based on quality
  const particleCount = useMemo(() => {
    switch (quality) {
      case 'low': return 100;
      case 'medium': return 300;
      case 'high': return 600;
      default: return 300;
    }
  }, [quality]);

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [particleCount]);

  useEffect(() => {
    if (!particlesRef.current || !isPlaying) return;

    const animate = () => {
      if (particlesRef.current && audioData.length > 0) {
        const avgAmplitude = audioData.reduce((a, b) => a + b, 0) / audioData.length;
        particlesRef.current.rotation.y += 0.005 * (1 + avgAmplitude);
      }
      
      if (isPlaying) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [audioData, isPlaying]);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8B5CF6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// 2D Fallback component for low-end devices
const FallbackAvatar: React.FC<{
  voiceId: string;
  isPlaying: boolean;
  audioData: number[];
}> = ({ voiceId, isPlaying, audioData }) => {
  const voiceConfig = {
    // Professional Voices
    emma: { avatar: '👩‍💼', color: '#3b82f6' },
    james: { avatar: '👨‍💼', color: '#10b981' },
    sophia: { avatar: '👑', color: '#8b5cf6' },
    
    // Casual & Friendly Voices
    alex: { avatar: '😊', color: '#f59e0b' },
    maya: { avatar: '🌟', color: '#ec4899' },
    ryan: { avatar: '🏄‍♂️', color: '#06b6d4' },
    
    // Storytelling & Narrative Voices
    morgan: { avatar: '📚', color: '#7c3aed' },
    elena: { avatar: '🔮', color: '#db2777' },
    victor: { avatar: '⚔️', color: '#dc2626' },
    
    // Character & Entertainment Voices
    zoe: { avatar: '🎭', color: '#f97316' },
    max: { avatar: '😎', color: '#8b5cf6' },
    ruby: { avatar: '💎', color: '#e11d48' },
    
    // International & Accented Voices
    oliver: { avatar: '🎩', color: '#059669' },
    isabella: { avatar: '🌹', color: '#dc2626' },
    pierre: { avatar: '🥖', color: '#7c3aed' },
    
    // Specialized & Technical Voices
    aria: { avatar: '🤖', color: '#06b6d4' },
    sage: { avatar: '🧙‍♂️', color: '#059669' },
    nova: { avatar: '🚀', color: '#6366f1' }
  };

  const config = voiceConfig[voiceId as keyof typeof voiceConfig] || voiceConfig.emma;
  const avgAmplitude = audioData.length > 0 ? audioData.reduce((a, b) => a + b, 0) / audioData.length : 0;

  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        className="relative flex items-center justify-center w-32 h-32 rounded-full"
        style={{ backgroundColor: `${config.color}20` }}
        animate={isPlaying ? {
          scale: [1, 1 + avgAmplitude * 0.3, 1],
          rotate: [0, 360]
        } : {}}
        transition={{
          scale: { duration: 0.5, repeat: Infinity },
          rotate: { duration: 10, repeat: Infinity, ease: "linear" }
        }}
      >
        <span className="text-6xl">{config.avatar}</span>
        
        {/* Audio visualization rings */}
        {isPlaying && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: config.color }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
};

export const OptimizedAvatarReactor: React.FC<OptimizedAvatarReactorProps> = ({
  voiceId,
  isPlaying,
  audioData = [],
  className = '',
  quality = 'medium',
  enableParticles = true
}) => {
  const { fps, isLowPerformance } = usePerformanceMonitor();
  const [use3D, setUse3D] = useState(true);
  const [adaptiveQuality, setAdaptiveQuality] = useState(quality);

  // Adaptive quality based on performance
  useEffect(() => {
    if (isLowPerformance) {
      if (fps < 20) {
        setUse3D(false);
      } else if (fps < 30) {
        setAdaptiveQuality('low');
      }
    } else {
      setUse3D(true);
      setAdaptiveQuality(quality);
    }
  }, [fps, isLowPerformance, quality]);

  // WebGL support detection
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGLSupported(!!gl);
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);

  // Force 2D fallback if WebGL not supported or performance is too low
  const shouldUse3D = webGLSupported && use3D;

  return (
    <div className={`relative w-full h-64 ${className}`}>
      {/* Performance indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/50 text-white text-xs rounded">
          {fps} FPS | {shouldUse3D ? '3D' : '2D'} | {adaptiveQuality}
        </div>
      )}

      <AnimatePresence mode="wait">
        {shouldUse3D ? (
          <motion.div
            key="3d-avatar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              gl={{ 
                antialias: adaptiveQuality !== 'low',
                alpha: true,
                powerPreference: "high-performance"
              }}
              dpr={adaptiveQuality === 'low' ? 1 : Math.min(window.devicePixelRatio, 2)}
            >
              <Suspense fallback={<LoadingFallback />}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                
                <AvatarGeometry
                  voiceId={voiceId}
                  audioData={audioData}
                  isPlaying={isPlaying}
                  quality={adaptiveQuality}
                />
                
                {enableParticles && adaptiveQuality !== 'low' && (
                  <OptimizedParticles
                    voiceId={voiceId}
                    audioData={audioData}
                    isPlaying={isPlaying}
                    quality={adaptiveQuality}
                  />
                )}
                
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate={isPlaying}
                  autoRotateSpeed={2}
                />
              </Suspense>
            </Canvas>
          </motion.div>
        ) : (
          <motion.div
            key="2d-avatar"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl"
          >
            <FallbackAvatar
              voiceId={voiceId}
              isPlaying={isPlaying}
              audioData={audioData}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quality toggle for users */}
      <div className="absolute bottom-2 left-2 flex gap-1">
        {['low', 'medium', 'high'].map((q) => (
          <motion.button
            key={q}
            onClick={() => setAdaptiveQuality(q as 'low' | 'medium' | 'high')}
            className={`
              px-2 py-1 text-xs rounded transition-colors
              ${adaptiveQuality === q
                ? 'bg-purple-500 text-white'
                : 'bg-white/50 text-gray-600 hover:bg-white/70'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {q}
          </motion.button>
        ))}
        
        <motion.button
          onClick={() => setUse3D(!use3D)}
          className="px-2 py-1 text-xs rounded bg-white/50 text-gray-600 hover:bg-white/70 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {use3D ? '3D' : '2D'}
        </motion.button>
      </div>
    </div>
  );
};
