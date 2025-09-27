/// <reference types="vite/client" />
/// <reference types="framer-motion" />

// Extend the Window interface to include any global variables
declare global {
  interface Window {
    // Add any global variables here if needed
  }

  // Add type declarations for JSX elements used in Three.js
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
      // Add other Three.js elements as needed
    }
  }
}

// Extend the Motion component props to include className
declare module 'framer-motion' {
  export interface HTMLMotionProps<T> extends React.HTMLAttributes<T> {
    className?: string;
  }
}

// Define types for the application
type AudioFile = {
  id: string;
  filename: string;
  url: string;
  size: number;
  created_at: string;
  voice_id: string;
  text: string;
  duration: number;
  language: string;
};

type QuotaInfo = {
  weekly_quota: number;
  weekly_used: number;
  monthly_quota: number;
  monthly_used: number;
};

type Voice = {
  id: string;
  name: string;
  gender: string;
  language: string;
  flag?: string; // Made optional as it might not exist on all voice objects
  // Add other voice properties as needed
};

// Add any other global types here as needed
