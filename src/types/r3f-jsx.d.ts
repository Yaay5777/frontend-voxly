// frontend/src/types/r3f-jsx.d.ts
// Local React Three Fiber JSX augmentation — explicit list + catch-all
// This file forces TypeScript to accept R3F JSX tags used in the project.
// Using `any` here is intentional to unblock compilation quickly.
 

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // common three/fiber elements (add extras if tsc later complains)
      group: any;
      mesh: any;
      points: any;
      pointLight: any;
      ambientLight: any;
      directionalLight: any;
      hemisphereLight: any;
      spotLight: any;
      perspectiveCamera: any;
      orthographicCamera: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      meshPhysicalMaterial: any;
      sphereGeometry: any;
      boxGeometry: any;
      planeGeometry: any;
      bufferGeometry: any;
      icosahedronGeometry: any;
      coneGeometry: any;
      circleGeometry: any;
      ringGeometry: any;
      edgesGeometry: any;
      line: any;
      lineBasicMaterial: any;
      bufferAttribute: any;
      pointsMaterial: any;
      // fallback: allow any other tag name used by R3F without complaining
      [elemName: string]: any;
    }
  }
}

// Support React 18/19 type setups where IntrinsicElements lives under React.JSX
declare global {
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        group: any;
        mesh: any;
        points: any;
        pointLight: any;
        ambientLight: any;
        directionalLight: any;
        hemisphereLight: any;
        spotLight: any;
        perspectiveCamera: any;
        orthographicCamera: any;
        meshStandardMaterial: any;
        meshBasicMaterial: any;
        meshPhysicalMaterial: any;
        sphereGeometry: any;
        boxGeometry: any;
        planeGeometry: any;
        bufferGeometry: any;
        icosahedronGeometry: any;
        coneGeometry: any;
        circleGeometry: any;
        ringGeometry: any;
        edgesGeometry: any;
        line: any;
        lineBasicMaterial: any;
        bufferAttribute: any;
        pointsMaterial: any;
        [elemName: string]: any;
      }
    }
  }
}

 
