// Custom type declarations for packages without proper TypeScript support

declare module '@react-three/postprocessing' {
  import { ReactNode } from 'react';
  import { Object3D } from 'three';

  export interface EffectComposerProps {
    children?: ReactNode;
    camera?: any;
    scene?: any;
    enabled?: boolean;
    renderPriority?: number;
    autoClear?: boolean;
    multisampling?: number;
    frameBufferType?: any;
    stencilBuffer?: boolean;
    depthBuffer?: boolean;
  }

  export interface BloomProps {
    intensity?: number;
    luminanceThreshold?: number;
    luminanceSmoothing?: number;
    height?: number;
    opacity?: number;
    kernelSize?: number;
    mipmapBlur?: boolean;
  }

  export interface ChromaticAberrationProps {
    offset?: [number, number];
    radialModulation?: boolean;
    modulationOffset?: number;
  }

  export const EffectComposer: React.FC<EffectComposerProps>;
  export const Bloom: React.FC<BloomProps>;
  export const ChromaticAberration: React.FC<ChromaticAberrationProps>;
}

declare module 'leva' {
  export interface LevaProps {
    collapsed?: boolean;
    oneLineLabels?: boolean;
    hideTitleBar?: boolean;
    titleBar?: boolean | { title?: string; drag?: boolean; filter?: boolean };
    theme?: any;
    fill?: boolean;
    flat?: boolean;
    neverHide?: boolean;
    hidden?: boolean;
  }

  export const Leva: React.FC<LevaProps>;
  export function useControls(name?: string, controls?: any): any;
  export function useControls(controls: any): any;
  export function button(fn: () => void, opts?: any): any;
  export function folder(name: string, controls: any, opts?: any): any;
}

// Extend framer-motion types for better compatibility
declare module 'framer-motion' {
  export interface HTMLMotionProps<T extends keyof HTMLElementTagNameMap> {
    href?: string;
    target?: string;
    rel?: string;
    layoutId?: string;
    onClick?: (event: React.MouseEvent<HTMLElementTagNameMap[T], MouseEvent>) => void;
  }
}

// Extend THREE.js types for BufferAttribute
declare module 'three' {
  interface BufferAttribute {
    array: TypedArray;
  }
  
  interface InterleavedBufferAttribute {
    array?: TypedArray;
  }
}
