// @ts-nocheck
'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock, pointer }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.elapsedTime * 0.12
      meshRef.current.rotation.y = clock.elapsedTime * 0.18
    }
    if (lightRef.current) {
      lightRef.current.position.x = pointer.x * 4
      lightRef.current.position.y = pointer.y * 4
    }
  })

  return (
    <>
      <fog attach="fog" args={['#09090b', 8, 22]} />
      <ambientLight intensity={0.25} />
      <pointLight ref={lightRef} color="#6366f1" intensity={4} distance={10} position={[0, 0, 5]} />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshStandardMaterial
          color="#111113"
          emissive="#6366f1"
          emissiveIntensity={0.15}
          wireframe={true}
        />
      </mesh>
    </>
  )
}

export function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      dpr={[1, 2]}
    >
      <Scene />
    </Canvas>
  )
}
