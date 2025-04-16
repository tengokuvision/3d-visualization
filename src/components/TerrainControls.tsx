"use client"

import type React from "react"

interface TerrainControlsProps {
  wireframe: boolean
  onWireframeToggle: (enabled: boolean) => void
  color: string
  onColorChange: (color: string) => void
  scale: number
  onScaleChange: (scale: number) => void
}

const TerrainControls = ({
  wireframe,
  onWireframeToggle,
  color,
  onColorChange,
  scale,
  onScaleChange,
}: TerrainControlsProps) => {
  const handleWireframeToggle = () => {
    onWireframeToggle(!wireframe)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onColorChange(e.target.value)
  }

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onScaleChange(Number.parseFloat(e.target.value))
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
    </div>
  )
}

export default TerrainControls
