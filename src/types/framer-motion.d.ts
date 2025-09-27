// frontend/src/types/framer-motion.d.ts
import * as React from 'react';

declare module 'framer-motion' {
  // Re-export all types from framer-motion
  export * from 'framer-motion';
  
  // Allow className and normal HTML attributes on motion.* elements
  export interface HTMLMotionProps<T> extends React.HTMLAttributes<T> {
    className?: string;
    style?: React.CSSProperties;
    initial?: any;
    animate?: any;
    exit?: any;
    variants?: any;
    transition?: any;
    whileHover?: any;
    whileTap?: any;
    drag?: any;
    dragConstraints?: any;
    onHoverStart?: any;
    onHoverEnd?: any;
    onTap?: any;
    onTapStart?: any;
    onTapCancel?: any;
    onDragStart?: any;
    onDragEnd?: any;
    onAnimationComplete?: any;
    layout?: any;
    custom?: any;
    disabled?: boolean;
    type?: string;
    whileInView?: VariantLabels | TargetAndTransition;
    viewport?: ViewportOptions;
  }
  
  export interface MotionProps extends HTMLMotionProps<"div"> {
    // Additional motion props can be added here
  }
  
  // Also allow SVGMotionProps to accept className for svg motion elements
  export interface SVGMotionProps<T> extends React.SVGAttributes<T> {
    className?: string;
    style?: React.CSSProperties;
  }
  
  // Motion components
  export const motion: {
    [key: string]: React.ForwardRefExoticComponent<
      React.PropsWithoutRef<{}> & 
      React.RefAttributes<HTMLElement> &
      HTMLMotionProps<HTMLElement>
    >;
  };
  
  // AnimatePresence component
  export const AnimatePresence: React.FC<{
    children?: React.ReactNode;
    initial?: boolean;
    custom?: any;
    onExitComplete?: () => void;
    exitBeforeEnter?: boolean;
  }>;
  
  // Other motion components
  export const m: typeof motion;
  
  // Hooks
  export function useAnimation(): any;
  export function useCycle(...items: any[]): [any, () => void, (i: number) => void];
  export function useInView(ref: React.RefObject<HTMLElement> | HTMLElement | null, options?: any): boolean;
  export function useReducedMotion(): boolean;
  export function useScroll(options?: any): { scrollX: any; scrollY: any; scrollXProgress: any; scrollYProgress: any };
  export function useSpring(source: any, config?: any): any;
  export function useTransform<T>(value: any, input: any, output: any, options?: any): T;
  export function useViewportScroll(): { scrollX: any; scrollY: any; scrollXProgress: any; scrollYProgress: any };
  
  // Animation types
  export interface AnimationControls {
    start: (definition: any) => Promise<any>;
    set: (definition: any) => void;
    stop: () => void;
  }
}
export {};
