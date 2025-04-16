"use client"

import { useRef, useEffect } from "react"
import { type ShaderMaterial, Color } from "three"
import { useFrame } from "@react-three/fiber"

interface HeightMapMaterialProps {
  colorMode: string
  wireframe: boolean
  minHeight: number
  maxHeight: number
}

const HeightMapMaterial = ({ colorMode, wireframe, minHeight, maxHeight }: HeightMapMaterialProps) => {
  const materialRef = useRef<ShaderMaterial>(null)

  const vertexShader = `
    varying float vHeight;
    
    void main() {
      vHeight = position.z;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform vec3 lowColor;
    uniform vec3 midColor;
    uniform vec3 highColor;
    uniform float minHeight;
    uniform float maxHeight;
    uniform float time;
    uniform int colorMode;
    
    varying float vHeight;
    
    void main() {
      float normalizedHeight = (vHeight - minHeight) / (maxHeight - minHeight);
      
      vec3 color;
      
      if (colorMode == 0) {
        color = midColor;
      } 
      else if (colorMode == 1) {
        if (normalizedHeight < 0.33) {
          float t = normalizedHeight / 0.33;
          color = mix(lowColor, midColor, t);
        } else if (normalizedHeight < 0.66) {
          float t = (normalizedHeight - 0.33) / 0.33;
          color = mix(midColor, highColor, t);
        } else {
          color = highColor;
        }
      }
      else if (colorMode == 2) {
        float animatedHeight = normalizedHeight + sin(time * 0.5 + vHeight * 0.1) * 0.1;
        animatedHeight = clamp(animatedHeight, 0.0, 1.0);
        
        if (animatedHeight < 0.33) {
          float t = animatedHeight / 0.33;
          color = mix(lowColor, midColor, t);
        } else if (animatedHeight < 0.66) {
          float t = (animatedHeight - 0.33) / 0.33;
          color = mix(midColor, highColor, t);
        } else {
          color = highColor;
        }
      }
      
      gl_FragColor = vec4(color, 1.0);
    }
  `

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.wireframe = wireframe

      if (colorMode === "solid") {
        materialRef.current.uniforms.colorMode.value = 0
      } else if (colorMode === "height") {
        materialRef.current.uniforms.colorMode.value = 1
      } else if (colorMode === "gradient") {
        materialRef.current.uniforms.colorMode.value = 2
      }
    }
  }, [colorMode, wireframe])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      wireframe={wireframe}
      uniforms={{
        lowColor: { value: new Color("#2c7fb8") },
        midColor: { value: new Color("#7fcdbb") },
        highColor: { value: new Color("#edf8b1") },
        minHeight: { value: minHeight },
        maxHeight: { value: maxHeight },
        time: { value: 0 },
        colorMode: { value: colorMode === "solid" ? 0 : colorMode === "height" ? 1 : 2 },
      }}
    />
  )
}

export default HeightMapMaterial
