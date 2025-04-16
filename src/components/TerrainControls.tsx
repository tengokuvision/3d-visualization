"use client"

import type React from "react"

interface TerrainControlsProps {
  wireframe: boolean
  onWireframeToggle: (enabled: boolean) => void
  color: string
  onColorChange: (color: string) => void
  scale: number
  onScaleChange: (scale: number) => void
  autoRotate?: boolean
  onAutoRotateToggle?: (enabled: boolean) => void
}

const TerrainControls = ({
  wireframe,
  onWireframeToggle,
  color,
  onColorChange,
  scale,
  onScaleChange,
  autoRotate = true,
  onAutoRotateToggle,
}: TerrainControlsProps) => {
  const handleWireframeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Wireframe toggle clicked, new value:", e.target.checked)
    onWireframeToggle(e.target.checked)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Color changed to:", e.target.value)
    onColorChange(e.target.value)
  }

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = Number.parseFloat(e.target.value)
    console.log("Scale changed to:", newScale)
    onScaleChange(newScale)
  }

  const handleAutoRotateToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onAutoRotateToggle) {
      console.log("Auto-rotate toggle clicked, new value:", e.target.checked)
      onAutoRotateToggle(e.target.checked)
    }
  }

  // Add a reset view button
  const handleResetView = () => {
    // This will reload the page, resetting the camera
    window.location.reload()
  }

  return (
    <div className="terrain-controls">
      <div className="control-group">
        <label>
          <input type="checkbox" checked={wireframe} onChange={handleWireframeToggle} />
          Wireframe (or press 'w')
        </label>
      </div>

      <div className="control-group">
        <label>
          <input type="checkbox" checked={autoRotate} onChange={handleAutoRotateToggle} />
          Auto-rotate
        </label>
      </div>

      <div className="control-group">
        <label>Color:</label>
        <select value={color} onChange={handleColorChange}>
          <option value="#6b8e23">Green</option>
          <option value="#8b4513">Brown</option>
          <option value="#4682b4">Blue</option>
          <option value="#708090">Gray</option>
          <option value="#cd853f">Tan</option>
        </select>
      </div>

      <div className="control-group">
        <label>Scale: {scale.toFixed(2)}</label>
        <input type="range" min="0.01" max="0.5" step="0.01" value={scale} onChange={handleScaleChange} />
      </div>

      <div className="control-group">
        <button onClick={handleResetView} className="reset-button">
          Reset View
        </button>
      </div>
    </div>
  )
}

export default TerrainControls
