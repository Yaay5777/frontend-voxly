import React, { useRef, useMemo } from 'react';
// Removed WebGL imports to prevent context overflow
import { useThemeStore } from '../../store/useThemeStore';

interface ParticleSystemProps {
  count?: number;
  speed?: number;
  color?: string;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  count = 1000, 
  speed = 0.5,
  color = '#3b82f6'
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    
    return positions;
  }, [count]);

  // Animate particles
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime * speed;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Floating motion
      positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.001;
      
      // Wrap around when particles go too far
      if (positions[i3 + 1] > 10) {
        positions[i3 + 1] = -10;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.05;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
};

const ParticleBackground: React.FC = () => {
  const { isDark, theme } = useThemeStore();
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Optimized CSS-based particle effect - No WebGL */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className={`absolute inset-0 opacity-60 ${
          isDark 
            ? 'bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-pink-900/40' 
            : 'bg-gradient-to-br from-blue-100/60 via-purple-100/50 to-pink-100/60'
        }`} />
        
        {/* CSS-based floating particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? 'bg-white/20' : 'bg-purple-400/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* CSS Gradient Overlay */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900/90 via-purple-900/80 to-blue-900/90' 
          : 'bg-gradient-to-br from-blue-50/90 via-purple-50/80 to-pink-50/90'
      }`} />
    </div>
  );
};

export default ParticleBackground;
