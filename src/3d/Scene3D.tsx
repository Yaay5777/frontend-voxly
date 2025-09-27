import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Stars, 
  Float, 
  Sparkles,
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
  BakeShadows,
  SoftShadows,
  ContactShadows,
  Sky,
  Cloud
} from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useScene3D, usePerformance3D } from '../hooks/use3D';

interface Scene3DProps {
  children: React.ReactNode;
  environment?: 'studio' | 'space' | 'cyber' | 'nature' | 'minimal';
  enableVR?: boolean;
  enableAR?: boolean;
  performance?: 'low' | 'medium' | 'high' | 'ultra';
}

// Animated Background Environment
const AnimatedEnvironment: React.FC<{ type: string }> = ({ type }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  switch (type) {
    case 'space':
      return (
        <>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />
          <fog attach="fog" args={['#0a0a0a', 50, 200]} />
          
          {/* Animated nebula effect */}
          <mesh ref={meshRef} position={[0, 0, -50]}>
            <sphereGeometry args={[30, 32, 32]} />
            <meshBasicMaterial 
              color="#4c1d95" 
              transparent 
              opacity={0.3}
              side={THREE.BackSide}
            />
          </mesh>
          
          {/* Floating particles */}
          <Sparkles count={200} scale={50} size={1} speed={0.2} color="#8b5cf6" />
        </>
      );

    case 'cyber':
      return (
        <>
          <Environment preset="night" />
          <fog attach="fog" args={['#0f0f23', 20, 100]} />
          
          {/* Grid floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
            <planeGeometry args={[100, 100, 50, 50]} />
            <meshBasicMaterial 
              color="#00ffff" 
              wireframe 
              transparent 
              opacity={0.3}
            />
          </mesh>
          
          {/* Neon lights */}
          <pointLight position={[10, 10, 10]} color="#ff0080" intensity={2} />
          <pointLight position={[-10, 10, -10]} color="#00ffff" intensity={2} />
          
          {/* Floating geometric shapes */}
          {[...Array(20)].map((_, i) => (
            <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
              <mesh position={[
                (Math.random() - 0.5) * 50,
                Math.random() * 20,
                (Math.random() - 0.5) * 50
              ]}>
                <octahedronGeometry args={[0.5]} />
                <meshBasicMaterial color="#00ffff" wireframe />
              </mesh>
            </Float>
          ))}
        </>
      );

    case 'nature':
      return (
        <>
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="forest" />
          <fog attach="fog" args={['#87ceeb', 30, 200]} />
          
          {/* Floating clouds */}
          {[...Array(10)].map((_, i) => (
            <Cloud
              key={i}
              position={[
                (Math.random() - 0.5) * 100,
                Math.random() * 20 + 10,
                (Math.random() - 0.5) * 100
              ]}
              speed={0.4}
              opacity={0.5}
            />
          ))}
          
          {/* Particle effects for atmosphere */}
          <Sparkles count={100} scale={20} size={0.5} speed={0.1} color="#90EE90" />
        </>
      );

    case 'studio':
      return (
        <>
          <Environment preset="studio" />
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2.5} 
            far={4.5} 
          />
          
          {/* Studio lighting setup */}
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <directionalLight position={[-10, 10, -5]} intensity={0.5} />
          <ambientLight intensity={0.3} />
        </>
      );

    default: // minimal
      return (
        <>
          <Environment preset="warehouse" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
        </>
      );
  }
};

// Performance-based post-processing effects
const PostProcessingEffects: React.FC<{ performance: string }> = ({ performance }) => {
  if (performance === 'low') return null;

  return (
    <EffectComposer>
      <Bloom 
        intensity={performance === 'ultra' ? 2.0 : 1.0} 
        threshold={0.1} 
        radius={0.9} 
      />
      
      {performance !== 'medium' && (
        <>
          <ChromaticAberration offset={[0.002, 0.002]} />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </>
      )}
      
      {performance === 'ultra' && (
        <Noise opacity={0.02} />
      )}
    </EffectComposer>
  );
};

// Loading component with 3D elements
const Scene3DLoader: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1]} />
      <meshStandardMaterial color="#8b5cf6" wireframe />
    </mesh>
  );
};

// Main Scene3D Component
export const Scene3D: React.FC<Scene3DProps> = ({
  children,
  environment = 'space',
  enableVR = false,
  enableAR = false,
  performance = 'high'
}) => {
  const { fps, drawCalls, triangles } = usePerformance3D();

  // Performance settings based on device capabilities
  const getPerformanceSettings = () => {
    switch (performance) {
      case 'low':
        return {
          shadows: false,
          antialias: false,
          pixelRatio: Math.min(window.devicePixelRatio, 1),
          powerPreference: 'low-power' as const
        };
      case 'medium':
        return {
          shadows: true,
          antialias: false,
          pixelRatio: Math.min(window.devicePixelRatio, 1.5),
          powerPreference: 'default' as const
        };
      case 'high':
        return {
          shadows: true,
          antialias: true,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
          powerPreference: 'high-performance' as const
        };
      case 'ultra':
        return {
          shadows: true,
          antialias: true,
          pixelRatio: window.devicePixelRatio,
          powerPreference: 'high-performance' as const
        };
      default:
        return {
          shadows: true,
          antialias: true,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
          powerPreference: 'high-performance' as const
        };
    }
  };

  const settings = getPerformanceSettings();

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows={settings.shadows}
        dpr={settings.pixelRatio}
        gl={{ 
          antialias: settings.antialias,
          powerPreference: settings.powerPreference,
          alpha: true,
          stencil: false,
          depth: true
        }}
        camera={{
          position: [0, 5, 15],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
          if (settings.shadows) {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }
        }}
      >
        <Suspense fallback={<Scene3DLoader />}>
          {/* Environment and lighting */}
          <AnimatedEnvironment type={environment} />
          
          {/* Soft shadows for better visual quality */}
          {settings.shadows && performance !== 'low' && <SoftShadows />}
          
          {/* Camera controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            autoRotate={false}
            autoRotateSpeed={0.5}
            dampingFactor={0.05}
            enableDamping
          />
          
          {/* Scene content */}
          {children}
          
          {/* Post-processing effects */}
          <PostProcessingEffects performance={performance} />
          
          {/* Bake shadows for better performance */}
          {settings.shadows && <BakeShadows />}
        </Suspense>
      </Canvas>
      
      {/* Performance monitor (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded text-xs font-mono">
          <div>FPS: {fps}</div>
          <div>Calls: {drawCalls}</div>
          <div>Triangles: {triangles}</div>
        </div>
      )}
    </div>
  );
};

// Specialized scene presets
export const SpaceScene3D: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Scene3D environment="space" performance="high">
    {children}
  </Scene3D>
);

export const CyberScene3D: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Scene3D environment="cyber" performance="high">
    {children}
  </Scene3D>
);

export const StudioScene3D: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Scene3D environment="studio" performance="medium">
    {children}
  </Scene3D>
);

export const NatureScene3D: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Scene3D environment="nature" performance="high">
    {children}
  </Scene3D>
);
