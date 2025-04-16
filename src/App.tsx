"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import GrassyTerrain from "./components/GrassyTerrain"
import TerrainControls from "./components/TerrainControls"
import "./App.css"

// Camera animation component
function CameraAnimation() {
  const { camera } = useThree()
  const initialY = useRef(camera.position.y)
  const time = useRef(0)

  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 15, 30)
    camera.lookAt(0, 0, 0)
    initialY.current = camera.position.y
  }, [camera])

  // Animate camera up and down
  useFrame((state, delta) => {
    time.current += delta
    // Gentle up and down motion
    camera.position.y = initialY.current + Math.sin(time.current * 0.5) * 2
    camera.lookAt(0, 0, 0)
  })

  return null
}

function App() {
  const [loading, setLoading] = useState(true)
  const [wireframe, setWireframe] = useState(false)
  const [color, setColor] = useState("#4CAF50") // More grass-like green
  const [scale, setScale] = useState(1.0) // Larger scale for the terrain
  const [autoRotate, setAutoRotate] = useState(false) // Disable auto-rotate by default for landscape

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "w") {
        setWireframe((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="app-container">
      <header>
        <h1>Grassy Terrain Visualization</h1>
      </header>

      <main>
        {loading ? (
          <div className="loading">Loading terrain data...</div>
        ) : (
          <div className="canvas-container">
            <Canvas shadows>
              <CameraAnimation />
              <color attach="background" args={["#87CEEB"]} /> {/* Sky blue background */}
              <ambientLight intensity={0.6} /> {/* Brighter ambient light */}
              <directionalLight
                position={[10, 20, 10]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <Suspense fallback={null}>
                <gridHelper args={[100, 100, "#888888", "#444444"]} position={[0, -0.01, 0]} />
                <GrassyTerrain wireframe={wireframe} color={color} scale={scale} autoRotate={autoRotate} />
              </Suspense>
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={200}
                maxPolarAngle={Math.PI / 2 - 0.1} // Prevent camera from going below the ground
              />
            </Canvas>

            <div className="controls-container">
              <TerrainControls
                wireframe={wireframe}
                onWireframeToggle={setWireframe}
                color={color}
                onColorChange={setColor}
                scale={scale}
                onScaleChange={setScale}
                autoRotate={autoRotate}
                onAutoRotateToggle={setAutoRotate}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
