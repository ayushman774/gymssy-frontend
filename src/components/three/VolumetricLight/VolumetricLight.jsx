/**
 * VolumetricLight
 * Creates volumetric god-ray style lighting effects for the hero scene.
 * Uses cone geometry with custom shader for light shaft simulation.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VolumetricLight = ({
  position = [0, 5, 0],
  color = "#39FF14",
  intensity = 0.4,
  angle = 0.3,
  height = 8,
  radius = 2.5,
}) => {
  const meshRef = useRef(null);
  const timeRef = useRef(0);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uIntensity: { value: intensity },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vHeight;

        void main() {
          vUv = uv;
          vHeight = position.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uTime;
        varying vec2 vUv;
        varying float vHeight;

        void main() {
          // Fade from top (bright) to bottom (dim)
          float heightFade = 1.0 - vUv.y;

          // Radial fade (bright center, fade at edges)
          float radialDist = distance(vUv, vec2(0.5, 0.5)) * 2.0;
          float radialFade = 1.0 - smoothstep(0.0, 1.0, radialDist);

          // Slow shimmer flicker
          float flicker = sin(uTime * 1.5) * 0.05 + 0.95;

          float alpha = heightFade * radialFade * uIntensity * flicker * 0.35;

          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
  }, [color, intensity]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (material.uniforms) {
      material.uniforms.uTime.value = timeRef.current;
    }
    if (meshRef.current) {
      // Gentle rotation of light shaft
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Primary neon green shaft */}
      <mesh ref={meshRef} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[radius, height, 32, 1, true]} />
        <primitive object={material} />
      </mesh>

      {/* Actual Three.js light source */}
      <spotLight
        color={color}
        intensity={intensity * 80}
        angle={angle}
        penumbra={0.8}
        distance={20}
        castShadow={false}
      />
    </group>
  );
};

export default VolumetricLight;
