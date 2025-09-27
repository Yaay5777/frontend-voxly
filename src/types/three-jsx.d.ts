import * as THREE from 'three';
import * as React from 'react';
import { ReactThreeFiber } from '@react-three/fiber';

type ThreeElements = {
  // Lights
  ambientLight: ReactThreeFiber.Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
  pointLight: ReactThreeFiber.Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
  directionalLight: ReactThreeFiber.Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
  spotLight: ReactThreeFiber.Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>;
  hemisphereLight: ReactThreeFiber.Object3DNode<THREE.HemisphereLight, typeof THREE.HemisphereLight>;
  
  // Objects
  mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
  group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
  
  // Geometries
  boxGeometry: ReactThreeFiber.BufferGeometryNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
  sphereGeometry: ReactThreeFiber.BufferGeometryNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
  planeGeometry: ReactThreeFiber.BufferGeometryNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
  cylinderGeometry: ReactThreeFiber.BufferGeometryNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>;
  torusGeometry: ReactThreeFiber.BufferGeometryNode<THREE.TorusGeometry, typeof THREE.TorusGeometry>;
  
  // Materials
  meshBasicMaterial: ReactThreeFiber.MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
  meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
  meshPhongMaterial: ReactThreeFiber.MaterialNode<THREE.MeshPhongMaterial, typeof THREE.MeshPhongMaterial>;
  meshLambertMaterial: ReactThreeFiber.MaterialNode<THREE.MeshLambertMaterial, typeof THREE.MeshLambertMaterial>;
  meshToonMaterial: ReactThreeFiber.MaterialNode<THREE.MeshToonMaterial, typeof THREE.MeshToonMaterial>;
  
  // Helpers
  gridHelper: ReactThreeFiber.Object3DNode<THREE.GridHelper, typeof THREE.GridHelper>;
  axesHelper: ReactThreeFiber.Object3DNode<THREE.AxesHelper, typeof THREE.AxesHelper>;
  
  // Controls
  orbitControls: ReactThreeFiber.Node<THREE.OrbitControls, typeof THREE.OrbitControls>;
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// Extend the Window interface to include any global variables
declare global {
  interface Window {
    __THREE_DEVTOOLS__: any;
  }
}

// Extend the CanvasRenderingContext2D to include getExtension
declare var CanvasRenderingContext2D: {
  prototype: CanvasRenderingContext2D;
  new(): CanvasRenderingContext2D;
  getExtension(extension: string): any;
};
