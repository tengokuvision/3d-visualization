"use client"

import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense, useEffect, useState } from "react"
import "./App.css"
import TerrainControls from "./components/TerrainControls"
import TerrainMesh from "./components/TerrainMesh"
import terrainData from "./data/terrain-data.json"

function App() {
  const [loading, setLoading] = useState(true)
  const [wireframe, setWireframe] = useState(false)
  const [color, setColor] = useState("#6b8e23")
  const [scale, setScale] = useState(0.1)

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
        <h1>3D Terrain Visualization</h1>
      </header>

      <main>
        {loading ? (
          <div className="loading">Loading terrain data...</div>
        ) : (
          <div className="canvas-container">
            <Canvas shadows>
              <color attach="background" args={["#f0f0f0"]} />
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <Suspense fallback={null}>
                <TerrainMesh
                  vertices={terrainData.vertices}
                  indices={terrainData.indices}
                  wireframe={wireframe}
                  color={color}
                  scale={scale}
                />
              </Suspense>
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={200} />
              <PerspectiveCamera makeDefault position={[0, 10, 30]} fov={60} />
            </Canvas>

            <div className="controls-container">
              <TerrainControls
                wireframe={wireframe}
                onWireframeToggle={setWireframe}
                color={color}
                onColorChange={setColor}
                scale={scale}
                onScaleChange={setScale}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
