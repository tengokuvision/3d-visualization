"use client"

import { useRef, useMemo, useEffect } from "react"
import type * as THREE from "three"
import { BufferGeometry, BufferAttribute, MeshStandardMaterial, Box3, Vector3 } from "three"
import { useFrame, useThree } from "@react-three/fiber"

interface TerrainMeshProps {
  vertices: number[]
  indices: number[]
  wireframe: boolean
  color: string
  scale: number
}

const TerrainMesh = ({ vertices, indices, wireframe, color, scale }: TerrainMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { scene } = useThree()

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

  // Log terrain information for debugging
  useEffect(() => {
    if (meshRef.current) {
      const box = new Box3().setFromObject(meshRef.current)
      const size = new Vector3()
      box.getSize(size)

      console.log("Terrain size:", size)
      console.log("Terrain position:", meshRef.current.position)
      console.log("Terrain scale:", meshRef.current.scale)

      // Force scene update
      scene.updateMatrixWorld(true)
    }
  }, [scene, geometry, scale])

  // Add subtle rotation animation
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
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

export default TerrainMesh
