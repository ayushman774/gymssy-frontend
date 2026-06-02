/**
 * AthleteModel
 * Procedural 3D athlete figure using Three.js geometries.
 * No external GLB required — fully self-contained.
 *
 * Features:
 *  - Anatomically proportioned body parts
 *  - Breathing animation (chest expansion)
 *  - Idle sway motion
 *  - Neon green rim lighting effect via material emissive
 *  - Mouse parallax response
 *  - Dynamic pose (arms raised in victory/power stance)
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Shared Materials ──────────────────────────────────────────────────────
const useAthleteMaterials = () => {
  return useMemo(() => {
    // Base skin/muscle material — dark athletic
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1a1a2e"),
      roughness: 0.6,
      metalness: 0.1,
      emissive: new THREE.Color("#39FF14"),
      emissiveIntensity: 0.05,
    });

    // Clothing material (shorts/trunks)
    const clothingMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0a0a0a"),
      roughness: 0.8,
      metalness: 0.0,
      emissive: new THREE.Color("#39FF14"),
      emissiveIntensity: 0.02,
    });

    // Rim light material (neon outline effect for silhouette)
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#000000"),
      roughness: 0.3,
      metalness: 0.5,
      emissive: new THREE.Color("#39FF14"),
      emissiveIntensity: 0.4,
      side: THREE.BackSide,
    });

    return { bodyMaterial, clothingMaterial, rimMaterial };
  }, []);
};

// ── Individual Body Part Component ────────────────────────────────────────
const BodyPart = ({ geometry, material, position, rotation, scale }) => (
  <mesh
    geometry={geometry}
    material={material}
    position={position}
    rotation={rotation}
    scale={scale}
    castShadow
    receiveShadow
  />
);

// ── Rim Outline (backface trick for neon silhouette) ──────────────────────
const RimOutline = ({
  geometry,
  position,
  rotation,
  scale,
  intensity = 1.02,
}) => {
  const { rimMaterial } = useAthleteMaterials();
  return (
    <mesh
      geometry={geometry}
      material={rimMaterial}
      position={position}
      rotation={rotation}
      scale={[
        scale ? scale[0] * intensity : intensity,
        scale ? scale[1] * intensity : intensity,
        scale ? scale[2] * intensity : intensity,
      ]}
    />
  );
};

// ── Main Athlete Component ────────────────────────────────────────────────
const AthleteModel = ({ mouseX = 0, mouseY = 0 }) => {
  const groupRef = useRef(null);
  const torsoRef = useRef(null);
  const leftArmRef = useRef(null);
  const rightArmRef = useRef(null);
  const headRef = useRef(null);
  const timeRef = useRef(0);

  const { bodyMaterial, clothingMaterial } = useAthleteMaterials();

  // Pre-create geometries for performance
  const geometries = useMemo(
    () => ({
      // Head — slightly flattened sphere
      head: new THREE.SphereGeometry(0.22, 32, 24),

      // Neck
      neck: new THREE.CylinderGeometry(0.09, 0.1, 0.18, 16),

      // Torso — tapered box (wider shoulders)
      torsoUpper: new THREE.BoxGeometry(0.65, 0.55, 0.28),
      torsoLower: new THREE.BoxGeometry(0.52, 0.35, 0.25),

      // Shoulders (rounded)
      shoulder: new THREE.SphereGeometry(0.13, 16, 12),

      // Upper arms
      upperArm: new THREE.CapsuleGeometry(0.07, 0.32, 8, 16),

      // Forearms
      forearm: new THREE.CapsuleGeometry(0.055, 0.28, 8, 16),

      // Hands
      hand: new THREE.SphereGeometry(0.075, 12, 10),

      // Hips
      hips: new THREE.BoxGeometry(0.5, 0.22, 0.24),

      // Upper legs
      upperLeg: new THREE.CapsuleGeometry(0.1, 0.4, 8, 16),

      // Lower legs
      lowerLeg: new THREE.CapsuleGeometry(0.075, 0.38, 8, 16),

      // Feet
      foot: new THREE.BoxGeometry(0.12, 0.08, 0.22),

      // Chest muscles (pecs) — decorative bumps
      pec: new THREE.SphereGeometry(0.14, 16, 12),

      // Abs definition
      ab: new THREE.SphereGeometry(0.055, 12, 8),
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;

    const t = timeRef.current;

    // ── IDLE SWAY ─────────────────────────────────────────
    // Slow left-right body sway
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.06 + mouseX * 0.15;

    // Slight forward/back tilt from mouse
    groupRef.current.rotation.x = mouseY * -0.08;

    // ── BREATHING ANIMATION ───────────────────────────────
    const breathe = Math.sin(t * 1.2) * 0.5 + 0.5; // 0 to 1

    if (torsoRef.current) {
      // Chest expands on inhale
      torsoRef.current.scale.x = 1 + breathe * 0.025;
      torsoRef.current.scale.z = 1 + breathe * 0.03;
      // Slight upward lift on inhale
      torsoRef.current.position.y = 0.18 + breathe * 0.008;
    }

    // ── HEAD MOVEMENT ─────────────────────────────────────
    if (headRef.current) {
      // Head follows mouse subtly
      headRef.current.rotation.y = mouseX * 0.2;
      headRef.current.rotation.x = mouseY * -0.1 + Math.sin(t * 0.3) * 0.02;
    }

    // ── ARM SWING ─────────────────────────────────────────
    // Power stance — arms slightly out with micro-movement
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.35 + Math.sin(t * 0.6) * 0.03;
      leftArmRef.current.rotation.x = Math.sin(t * 0.4) * 0.02;
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.z =
        -0.35 + Math.sin(t * 0.6 + Math.PI) * 0.03;
      rightArmRef.current.rotation.x = Math.sin(t * 0.4 + 0.5) * 0.02;
    }

    // ── FLOATING EFFECT ───────────────────────────────────
    // Entire figure floats up and down gently
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.08 + mouseY * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* ── HEAD ──────────────────────────────────────── */}
      <group ref={headRef} position={[0, 2.42, 0]}>
        {/* Head */}
        <mesh geometry={geometries.head} material={bodyMaterial} castShadow />

        {/* Rim outline for neon silhouette */}
        <mesh
          geometry={geometries.head}
          position={[0, 0, 0]}
          scale={[1.03, 1.03, 1.03]}
        >
          <meshStandardMaterial
            side={THREE.BackSide}
            color="#000000"
            emissive="#39FF14"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Eyes - glowing points */}
        <mesh position={[-0.07, 0.03, 0.2]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial
            color="#39FF14"
            emissive="#39FF14"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[0.07, 0.03, 0.2]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial
            color="#39FF14"
            emissive="#39FF14"
            emissiveIntensity={2}
          />
        </mesh>
      </group>

      {/* ── NECK ──────────────────────────────────────── */}
      <mesh
        geometry={geometries.neck}
        material={bodyMaterial}
        position={[0, 2.18, 0]}
        castShadow
      />

      {/* ── TORSO ─────────────────────────────────────── */}
      <group ref={torsoRef} position={[0, 1.7, 0]}>
        {/* Upper torso (chest/shoulders area) */}
        <mesh
          geometry={geometries.torsoUpper}
          material={bodyMaterial}
          position={[0, 0.18, 0]}
          castShadow
        />

        {/* Rim outline - upper torso */}
        <mesh position={[0, 0.18, 0]} scale={[1.04, 1.04, 1.04]}>
          <boxGeometry args={[0.65, 0.55, 0.28]} />
          <meshStandardMaterial
            side={THREE.BackSide}
            color="#000"
            emissive="#39FF14"
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* Lower torso (abs/waist) */}
        <mesh
          geometry={geometries.torsoLower}
          material={bodyMaterial}
          position={[0, -0.2, 0]}
          castShadow
        />

        {/* Chest muscles (pecs) */}
        <mesh
          geometry={geometries.pec}
          material={bodyMaterial}
          position={[-0.17, 0.22, 0.12]}
          scale={[1, 0.7, 0.5]}
          castShadow
        />
        <mesh
          geometry={geometries.pec}
          material={bodyMaterial}
          position={[0.17, 0.22, 0.12]}
          scale={[1, 0.7, 0.5]}
          castShadow
        />

        {/* Ab definition (6-pack) */}
        {[-0.08, 0.08].map((x) =>
          [-0.05, -0.18, -0.31].map((y) => (
            <mesh
              key={`ab-${x}-${y}`}
              geometry={geometries.ab}
              material={bodyMaterial}
              position={[x, y, 0.13]}
              scale={[1, 0.8, 0.5]}
              castShadow
            />
          )),
        )}
      </group>

      {/* ── LEFT ARM ──────────────────────────────────── */}
      <group ref={leftArmRef} position={[-0.42, 1.9, 0]}>
        {/* Shoulder */}
        <mesh
          geometry={geometries.shoulder}
          material={bodyMaterial}
          position={[0, 0, 0]}
          castShadow
        />
        {/* Upper arm */}
        <mesh
          geometry={geometries.upperArm}
          material={bodyMaterial}
          position={[-0.08, -0.22, 0]}
          rotation={[0, 0, 0.2]}
          castShadow
        />
        {/* Forearm */}
        <mesh
          geometry={geometries.forearm}
          material={bodyMaterial}
          position={[-0.18, -0.58, 0]}
          rotation={[0, 0, -0.15]}
          castShadow
        />
        {/* Hand */}
        <mesh
          geometry={geometries.hand}
          material={bodyMaterial}
          position={[-0.24, -0.86, 0]}
          castShadow
        />
      </group>

      {/* ── RIGHT ARM ─────────────────────────────────── */}
      <group ref={rightArmRef} position={[0.42, 1.9, 0]}>
        {/* Shoulder */}
        <mesh
          geometry={geometries.shoulder}
          material={bodyMaterial}
          position={[0, 0, 0]}
          castShadow
        />
        {/* Upper arm */}
        <mesh
          geometry={geometries.upperArm}
          material={bodyMaterial}
          position={[0.08, -0.22, 0]}
          rotation={[0, 0, -0.2]}
          castShadow
        />
        {/* Forearm */}
        <mesh
          geometry={geometries.forearm}
          material={bodyMaterial}
          position={[0.18, -0.58, 0]}
          rotation={[0, 0, 0.15]}
          castShadow
        />
        {/* Hand */}
        <mesh
          geometry={geometries.hand}
          material={bodyMaterial}
          position={[0.24, -0.86, 0]}
          castShadow
        />
      </group>

      {/* ── HIPS ──────────────────────────────────────── */}
      <mesh
        geometry={geometries.hips}
        material={clothingMaterial}
        position={[0, 1.25, 0]}
        castShadow
      />

      {/* ── LEFT LEG ──────────────────────────────────── */}
      <group position={[-0.16, 0.9, 0]}>
        {/* Upper leg */}
        <mesh
          geometry={geometries.upperLeg}
          material={bodyMaterial}
          position={[0, -0.22, 0]}
          castShadow
        />
        {/* Lower leg */}
        <mesh
          geometry={geometries.lowerLeg}
          material={bodyMaterial}
          position={[0.02, -0.65, 0]}
          castShadow
        />
        {/* Foot */}
        <mesh
          geometry={geometries.foot}
          material={bodyMaterial}
          position={[0.02, -0.96, 0.05]}
          castShadow
        />
      </group>

      {/* ── RIGHT LEG ─────────────────────────────────── */}
      <group position={[0.16, 0.9, 0]}>
        {/* Upper leg */}
        <mesh
          geometry={geometries.upperLeg}
          material={bodyMaterial}
          position={[0, -0.22, 0]}
          castShadow
        />
        {/* Lower leg */}
        <mesh
          geometry={geometries.lowerLeg}
          material={bodyMaterial}
          position={[-0.02, -0.65, 0]}
          castShadow
        />
        {/* Foot */}
        <mesh
          geometry={geometries.foot}
          material={bodyMaterial}
          position={[-0.02, -0.96, 0.05]}
          castShadow
        />
      </group>

      {/* ── SHADOW ON GROUND ──────────────────────────── */}
      <mesh
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default AthleteModel;
