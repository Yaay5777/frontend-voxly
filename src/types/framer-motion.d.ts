// frontend/src/types/framer-motion.d.ts
import 'framer-motion';
import * as React from 'react';

declare module 'framer-motion' {
  // Allow className and normal HTML attributes on motion.* elements
  export interface HTMLMotionProps<T> extends React.HTMLAttributes<T> {}
  // Also allow SVGMotionProps to accept className for svg motion elements
  export interface SVGAttribs extends React.SVGAttributes<SVGElement> {}
}
export {};
