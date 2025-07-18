import { useLoader, useFrame } from '@react-three/fiber'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'
import { useRef, useMemo } from 'react'

// RotatingEnvironmentSphere component to render a rotating sphere with a given HDRI texture
export default function RotatingEnvironmentSphere({
  hdriURL = '/textures/hdri/hdri_1.hdr',
  speed = 0.001
}) {
  const meshRef = useRef()
  
  const texture = useLoader(RGBELoader, hdriURL)
  
  const material = useMemo(() => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearMipMapLinearFilter
    
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      depthWrite: false
    })
  }, [texture])
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * speed
    }
  })
  
  return (
      <mesh ref={meshRef} scale={100}>
        <sphereGeometry args={[1, 60, 40]} />
        <primitive object={material} attach="material" />
      </mesh>
  )
}
