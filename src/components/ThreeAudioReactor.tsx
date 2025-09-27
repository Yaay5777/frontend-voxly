// frontend/src/components/ThreeAudioReactor.tsx
// Temporary: allow using r3f JSX until type shims load
// @ts-nocheck
import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ThreeAudioReactor({ enabled = false, analyser } : { enabled?: boolean, analyser: AnalyserNode | null }) {
  const groupRef = useRef<THREE.Group | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const sphereRef = useRef<THREE.Mesh | null>(null)
  const energyRef = useRef(0)

  // Prepare a data array for the analyser
  const dataArray = useMemo(() => {
    if (analyser) {
      return new Uint8Array(analyser.frequencyBinCount)
    }
    return null
  }, [analyser])

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const count = 1200
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i*3+0] = (Math.random()-0.5)*5
      pos[i*3+1] = (Math.random()-0.5)*5
      pos[i*3+2] = (Math.random()-0.5)*5
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos,3))
    return g
  }, [])

  const mat = useMemo(()=> new THREE.PointsMaterial({
    size: 0.018,
    sizeAttenuation: true,
    color: new THREE.Color('#a5f3fc'), // pastel cyan (tailwind sky-200)
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), [])

  useFrame((state, delta) => {
    if(groupRef.current) groupRef.current.rotation.y += delta * 0.025
    const p = particlesRef.current
    if(p) {
      let e = 0
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray)
        const len = Math.min(256, dataArray.length)
        // focus on bass/mids bins for visual stability
        const step = 8
        let count = 0
        for (let i=0;i<len;i+=step) { e += dataArray[i]; count++ }
        e = count>0 ? e / (count * 255) : 0 // normalize 0..1
      }
      // smooth energy to avoid jitter
      const smoothed = THREE.MathUtils.lerp(energyRef.current, e, 0.08)
      energyRef.current = smoothed
      const scale = THREE.MathUtils.clamp(1 + smoothed * 1.2, 1, 2.3)
      p.scale.setScalar(scale)
      ;(mat as any).opacity = THREE.MathUtils.clamp(0.2 + smoothed * 0.6, 0.2, 0.9)

      // subtle pulsation on the sphere
      if (sphereRef.current) {
        const s = THREE.MathUtils.clamp(1 + smoothed * 0.06, 1, 1.2)
        sphereRef.current.scale.setScalar(s)
      }
    }
  })

  if (!enabled) return null;

  return (
    <group ref={groupRef}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial color={'#5B21B6'} roughness={0.7} metalness={0.1} emissive={'#1b1140'} />
      </mesh>
      <points ref={particlesRef} geometry={geom as any} material={mat as any} />
    </group>
  )
}
