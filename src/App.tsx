"use client"

import { Suspense, useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import TerrainMesh from "./components/TerrainMesh"
import TerrainControls from "./components/TerrainControls"
import terrainData from "./data/terrain-data.json"
import "./App.css"

function App() {
  const [loading, setLoading] = useState(true)
  const [wireframe, setWireframe] = useState(true) // Set to true by default to match UI
  const [color, setColor] = useState("#708090") // Set to gray by default to match UI
  const [scale, setScale] = useState(0.05)
  const [autoRotate, setAutoRotate] = useState(true)

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

  // For debugging
  useEffect(() => {
    console.log("State changed:", { wireframe, color, scale, autoRotate })
  }, [wireframe, color, scale, autoRotate])

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
                <axesHelper args={[5]} />
                <gridHelper args={[20, 20, "#888888", "#444444"]} />

                <TerrainMesh
                  vertices={terrainData.vertices}
                  indices={terrainData.indices}
                  wireframe={wireframe}
                  color={color}
                  scale={scale}
                  autoRotate={autoRotate}
                />
              </Suspense>
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={200} />
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
