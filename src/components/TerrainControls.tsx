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
  autoRotate = false,
  onAutoRotateToggle,
}: TerrainControlsProps) => {
  const handleWireframeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onWireframeToggle(e.target.checked)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onColorChange(e.target.value)
  }

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = Number.parseFloat(e.target.value)
    onScaleChange(newScale)
  }

  const handleAutoRotateToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onAutoRotateToggle) {
      onAutoRotateToggle(e.target.checked)
    }
  }

  // Add a reset view button
  const handleResetView = () => {
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
          <option value="#4CAF50">Grass Green</option>
          <option value="#8BC34A">Light Green</option>
          <option value="#689F38">Dark Green</option>
          <option value="#8b4513">Brown</option>
          <option value="#708090">Gray</option>
        </select>
      </div>

      <div className="control-group">
        <label>Scale: {scale.toFixed(2)}</label>
        <input type="range" min="0.5" max="2.0" step="0.1" value={scale} onChange={handleScaleChange} />
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
