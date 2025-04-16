"use client"

import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import type * as THREE from "three"
import { Box3, BufferAttribute, BufferGeometry, Vector3 } from "three"

interface TerrainMeshProps {
  vertices: number[]
  indices: number[]
  wireframe: boolean
  color: string
  scale: number
  autoRotate?: boolean
}

const TerrainMesh = ({ vertices, indices, wireframe, color, scale, autoRotate = true }: TerrainMeshProps) => {
  // Use a properly typed ref for the mesh and material
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  // Process and normalize the terrain data
  const geometry = useMemo(() => {
    const geometry = new BufferGeometry()

    // Create a new Float32Array for positions
    const positions = new Float32Array(vertices)

    // Set the position attribute (3 components per vertex)
    geometry.setAttribute("position", new BufferAttribute(positions, 3))

    // Set the indices for the faces
    geometry.setIndex(indices)

    // Compute vertex normals for proper lighting
    geometry.computeVertexNormals()

    // Center the geometry at origin
    geometry.center()

    return geometry
  }, [vertices, indices])

  // Update material when props change
  useEffect(() => {
    if (materialRef.current) {
      console.log("Updating material with color:", color, "wireframe:", wireframe)
      materialRef.current.color.set(color)
      materialRef.current.wireframe = wireframe
      materialRef.current.needsUpdate = true
    }
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
    }
  }, [geometry, scale])

  // Add rotation animation if enabled
  useFrame(() => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      scale={[scale, scale, scale]}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]} // Reset rotation to ensure consistent initial view
    >
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        roughness={0.8}
        metalness={0.2}
        flatShading={true}
        wireframe={wireframe}
      />
    </mesh>
  )
}

export default TerrainMesh
