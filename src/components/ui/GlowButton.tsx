import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface GlowButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'neon' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  glow?: boolean;
  pulse?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  glow = true,
  pulse = false,
  onClick,
  type = 'button',
  icon,
  iconPosition = 'left',
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-voxly-500 to-voxly-600 text-white hover:from-voxly-600 hover:to-voxly-700 focus:ring-voxly-500 shadow-lg hover:shadow-voxly-500/25',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500 shadow-lg hover:shadow-gray-500/25',
    accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 shadow-lg hover:shadow-accent-500/25',
    neon: 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:from-neon-purple hover:to-neon-pink focus:ring-neon-blue shadow-neon hover:shadow-neon-lg',
    ghost: 'bg-glass-100 text-gray-700 dark:text-gray-200 hover:bg-glass-200 focus:ring-voxly-500 border border-glass-200 backdrop-blur-md',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-3',
    xl: 'px-8 py-4 text-xl gap-3',
  };

  const glowClasses = glow && !disabled ? 'hover:shadow-2xl hover:scale-105' : '';
  const pulseClasses = pulse ? 'animate-pulse-slow' : '';

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glowClasses,
        pulseClasses,
        className
      )}
      onClick={onClick}
      disabled={isDisabled}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={!isDisabled ? { scale: 1.05 } : undefined}
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </>
        )}
      </div>
    </motion.button>
  );
};

export default GlowButton;
