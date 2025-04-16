"use client"

import { useRef, useMemo } from "react"
import type * as THREE from "three"
import { BufferGeometry, BufferAttribute, MeshStandardMaterial } from "three"
import { useFrame } from "@react-three/fiber"

interface TerrainMeshProps {
  vertices: number[]
  indices: number[]
  wireframe: boolean
  color: string
  scale: number
}

const TerrainMesh = ({ vertices, indices, wireframe, color, scale }: TerrainMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const geometry = new BufferGeometry()
    const positions = new Float32Array(vertices)
    geometry.setAttribute("position", new BufferAttribute(positions, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()
    geometry.center()
    return geometry
  }, [vertices, indices])

  const material = useMemo(() => {
    return new MeshStandardMaterial({
      color: color,
      roughness: 0.8,
      metalness: 0.2,
      flatShading: true,
      wireframe: wireframe,
    })
  }, [color, wireframe])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
      scale={[scale, scale, scale]}
    />
  )
}

export default TerrainMesh
