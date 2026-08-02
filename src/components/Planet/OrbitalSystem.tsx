"use client";

import { useFrame } from "@react-three/fiber";
import {
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { useUniverse } from "@/components/UI/UniverseContext";

type OrbitalSystemProps = {
  count?: number;
  activityRef?: MutableRefObject<number>;
};

type SatelliteData = {
  radius: number;
  speed: number;
  offset: number;
  inclination: number;
  verticalOffset: number;
  reverse: boolean;
  scale: number;
};

function InstancedSatellites({
  count,
  orbitalMode,
  activityRef,
}: {
  count: number;
  orbitalMode: "CALM" | "ACTIVE" | "SWARM";
  activityRef?: MutableRefObject<number>;
}) {
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const leftPanelRef = useRef<THREE.InstancedMesh>(null);
  const rightPanelRef = useRef<THREE.InstancedMesh>(null);
  const antennaRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const satellites = useMemo<SatelliteData[]>(() => {
    return Array.from({ length: count }, (_, index) => ({
      radius: 2.75 + Math.random() * 2.2,
      speed: 0.08 + Math.random() * 0.22,
      offset: (index / count) * Math.PI * 2 + Math.random() * 0.7,
      inclination: 0.12 + Math.random() * 1.05,
      verticalOffset: (Math.random() - 0.5) * 0.55,
      reverse: Math.random() > 0.72,
      scale: 0.6 + Math.random() * 0.85,
    }));
  }, [count]);

  useFrame((state,delta) => {
    const activity = activityRef?.current ?? 0;

const activitySpeedBoost = 1 + activity * 1.4;
const activityOrbitTightening = 1 - activity * 0.08;
const activityTiltBoost = 1 + activity * 1.6;
    if (
      !bodyRef.current ||
      !leftPanelRef.current ||
      !rightPanelRef.current ||
      !antennaRef.current
    ) {
      return;
    }
const speedMultiplier =
  (orbitalMode === "CALM"
    ? 0.45
    : orbitalMode === "SWARM"
      ? 2.15
      : 1) * activitySpeedBoost;

const orbitMultiplier =
  (orbitalMode === "SWARM" ? 0.82 : 1) *
  activityOrbitTightening;
  
    satellites.forEach((satellite, index) => {
      const direction = satellite.reverse ? -1 : 1;
      const angle =
  state.clock.elapsedTime *
    satellite.speed *
    direction *
    speedMultiplier +
  satellite.offset;

      const currentRadius = satellite.radius * orbitMultiplier;

const x = Math.cos(angle) * currentRadius;
const z = Math.sin(angle) * currentRadius;
      const y =
        Math.sin(angle * 1.6 + index * 0.4) *
          satellite.inclination +
        satellite.verticalOffset;

       const tiltStrength =
  (orbitalMode === "SWARM" ? 0.5 : 0.22) *
  activityTiltBoost;
const tilt =
  Math.sin(angle * 1.3 + index) * tiltStrength;

      dummy.position.set(x, y, z);
      dummy.rotation.set(
        tilt * 0.35,
        -angle + Math.PI / 2,
        tilt,
      );
      dummy.scale.setScalar(satellite.scale);
      dummy.updateMatrix();
      bodyRef.current!.setMatrixAt(index, dummy.matrix);

      dummy.position.set(x - 0.2 * satellite.scale, y, z);
      dummy.rotation.set(
        tilt * 0.35,
        -angle + Math.PI / 2,
        tilt,
      );
      dummy.scale.setScalar(satellite.scale);
      dummy.updateMatrix();
      leftPanelRef.current!.setMatrixAt(index, dummy.matrix);

      dummy.position.set(x + 0.2 * satellite.scale, y, z);
      dummy.rotation.set(
        tilt * 0.35,
        -angle + Math.PI / 2,
        tilt,
      );
      dummy.scale.setScalar(satellite.scale);
      dummy.updateMatrix();
      rightPanelRef.current!.setMatrixAt(index, dummy.matrix);

      dummy.position.set(
        x,
        y + 0.1 * satellite.scale,
        z,
      );
      dummy.rotation.set(
        tilt * 0.35,
        -angle + Math.PI / 2,
        tilt,
      );
      dummy.scale.setScalar(satellite.scale);
      dummy.updateMatrix();
      antennaRef.current!.setMatrixAt(index, dummy.matrix);
    });

    bodyRef.current.instanceMatrix.needsUpdate = true;
    leftPanelRef.current.instanceMatrix.needsUpdate = true;
    rightPanelRef.current.instanceMatrix.needsUpdate = true;
    antennaRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={bodyRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.18, 0.11, 0.12]} />
        <meshStandardMaterial
          color="#9ab6ff"
          roughness={0.3}
          metalness={0.8}
          emissive="#173f91"
          emissiveIntensity={0.7}
        />
      </instancedMesh>

      <instancedMesh
        ref={leftPanelRef}
        args={[undefined, undefined, count]}
      >
        <boxGeometry args={[0.19, 0.014, 0.11]} />
        <meshStandardMaterial
          color="#365ea9"
          roughness={0.35}
          metalness={0.7}
          emissive="#10275f"
          emissiveIntensity={0.6}
        />
      </instancedMesh>

      <instancedMesh
        ref={rightPanelRef}
        args={[undefined, undefined, count]}
      >
        <boxGeometry args={[0.19, 0.014, 0.11]} />
        <meshStandardMaterial
          color="#365ea9"
          roughness={0.35}
          metalness={0.7}
          emissive="#10275f"
          emissiveIntensity={0.6}
        />
      </instancedMesh>

      <instancedMesh
        ref={antennaRef}
        args={[undefined, undefined, count]}
      >
        <cylinderGeometry args={[0.027, 0.027, 0.12, 8]} />
        <meshStandardMaterial
          color="#d7e3ff"
          metalness={0.9}
          roughness={0.2}
          emissive="#6aa8ff"
          emissiveIntensity={0.35}
        />
      </instancedMesh>
    </>
  );
}

function OrbitalTrail({
  radius,
  inclination,
  rotation,
  opacity,
}: {
  radius: number;
  inclination: number;
  rotation: number;
  opacity: number;
}) {
  return (
    <mesh
      rotation={[
        Math.PI / 2 + inclination,
        rotation,
        rotation * 0.3,
      ]}
    >
      <ringGeometry args={[radius, radius + 0.008, 192]} />

      <meshBasicMaterial
        color="#6f8fff"
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function SignalBeam({
  radius,
  speed,
  offset,
}: {
  radius: number;
  speed: number;
  offset: number;
}) {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!beamRef.current) {
      return;
    }

    const angle = state.clock.elapsedTime * speed + offset;

    beamRef.current.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle * 1.4) * 0.7,
      Math.sin(angle) * radius,
    );

    beamRef.current.lookAt(0, 0, 0);

    const material =
      beamRef.current.material as THREE.MeshBasicMaterial;

    material.opacity =
      0.06 +
      (Math.sin(state.clock.elapsedTime * 2.6 + offset) + 1) *
        0.025;
  });

  return (
    <mesh ref={beamRef}>
      <cylinderGeometry args={[0.006, 0.026, 3.2, 8, 1, true]} />

      <meshBasicMaterial
        color="#63cfff"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function OrbitalDebris({
  orbitalMode,
  activityRef,
}: {
  orbitalMode: "CALM" | "ACTIVE" | "SWARM";
  activityRef?: MutableRefObject<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const debrisCount = 700;
    const array = new Float32Array(debrisCount * 3);

    for (let index = 0; index < debrisCount; index += 1) {
      const offset = index * 3;
      const radius = 2.7 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;

      array[offset] = Math.cos(angle) * radius;
      array[offset + 1] = (Math.random() - 0.5) * 1.15;
      array[offset + 2] = Math.sin(angle) * radius;
    }

    return array;
  }, []);

  useFrame((state, delta) => {
    
    if (!pointsRef.current) {
      return;
    }
   const activity = activityRef?.current ?? 0;
    const debrisSpeed =
  orbitalMode === "CALM"
    ? 0.007
    : orbitalMode === "SWARM"
      ? 0.055
      : 0.02;

pointsRef.current.rotation.y +=
  delta * debrisSpeed * (1 + activity * 1.8);
    pointsRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.11) * 0.045;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.016}
        color="#8da8ff"
        transparent
        opacity={0.52}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function OrbitalSystem({
  count = 26,
  activityRef,
}: OrbitalSystemProps) {
    const { orbitalMode } = useUniverse();
  const systemRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!systemRef.current) {
      return;
    }

    systemRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.13) * 0.02;

    systemRef.current.rotation.z =
      Math.cos(state.clock.elapsedTime * 0.09) * 0.018;
  });

  return (
    <group ref={systemRef}>
      <OrbitalTrail
        radius={3.05}
        inclination={0.12}
        rotation={0.2}
        opacity={0.16}
      />

      <OrbitalTrail
        radius={3.65}
        inclination={-0.34}
        rotation={0.8}
        opacity={0.1}
      />

      <OrbitalTrail
        radius={4.25}
        inclination={0.5}
        rotation={-0.7}
        opacity={0.07}
      />

      <OrbitalTrail
        radius={4.85}
        inclination={-0.62}
        rotation={0.35}
        opacity={0.05}
      />

     <InstancedSatellites
  count={count}
  orbitalMode={orbitalMode}
  activityRef={activityRef}
/>

      <SignalBeam radius={3.25} speed={0.18} offset={0} />
      <SignalBeam radius={4.1} speed={-0.12} offset={2.2} />
      <SignalBeam radius={4.65} speed={0.09} offset={4.4} />

      <OrbitalDebris
  orbitalMode={orbitalMode}
  activityRef={activityRef}
/>
    </group>
  );
}