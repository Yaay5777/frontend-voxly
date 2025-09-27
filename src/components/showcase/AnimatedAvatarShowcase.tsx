import React, { Suspense, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { 
  Users, 
  Globe, 
  Sparkles, 
  Volume2,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import * as THREE from 'three';

// Avatar data representing diverse voices and cultures
const avatarData = [
  { id: 'emma', name: 'Emma', country: 'USA', color: '#FF6B6B', position: [2, 0, 0], accent: 'American' },
  { id: 'arjun', name: 'Arjun', country: 'India', color: '#4ECDC4', position: [-2, 0, 0], accent: 'Indian' },
  { id: 'marie', name: 'Marie', country: 'France', color: '#45B7D1', position: [0, 2, 0], accent: 'French' },
  { id: 'kenji', name: 'Kenji', country: 'Japan', color: '#96CEB4', position: [0, -2, 0], accent: 'Japanese' },
  { id: 'sofia', name: 'Sofia', country: 'Spain', color: '#FFEAA7', position: [1.5, 1.5, 0], accent: 'Spanish' },
  { id: 'ahmed', name: 'Ahmed', country: 'Egypt', color: '#DDA0DD', position: [-1.5, 1.5, 0], accent: 'Arabic' },
  { id: 'liam', name: 'Liam', country: 'Ireland', color: '#98D8C8', position: [1.5, -1.5, 0], accent: 'Irish' },
  { id: 'priya', name: 'Priya', country: 'India', color: '#F7DC6F', position: [-1.5, -1.5, 0], accent: 'Hindi' },
  { id: 'carlos', name: 'Carlos', country: 'Mexico', color: '#BB8FCE', position: [0, 0, 2], accent: 'Mexican' },
  { id: 'yuki', name: 'Yuki', country: 'Japan', color: '#85C1E9', position: [0, 0, -2], accent: 'Japanese' },
  { id: 'fatima', name: 'Fatima', country: 'Morocco', color: '#F8C471', position: [2, 2, 1], accent: 'Arabic' },
  { id: 'olaf', name: 'Olaf', country: 'Norway', color: '#AED6F1', position: [-2, 2, 1], accent: 'Nordic' },
  { id: 'lucia', name: 'Lucia', country: 'Italy', color: '#F1948A', position: [2, -2, 1], accent: 'Italian' },
  { id: 'chen', name: 'Chen', country: 'China', color: '#82E0AA', position: [-2, -2, 1], accent: 'Mandarin' },
  { id: 'thabo', name: 'Thabo', country: 'South Africa', color: '#D7BDE2', position: [0, 1, -1], accent: 'African' },
];

// Individual Avatar Component
const Avatar3DShowcase: React.FC<{ 
  avatar: typeof avatarData[0]; 
  isActive: boolean; 
  onClick: () => void;
  animationPhase: number;
}> = ({ avatar, isActive, onClick, animationPhase }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = avatar.position[1] + Math.sin(state.clock.elapsedTime + avatar.position[0]) * 0.2;
      
      // Rotation animation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      
      // Active avatar special animation
      if (isActive) {
        meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={avatar.position as [number, number, number]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Avatar Sphere */}
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={avatar.color}
          emissive={isActive ? avatar.color : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
          metalness={0.1}
          roughness={0.1}
        />
        
        {/* Country Flag Indicator */}
        <mesh position={[0, -0.6, 0]}>
          <planeGeometry args={[0.4, 0.3]} />
          <meshStandardMaterial 
            color={avatar.color}
            transparent
            opacity={0.7}
          />
        </mesh>
      </mesh>
    </Float>
  );
};

// Main Animated Avatar Showcase Component with WebGL Context Management
const AnimatedAvatarShowcase: React.FC = () => {
  const [activeAvatar, setActiveAvatar] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [currentDemo, setCurrentDemo] = useState(0);
  const [webglSupported, setWebglSupported] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check WebGL support and context availability
  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          setWebglSupported(false);
          return false;
        }
        
        // Check if we can create more contexts
        const info = gl.getExtension('WEBGL_debug_renderer_info');
        const contexts = document.querySelectorAll('canvas').length;
        
        if (contexts > 8) { // Limit WebGL contexts
          console.warn('Too many WebGL contexts, falling back to 2D');
          setWebglSupported(false);
          return false;
        }
        
        return true;
      } catch (e) {
        console.warn('WebGL not supported, falling back to 2D');
        setWebglSupported(false);
        return false;
      }
    };

    checkWebGLSupport();
  }, []);

  // Memoized avatar data to prevent re-renders
  const memoizedAvatarData = useMemo(() => avatarData.slice(0, 8), []); // Limit to 8 avatars

  // Auto-cycle through avatars with cleanup
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % memoizedAvatarData.length);
      setActiveAvatar(memoizedAvatarData[currentDemo].id);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, currentDemo, memoizedAvatarData]);

  // Animation phase cycling with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleAvatarClick = useCallback((avatarId: string) => {
    setActiveAvatar(avatarId);
    setCurrentDemo(memoizedAvatarData.findIndex(a => a.id === avatarId));
  }, [memoizedAvatarData]);

  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const resetAnimation = useCallback(() => {
    setCurrentDemo(0);
    setActiveAvatar(memoizedAvatarData[0].id);
    setAnimationPhase(0);
  }, [memoizedAvatarData]);

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

      {/* Conditional 3D Canvas or 2D Fallback */}
      {webglSupported ? (
        <Canvas 
          ref={canvasRef}
          camera={{ position: [0, 0, 8], fov: 60 }}
          className="absolute inset-0"
          gl={{ 
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
            antialias: false,
            alpha: false
          }}
          onCreated={({ gl }) => {
            // Optimize WebGL context
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gl.outputEncoding = THREE.sRGBEncoding;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1;
          }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ECDC4" />

          <Suspense fallback={null}>
            {memoizedAvatarData.map((avatar) => (
              <Avatar3DShowcase
                key={avatar.id}
                avatar={avatar}
                isActive={activeAvatar === avatar.id}
                onClick={() => handleAvatarClick(avatar.id)}
                animationPhase={animationPhase}
              />
            ))}
            
            {/* Simplified Central Orb */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial 
                color="#4ECDC4"
                emissive="#4ECDC4"
                emissiveIntensity={0.3}
              />
            </mesh>
            
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              autoRotate={isPlaying}
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI}
              minPolarAngle={0}
            />
          </Suspense>
        </Canvas>
      ) : (
        // 2D Fallback when WebGL is not available or contexts are exhausted
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-4 gap-4 p-8">
            {memoizedAvatarData.map((avatar, index) => (
              <motion.div
                key={avatar.id}
                className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  activeAvatar === avatar.id ? 'scale-125 shadow-lg' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: avatar.color }}
                onClick={() => handleAvatarClick(avatar.id)}
                animate={{
                  y: Math.sin((animationPhase + index) * 0.5) * 10,
                  rotate: isPlaying ? 360 : 0,
                }}
                transition={{
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                }}
              >
                <Volume2 className="w-6 h-6 text-white" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Overlay Information */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-md rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {avatarData.length}+ Diverse Voices
                </h3>
                <p className="text-gray-300 text-sm">
                  From {new Set(avatarData.map(a => a.country)).size} countries worldwide
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePlayback}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={resetAnimation}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Avatar Info */}
      <AnimatePresence>
        {activeAvatar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 z-10"
          >
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-4">
              {(() => {
                const avatar = avatarData.find(a => a.id === activeAvatar);
                if (!avatar) return null;
                
                return (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: avatar.color }}
                      >
                        <Volume2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">
                          {avatar.name} from {avatar.country}
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {avatar.accent} accent • AI-powered voice synthesis
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-white text-sm font-medium">
                        Click to explore
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedAvatarShowcase;
