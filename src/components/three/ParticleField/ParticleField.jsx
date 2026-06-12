/**
 * ParticleField
 * 3D floating particle system for Hero background atmosphere.
 * Uses BufferGeometry + Points for optimal performance.
 * Particles drift upward and respond to mouse position.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ParticleField = ({
  count = 2000,
  mouseX = 0,
  mouseY = 0,
  color = "#39ff14b8",
  secondaryColor = "#3B82F6",
  spread = 20,
  depth = 15,
}) => {
  const pointsRef = useRef(null);
  const timeRef = useRef(0);

  // Generate particle positions, velocities, and sizes once
  const { positions, colors, sizes, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    const neonColor = new THREE.Color(color);
    const blueColor = new THREE.Color(secondaryColor);
    const whiteColor = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random position in a sphere-ish volume
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 1] = (Math.random() - 0.5) * spread * 0.8;
      positions[i3 + 2] = (Math.random() - 0.5) * depth;

      // Assign color — mostly white with neon and blue accents
      const colorChoice = Math.random();
      let chosenColor;
      if (colorChoice < 0.15) {
        chosenColor = neonColor;
      } else if (colorChoice < 0.25) {
        chosenColor = blueColor;
      } else {
        chosenColor = whiteColor;
      }

      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;

      // Varied sizes — smaller particles dominant
      sizes[i] = Math.random() * 2.5 + 0.5;

      // Slow upward drift with slight horizontal sway
      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = Math.random() * 0.004 + 0.001;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    return { positions, colors, sizes, velocities };
  }, [count, color, secondaryColor, spread, depth]);

  // Mutable positions ref for animation
  const positionsRef = useRef(positions.slice());

  // Shader material for circular particles with soft edges
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouseX: { value: 0 },
        uMouseY: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;
        uniform float uTime;
        uniform float uMouseX;
        uniform float uMouseY;

        void main() {
          vColor = color;

          vec3 pos = position;

          // Subtle wave motion
          pos.x += sin(uTime * 0.5 + pos.y * 0.3) * 0.1;
          pos.y += cos(uTime * 0.3 + pos.x * 0.2) * 0.05;

          // Mouse influence (very subtle)
          pos.x += uMouseX * 0.3;
          pos.y += uMouseY * 0.3;

          // Depth-based opacity
          vOpacity = clamp(1.0 - (abs(pos.z) / 10.0), 0.1, 0.8);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Perspective-correct size
          gl_PointSize = size * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          // Circular soft particle
          vec2 uv = gl_PointCoord - vec2(0.5);
          float dist = length(uv);
          if (dist > 0.5) discard;

          // Soft edge falloff
          float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;

          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    timeRef.current += delta;
    material.uniforms.uTime.value = timeRef.current;
    material.uniforms.uMouseX.value = mouseX * 0.5;
    material.uniforms.uMouseY.value = mouseY * 0.5;

    // Update particle positions for upward drift
    const pos = pointsRef.current.geometry.attributes.position;
    const halfSpread = spread / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      positionsRef.current[i3] += velocities[i3];
      positionsRef.current[i3 + 1] += velocities[i3 + 1];
      positionsRef.current[i3 + 2] += velocities[i3 + 2];

      // Wrap particles that drift too far
      if (positionsRef.current[i3 + 1] > halfSpread * 0.8) {
        positionsRef.current[i3 + 1] = -halfSpread * 0.8;
      }
      if (Math.abs(positionsRef.current[i3]) > halfSpread) {
        positionsRef.current[i3] = -positionsRef.current[i3] * 0.9;
      }

      pos.setXYZ(
        i,
        positionsRef.current[i3],
        positionsRef.current[i3 + 1],
        positionsRef.current[i3 + 2],
      );
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
};

export default ParticleField;
