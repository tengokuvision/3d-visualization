"use client"

import { useRef, useMemo, useEffect } from "react"
import type * as THREE from "three"
import { BufferGeometry, BufferAttribute, Vector3, Box3 } from "three"
import { useFrame } from "@react-three/fiber"

interface GrassyTerrainProps {
  wireframe: boolean
  color: string
  scale: number
  autoRotate?: boolean
  resolution?: number
  size?: number
}

const GrassyTerrain = ({
  wireframe,
  color,
  scale,
  autoRotate = false,
  resolution = 100,
  size = 100,
}: GrassyTerrainProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  // Generate procedural terrain that looks like a grassy field
  const geometry = useMemo(() => {
    const geometry = new BufferGeometry()

    // Create a grid of vertices
    const gridSize = resolution
    const segmentSize = size / (gridSize - 1)

    const vertices = []
    const uvs = []

    for (let z = 0; z < gridSize; z++) {
      for (let x = 0; x < gridSize; x++) {
        const xPos = x * segmentSize - size / 2
        const zPos = z * segmentSize - size / 2

        // Generate height using multiple noise functions for natural-looking terrain
        // Here we use a simple sine/cosine combination for gentle rolling hills
        const frequency1 = 0.02
        const frequency2 = 0.05
        const frequency3 = 0.1

        // Base height - gentle rolling hills
        let height = Math.sin(xPos * frequency1) * Math.cos(zPos * frequency1) * 2

        // Add medium-scale variation
        height += Math.sin(xPos * frequency2 + 0.5) * Math.cos(zPos * frequency2 + 0.5) * 1

        // Add small-scale variation (grass-like)
        const smallScale = Math.sin(xPos * frequency3 + 1.5) * Math.cos(zPos * frequency3 + 1.5) * 0.5

        // Add some random variation for more natural look
        const random = Math.random() * 0.2

        // Combine all height components
        const yPos = height + smallScale + random

        // Add vertex
        vertices.push(xPos, yPos, zPos)

        // Add UV coordinates for potential texturing
        uvs.push(x / (gridSize - 1), z / (gridSize - 1))
      }
    }

    // Create indices for triangles
    const indices = []
    for (let z = 0; z < gridSize - 1; z++) {
      for (let x = 0; x < gridSize - 1; x++) {
        const topLeft = z * gridSize + x
        const topRight = topLeft + 1
        const bottomLeft = (z + 1) * gridSize + x
        const bottomRight = bottomLeft + 1

        // Create two triangles for each grid cell
        indices.push(topLeft, bottomLeft, topRight)
        indices.push(topRight, bottomLeft, bottomRight)
      }
    }

    // Set attributes
    const positions = new Float32Array(vertices)
    geometry.setAttribute("position", new BufferAttribute(positions, 3))

    const uv = new Float32Array(uvs)
    geometry.setAttribute("uv", new BufferAttribute(uv, 2))

    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    return geometry
  }, [resolution, size])

  // Update material when props change
  useEffect(() => {
    if (materialRef.current) {
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
      rotation={[0, 0, 0]}
      receiveShadow
      castShadow
    >
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        roughness={0.9}
        metalness={0.1}
        flatShading={false}
        wireframe={wireframe}
      />
    </mesh>
  )
}

export default GrassyTerrain
