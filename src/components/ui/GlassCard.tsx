import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'accent' | 'neon';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  hover?: boolean;
  onClick?: () => void;
  as?: keyof JSX.IntrinsicElements;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  blur = 'md',
  glow = false,
  hover = true,
  onClick,
  as: Component = 'div',
}) => {
  const baseClasses = 'relative rounded-2xl border transition-all duration-300 ease-out';
  
  const variantClasses = {
    default: 'bg-glass-100 border-glass-200 backdrop-blur-md shadow-glass',
    dark: 'bg-dark-100 border-dark-200 backdrop-blur-md shadow-glass-lg',
    accent: 'bg-gradient-to-br from-accent-500/20 to-voxly-500/20 border-accent-300/30 backdrop-blur-lg shadow-glass-xl',
    neon: 'bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 border-neon-blue/30 backdrop-blur-xl shadow-neon',
  };

  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const hoverClasses = hover ? 'hover:scale-[1.02] hover:shadow-glass-xl hover:border-glass-300' : '';
  const glowClasses = glow ? 'shadow-neon animate-glow' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      as={Component}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        blurClasses[blur],
        hoverClasses,
        glowClasses,
        clickableClasses,
        className
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Animated border gradient */}
      {variant === 'neon' && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-30 blur-sm animate-gradient" />
      )}
    </motion.div>
  );
};

export default GlassCard;
