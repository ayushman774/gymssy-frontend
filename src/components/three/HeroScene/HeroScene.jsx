// src/components/three/HeroScene/HeroScene.jsx

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from "@react-three/drei";
import * as THREE from "three";
import AthleteModel from "../AthleteModel/AthleteModel";
import ParticleField from "../ParticleField/ParticleField";
import VolumetricLight from "../VolumetricLight/VolumetricLight";
import styles from "./HeroScene.module.css";

// ── Camera Rig ────────────────────────────────────────────────────────────
const CameraRig = ({ mouseX, mouseY }) => {
  const { camera } = useThree();
  const targetRef = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    targetRef.current.x += (mouseX * 0.8 - targetRef.current.x) * 0.05;
    targetRef.current.y += (mouseY * 0.4 - targetRef.current.y) * 0.05;
    camera.position.x = targetRef.current.x;
    camera.position.y = 0.5 + targetRef.current.y;
    camera.lookAt(0, 0.3, 0);
  });

  return null;
};

// ── Ground Reflection ─────────────────────────────────────────────────────
const GroundReflection = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
    <planeGeometry args={[30, 30]} />
    <meshStandardMaterial
      color="#000000"
      roughness={0.1}
      metalness={0.8}
      envMapIntensity={0.3}
    />
  </mesh>
);

// ── Energy Ring ───────────────────────────────────────────────────────────
const EnergyRing = ({
  radius = 1.2,
  speed = 0.3,
  color = "#39ff14b8",
  yPos = 0,
}) => {
  const ringRef = useRef(null);
  const timeRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    timeRef.current += delta * speed;
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(timeRef.current) * 0.5;
      ringRef.current.rotation.z = timeRef.current;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, yPos, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

// ── Inner Scene ───────────────────────────────────────────────────────────
const InnerScene = ({ mouseX, mouseY, particleCount }) => (
  <>
    <CameraRig mouseX={mouseX} mouseY={mouseY} />

    {/* ── LIGHTING ────────────────────────────────────── */}
    <ambientLight intensity={0.15} color="#0a0a2a" />

    <spotLight
      position={[-4, 4, -2]}
      color="#39ff14b8"
      intensity={120}
      angle={0.4}
      penumbra={0.7}
      distance={15}
      castShadow={false}
    />

    <spotLight
      position={[4, 3, -3]}
      color="#39ff14b8"
      intensity={60}
      angle={0.35}
      penumbra={0.8}
      distance={12}
      castShadow={false}
    />

    <pointLight
      position={[-3, 1, 3]}
      color="#3B82F6"
      intensity={40}
      distance={10}
    />

    <directionalLight
      position={[1, 5, 3]}
      color="#ffffff"
      intensity={0.8}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-far={20}
      shadow-camera-left={-5}
      shadow-camera-right={5}
      shadow-camera-top={5}
      shadow-camera-bottom={-5}
    />

    <pointLight
      position={[0, -2, 0]}
      color="#39ff14b8"
      intensity={15}
      distance={6}
    />

    {/* ── VOLUMETRIC LIGHTS ────────────────────────────── */}
    <VolumetricLight
      position={[-2, 6, -1]}
      color="#39ff14b8"
      intensity={0.5}
      angle={0.25}
      height={10}
      radius={2}
    />
    <VolumetricLight
      position={[2, 5, -1]}
      color="#3B82F6"
      intensity={0.3}
      angle={0.2}
      height={8}
      radius={1.5}
    />

    {/* ── ATHLETE ─────────────────────────────────────── */}
    {/* <Suspense fallback={null}>
      <AthleteModel mouseX={mouseX} mouseY={mouseY} />
    </Suspense> */}

    {/* ── ENERGY RINGS ────────────────────────────────── */}
    {/* <EnergyRing radius={0.9}  speed={0.4}   color="#39ff14b8" yPos={0.2}  />
    <EnergyRing radius={1.3}  speed={-0.25} color="#3B82F6" yPos={-0.3} /> */}
    {/* <EnergyRing radius={0.6}  speed={0.6}   color="#39ff14b8" yPos={0.8}  /> */}

    {/* ── PARTICLES ───────────────────────────────────── */}
    <ParticleField
      count={particleCount}
      mouseX={mouseX}
      mouseY={mouseY}
      color="#39ff14b8"
      secondaryColor="#3B82F6"
      spread={22}
      depth={14}
    />

    {/* ── GROUND ──────────────────────────────────────── */}
    {/* <GroundReflection /> */}

    {/* ── ENVIRONMENT ─────────────────────────────────── */}
    <Environment preset="night" />

    {/* ── PERFORMANCE ─────────────────────────────────── */}
    <AdaptiveDpr pixelated />
    <AdaptiveEvents />
  </>
);

// ── HeroScene ─────────────────────────────────────────────────────────────
const HeroScene = ({ mouseX = 0, mouseY = 0, isMobile = false }) => {
  const particleCount = isMobile ? 600 : 2000;

  /*
    Create a THREE.Timer instance to replace the deprecated THREE.Clock.
    THREE.Timer is the modern replacement introduced in Three.js r168+.
    Passed via the "clock" prop on Canvas — R3F uses it internally
    for all delta/elapsed time calculations (useFrame, etc.)
  */
  const timer = useMemo(() => {
    /*
      THREE.Timer API mirrors THREE.Clock:
        .getDelta()    → seconds since last call
        .getElapsed()  → total seconds since start
        .update()      → must be called each frame

      R3F calls .update() automatically each frame
      when you pass it as the clock prop.
    */
    if (THREE.Timer) {
      return new THREE.Timer();
    }

    /*
      Fallback: if this version of Three.js does not yet
      export THREE.Timer, fall back to THREE.Clock silently.
      This keeps the code forward AND backward compatible.
    */
    return new THREE.Clock();
  }, []);

  return (
    <div className={styles.canvasWrapper}>
      <Canvas
        camera={{
          position: [0, 0.5, 6],
          fov: 55,
          near: 0.1,
          far: 100,
        }}
        shadows={{
          enabled: !isMobile,
          type: THREE.PCFShadowMap,
        }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        frameloop="always"
        clock={timer} /* ← replaces deprecated THREE.Clock */
        style={{ background: "transparent" }}
      >
        <PerformanceMonitor>
          <InnerScene
            mouseX={mouseX}
            mouseY={mouseY}
            particleCount={particleCount}
          />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
};

export default HeroScene;
