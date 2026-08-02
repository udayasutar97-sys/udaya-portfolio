"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import { useUniverse } from "@/components/UI/UniverseContext";
import {
  usePerformance,
  type QualityLevel,
} from "@/components/UI/PerformanceManager";
import OrbitalSystem from "@/components/Planet/OrbitalSystem";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";

type InteractionState = {
  pointerX: number;
  pointerY: number;
  dragX: number;
  dragY: number;
  velocityX: number;
  velocityY: number;
  isDragging: boolean;
  hasDragged: boolean;
  planetProximity: number;
  planetHovered: boolean;
};

type SceneProps = {
  interaction: MutableRefObject<InteractionState>;
};

const CORE_COLORS = {
  STABLE: {
    planet: new THREE.Color("#101d43"),
    emissive: new THREE.Color("#07122e"),
    atmosphere: new THREE.Color("#6d94ff"),
    outerAtmosphere: new THREE.Color("#658aff"),
    primaryRing: new THREE.Color("#7896ff"),
    secondaryRing: new THREE.Color("#9b72ff"),
  },

  OVERDRIVE: {
    planet: new THREE.Color("#45120d"),
    emissive: new THREE.Color("#8f1d0d"),
    atmosphere: new THREE.Color("#ff6b42"),
    outerAtmosphere: new THREE.Color("#ff3b20"),
    primaryRing: new THREE.Color("#ff6847"),
    secondaryRing: new THREE.Color("#ffad63"),
  },

  QUANTUM: {
    planet: new THREE.Color("#291059"),
    emissive: new THREE.Color("#5122a8"),
    atmosphere: new THREE.Color("#c16dff"),
    outerAtmosphere: new THREE.Color("#8c55ff"),
    primaryRing: new THREE.Color("#ca78ff"),
    secondaryRing: new THREE.Color("#7c4dff"),
  },
};

const QUALITY_SETTINGS = {
  high: {
    planetSegments: 64,
    atmosphereSegments: 48,
    satellites: 26,
    particles: 1500,
    stars: 2600,
    sparkles: 130,
    ringSegments: 192,
    dpr: [0.8, 1] as [number, number],
  },

  balanced: {
    planetSegments: 48,
    atmosphereSegments: 36,
    satellites: 18,
    particles: 850,
    stars: 1500,
    sparkles: 70,
    ringSegments: 128,
    dpr: [0.7, 0.9] as [number, number],
  },

  low: {
    planetSegments: 32,
    atmosphereSegments: 24,
    satellites: 8,
    particles: 300,
    stars: 650,
    sparkles: 20,
    ringSegments: 72,
    dpr: [0.55, 0.75] as [number, number],
  },
};

function CameraRig({
  interaction,
  planetPortalOpen,
  reducedMotion,
}: SceneProps & {
  planetPortalOpen: boolean;
  reducedMotion: boolean;
}) {
  const { camera } = useThree();

  const lookTarget = useRef(new THREE.Vector3(2.05, 0, 0));

  useFrame((state, delta) => {
    const interactionState = interaction.current;

    const pointerStrength = reducedMotion ? 0.25 : 1;
    const dragStrength = reducedMotion ? 0.35 : 1;

    const pointerTargetX =
      interactionState.pointerX * 0.34 * pointerStrength;

    const pointerTargetY =
      -interactionState.pointerY * 0.22 * pointerStrength;

    const dragTargetX =
      interactionState.dragX * 0.85 * dragStrength;

    const dragTargetY =
      -interactionState.dragY * 0.52 * dragStrength;

    const idleBreathing = reducedMotion
      ? 0
      : Math.sin(state.clock.elapsedTime * 0.42) * 0.035;

    const targetX = planetPortalOpen
      ? 1.68
      : pointerTargetX + dragTargetX;

    const targetY = planetPortalOpen
      ? 0
      : pointerTargetY + dragTargetY + idleBreathing;

    const targetZ = planetPortalOpen ? 4.55 : 8.2;

    const positionDamping = planetPortalOpen ? 5.8 : 2.6;
    const lookDamping = planetPortalOpen ? 6.5 : 3.5;

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetX,
      positionDamping,
      delta,
    );

    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetY,
      positionDamping,
      delta,
    );

    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetZ,
      positionDamping,
      delta,
    );

    lookTarget.current.x = THREE.MathUtils.damp(
      lookTarget.current.x,
      planetPortalOpen ? 2.3 : 2.05,
      lookDamping,
      delta,
    );

    lookTarget.current.y = THREE.MathUtils.damp(
      lookTarget.current.y,
      0,
      lookDamping,
      delta,
    );

    camera.lookAt(lookTarget.current);
  });

  return null;
}

function Planet({
  interaction,
  coreMode,
  openPlanetPortal,
  setIsFlyingToPlanet,
  quality,
  reducedMotion,
}: SceneProps & {
  coreMode: "STABLE" | "OVERDRIVE" | "QUANTUM";
  openPlanetPortal: () => void;
  setIsFlyingToPlanet: (value: boolean) => void;
  quality: QualityLevel;
  reducedMotion: boolean;
}) {
  const qualitySettings = QUALITY_SETTINGS[quality];

  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const outerAtmosphereRef = useRef<THREE.Mesh>(null);
  const primaryRingRef = useRef<THREE.Mesh>(null);
  const secondaryRingRef = useRef<THREE.Mesh>(null);

  const planetMaterialRef =
    useRef<THREE.MeshStandardMaterial>(null);

  const atmosphereMaterialRef =
    useRef<THREE.MeshBasicMaterial>(null);

  const outerAtmosphereMaterialRef =
    useRef<THREE.MeshBasicMaterial>(null);

  const primaryRingMaterialRef =
    useRef<THREE.MeshBasicMaterial>(null);

  const secondaryRingMaterialRef =
    useRef<THREE.MeshBasicMaterial>(null);

  const planetActivityRef = useRef(0);
  const flightTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (flightTimeoutRef.current !== null) {
        window.clearTimeout(flightTimeoutRef.current);
      }

      document.body.classList.remove("planet-hovering");
      document.body.classList.remove("planet-flight-active");
    };
  }, []);

  useFrame((state, delta) => {
    const interactionState = interaction.current;

    const proximity = interactionState.planetHovered
      ? 1
      : interactionState.planetProximity;

    const proximityEase = proximity * proximity;

    
    const satelliteActivityTarget = proximityEase * 0.3;

    planetActivityRef.current = THREE.MathUtils.damp(
      planetActivityRef.current,
      satelliteActivityTarget,
      4,
      delta,
    );

    const hoverSpeedMultiplier = reducedMotion
      ? 1
      : 1 + proximityEase * 0.38;

    const hoverPulse = reducedMotion
      ? 0
      : Math.sin(state.clock.elapsedTime * 2.6) *
        proximityEase *
        0.007;

    const isOverdrive = coreMode === "OVERDRIVE";
    const isQuantum = coreMode === "QUANTUM";

    const rotationMultiplier =
      (isOverdrive
        ? 2.15
        : isQuantum
          ? 1.45
          : 1) * hoverSpeedMultiplier;

    const basePulse = reducedMotion
      ? 0
      : Math.sin(
          state.clock.elapsedTime *
            (isOverdrive ? 4.2 : 2.2),
        ) *
        (isOverdrive
          ? 0.018
          : isQuantum
            ? 0.012
            : 0.003);

    const pulse = 1 + basePulse + hoverPulse;

    if (planetRef.current) {
      planetRef.current.rotation.y +=
        delta * 0.075 * rotationMultiplier;

      planetRef.current.rotation.x +=
        delta * 0.012 * rotationMultiplier;

      planetRef.current.scale.setScalar(pulse);
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -=
        delta * 0.032 * rotationMultiplier;

      atmosphereRef.current.rotation.z +=
        delta * 0.009 * rotationMultiplier;
    }

    if (outerAtmosphereRef.current) {
      outerAtmosphereRef.current.rotation.y +=
        delta * 0.017 * rotationMultiplier;
    }

    if (primaryRingRef.current) {
      primaryRingRef.current.rotation.z +=
        delta * 0.02 * rotationMultiplier;
    }

    if (secondaryRingRef.current) {
      secondaryRingRef.current.rotation.z -=
        delta * 0.012 * rotationMultiplier;
    }

    const colors = CORE_COLORS[coreMode];

    if (planetMaterialRef.current) {
      planetMaterialRef.current.color.lerp(
        colors.planet,
        0.045,
      );

      planetMaterialRef.current.emissive.lerp(
        colors.emissive,
        0.045,
      );

      const baseEmissiveIntensity = isOverdrive
        ? 1.05
        : isQuantum
          ? 0.78
          : 0.48;

      planetMaterialRef.current.emissiveIntensity =
        THREE.MathUtils.damp(
          planetMaterialRef.current.emissiveIntensity,
          baseEmissiveIntensity + proximityEase * 0.34,
          4,
          delta,
        );
    }

    if (atmosphereMaterialRef.current) {
      atmosphereMaterialRef.current.color.lerp(
        colors.atmosphere,
        0.05,
      );

      const baseAtmosphereOpacity = isOverdrive
        ? 0.1
        : isQuantum
          ? 0.085
          : 0.045;

      atmosphereMaterialRef.current.opacity =
        THREE.MathUtils.damp(
          atmosphereMaterialRef.current.opacity,
          baseAtmosphereOpacity + proximityEase * 0.045,
          4,
          delta,
        );
    }

    if (outerAtmosphereMaterialRef.current) {
      outerAtmosphereMaterialRef.current.color.lerp(
        colors.outerAtmosphere,
        0.05,
      );

      const baseOuterOpacity = isOverdrive
        ? 0.13
        : isQuantum
          ? 0.11
          : 0.065;

      outerAtmosphereMaterialRef.current.opacity =
        THREE.MathUtils.damp(
          outerAtmosphereMaterialRef.current.opacity,
          baseOuterOpacity + proximityEase * 0.06,
          4,
          delta,
        );
    }

    if (primaryRingMaterialRef.current) {
      primaryRingMaterialRef.current.color.lerp(
        colors.primaryRing,
        0.05,
      );

      const baseRingOpacity = isOverdrive
        ? 0.52
        : isQuantum
          ? 0.43
          : 0.3;

      primaryRingMaterialRef.current.opacity =
        THREE.MathUtils.damp(
          primaryRingMaterialRef.current.opacity,
          baseRingOpacity + proximityEase * 0.18,
          4,
          delta,
        );
    }

    if (secondaryRingMaterialRef.current) {
      secondaryRingMaterialRef.current.color.lerp(
        colors.secondaryRing,
        0.05,
      );

      secondaryRingMaterialRef.current.opacity =
        THREE.MathUtils.damp(
          secondaryRingMaterialRef.current.opacity,
          0.16 + proximityEase * 0.14,
          4,
          delta,
        );
    }

    if (groupRef.current) {
      const pointerTiltMultiplier = reducedMotion ? 0.25 : 1;

      const pointerTiltX =
        -interactionState.pointerY *
        0.16 *
        pointerTiltMultiplier;

      const pointerTiltY =
        interactionState.pointerX *
        0.22 *
        pointerTiltMultiplier;

      const dragTiltX =
        -interactionState.dragY * 0.34;

      const dragTiltY =
        interactionState.dragX * 0.46;

      groupRef.current.rotation.x =
        THREE.MathUtils.damp(
          groupRef.current.rotation.x,
          0.08 + pointerTiltX + dragTiltX,
          3.2,
          delta,
        );

      groupRef.current.rotation.y =
        THREE.MathUtils.damp(
          groupRef.current.rotation.y,
          -0.3 + pointerTiltY + dragTiltY,
          3.2,
          delta,
        );

      groupRef.current.rotation.z =
        THREE.MathUtils.damp(
          groupRef.current.rotation.z,
          -0.12 + interactionState.dragX * 0.08,
          3,
          delta,
        );

      const floatingY = reducedMotion
        ? 0
        : Math.sin(state.clock.elapsedTime * 0.55) * 0.09;

      const floatingX = reducedMotion
        ? 0
        : Math.cos(state.clock.elapsedTime * 0.38) * 0.045;

      groupRef.current.position.x =
        THREE.MathUtils.damp(
          groupRef.current.position.x,
          2.3 + floatingX,
          2.8,
          delta,
        );

      groupRef.current.position.y =
        THREE.MathUtils.damp(
          groupRef.current.position.y,
          floatingY,
          2.8,
          delta,
        );
    }
  });

  const handlePlanetClick = () => {
    if (interaction.current.hasDragged) {
      interaction.current.hasDragged = false;
      return;
    }

    if (flightTimeoutRef.current !== null) {
      return;
    }

    setIsFlyingToPlanet(true);
    document.body.classList.add("planet-flight-active");

    flightTimeoutRef.current = window.setTimeout(() => {
      openPlanetPortal();
      setIsFlyingToPlanet(false);

      document.body.classList.remove(
        "planet-flight-active",
      );

      flightTimeoutRef.current = null;
    }, 900);
  };

  const handlePlanetPointerOver = () => {
    interaction.current.planetHovered = true;
    document.body.classList.add("planet-hovering");
  };

  const handlePlanetPointerOut = () => {
    interaction.current.planetHovered = false;
    document.body.classList.remove("planet-hovering");
  };

  return (
    <group ref={groupRef} position={[2.3, 0, 0]}>
      <OrbitalSystem
        count={qualitySettings.satellites}
        activityRef={planetActivityRef}
      />

      {}
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          handlePlanetClick();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          handlePlanetPointerOver();
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          handlePlanetPointerOut();
        }}
      >
        <sphereGeometry args={[2.36, 24, 24]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          colorWrite={false}
        />
      </mesh>

      <mesh ref={planetRef}>
        <sphereGeometry
          args={[
            2.15,
            qualitySettings.planetSegments,
            qualitySettings.planetSegments,
          ]}
        />

        <meshStandardMaterial
          ref={planetMaterialRef}
          color="#101d43"
          roughness={0.7}
          metalness={0.22}
          emissive="#07122e"
          emissiveIntensity={0.48}
        />
      </mesh>

      <mesh ref={atmosphereRef} scale={1.012}>
        <sphereGeometry
          args={[
            2.15,
            qualitySettings.atmosphereSegments,
            qualitySettings.atmosphereSegments,
          ]}
        />

        <meshBasicMaterial
          ref={atmosphereMaterialRef}
          color="#6d94ff"
          wireframe
          transparent
          opacity={0.045}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={outerAtmosphereRef} scale={1.047}>
        <sphereGeometry
          args={[
            2.15,
            qualitySettings.atmosphereSegments,
            qualitySettings.atmosphereSegments,
          ]}
        />

        <meshBasicMaterial
          ref={outerAtmosphereMaterialRef}
          color="#658aff"
          transparent
          opacity={0.065}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={primaryRingRef}
        rotation={[Math.PI / 2.55, 0.06, 0]}
      >
        <ringGeometry
          args={[
            2.72,
            2.755,
            qualitySettings.ringSegments,
          ]}
        />

        <meshBasicMaterial
          ref={primaryRingMaterialRef}
          color="#7896ff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={secondaryRingRef}
        rotation={[Math.PI / 2.55, 0.06, 0]}
      >
        <ringGeometry
          args={[
            2.92,
            2.93,
            qualitySettings.ringSegments,
          ]}
        />

        <meshBasicMaterial
          ref={secondaryRingMaterialRef}
          color="#9b72ff"
          transparent
          opacity={0.16}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        position={[-4.2, 2.8, 4.5]}
        intensity={28}
        color="#8baaff"
        distance={13}
        decay={2}
      />

      <pointLight
        position={[3.4, -2.2, 2.6]}
        intensity={9}
        color="#704cff"
        distance={11}
        decay={2}
      />

      {quality !== "low" && (
        <pointLight
          position={[0, 3.8, -1]}
          intensity={5}
          color="#63d9ff"
          distance={9}
          decay={2}
        />
      )}
    </group>
  );
}

function FloatingParticles({
  interaction,
  quality,
  reducedMotion,
}: SceneProps & {
  quality: QualityLevel;
  reducedMotion: boolean;
}) {
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount =
    QUALITY_SETTINGS[quality].particles;

  const particles = useMemo(() => {
    const positions = new Float32Array(
      particleCount * 3,
    );

    for (
      let index = 0;
      index < particleCount;
      index += 1
    ) {
      const offset = index * 3;

      positions[offset] =
        (Math.random() - 0.5) * 20;

      positions[offset + 1] =
        (Math.random() - 0.5) * 12;

      positions[offset + 2] =
        (Math.random() - 0.5) * 10;
    }

    return positions;
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!particlesRef.current) {
      return;
    }

    const interactionState = interaction.current;
    const motionMultiplier = reducedMotion ? 0.2 : 1;

    particlesRef.current.rotation.y +=
      delta * 0.009 * motionMultiplier;

    particlesRef.current.rotation.x =
      THREE.MathUtils.damp(
        particlesRef.current.rotation.x,
        (interactionState.pointerY * 0.07 +
          interactionState.dragY * 0.16) *
          motionMultiplier,
        2,
        delta,
      );

    particlesRef.current.rotation.z =
      THREE.MathUtils.damp(
        particlesRef.current.rotation.z,
        (-interactionState.pointerX * 0.045 -
          interactionState.dragX * 0.12) *
          motionMultiplier,
        2,
        delta,
      );

    particlesRef.current.position.x =
      THREE.MathUtils.damp(
        particlesRef.current.position.x,
        interactionState.dragX *
          0.5 *
          motionMultiplier,
        2,
        delta,
      );

    particlesRef.current.position.y = reducedMotion
      ? 0
      : Math.sin(state.clock.elapsedTime * 0.15) *
        0.06;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.019}
        color="#83a2ff"
        transparent
        opacity={0.68}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SpaceLayer({
  interaction,
  quality,
  reducedMotion,
}: SceneProps & {
  quality: QualityLevel;
  reducedMotion: boolean;
}) {
  const starsGroupRef = useRef<THREE.Group>(null);
  const qualitySettings = QUALITY_SETTINGS[quality];

  useFrame((_, delta) => {
    if (!starsGroupRef.current) {
      return;
    }

    const interactionState = interaction.current;
    const motionMultiplier = reducedMotion ? 0.2 : 1;

    starsGroupRef.current.rotation.x =
      THREE.MathUtils.damp(
        starsGroupRef.current.rotation.x,
        (interactionState.pointerY * 0.025 +
          interactionState.dragY * 0.09) *
          motionMultiplier,
        1.6,
        delta,
      );

    starsGroupRef.current.rotation.y =
      THREE.MathUtils.damp(
        starsGroupRef.current.rotation.y,
        (interactionState.pointerX * 0.035 +
          interactionState.dragX * 0.12) *
          motionMultiplier,
        1.6,
        delta,
      );
  });

  return (
    <group ref={starsGroupRef}>
      <Stars
        radius={46}
        depth={38}
        count={qualitySettings.stars}
        factor={2.5}
        saturation={0.25}
        fade
        speed={reducedMotion ? 0 : 0.18}
      />

      <Sparkles
        count={qualitySettings.sparkles}
        scale={[13, 8, 6]}
        size={1.4}
        speed={reducedMotion ? 0 : 0.2}
        opacity={0.52}
        color="#87a4ff"
      />
    </group>
  );
}

function Scene({
  interaction,
  coreMode,
  openPlanetPortal,
  planetPortalOpen,
  isFlyingToPlanet,
  setIsFlyingToPlanet,
  quality,
  reducedMotion,
}: SceneProps & {
  coreMode: "STABLE" | "OVERDRIVE" | "QUANTUM";
  openPlanetPortal: () => void;
  planetPortalOpen: boolean;
  isFlyingToPlanet: boolean;
  setIsFlyingToPlanet: (value: boolean) => void;
  quality: QualityLevel;
  reducedMotion: boolean;
}) {
  useFrame((_, delta) => {
    const state = interaction.current;

    if (!state.isDragging) {
      state.dragX += state.velocityX;
      state.dragY += state.velocityY;

      const inertia = Math.pow(0.92, delta * 60);
      const settling = Math.pow(0.985, delta * 60);

      state.velocityX *= inertia;
      state.velocityY *= inertia;

      state.dragX *= settling;
      state.dragY *= settling;
    }

    state.dragX = THREE.MathUtils.clamp(
      state.dragX,
      -1.25,
      1.25,
    );

    state.dragY = THREE.MathUtils.clamp(
      state.dragY,
      -1,
      1,
    );
  });

  return (
    <>
      <CameraRig
        interaction={interaction}
        planetPortalOpen={
          planetPortalOpen || isFlyingToPlanet
        }
        reducedMotion={reducedMotion}
      />

      <SpaceLayer
        interaction={interaction}
        quality={quality}
        reducedMotion={reducedMotion}
      />

      <FloatingParticles
        interaction={interaction}
        quality={quality}
        reducedMotion={reducedMotion}
      />

      <Planet
        interaction={interaction}
        coreMode={coreMode}
        openPlanetPortal={openPlanetPortal}
        setIsFlyingToPlanet={setIsFlyingToPlanet}
        quality={quality}
        reducedMotion={reducedMotion}
      />

      <ambientLight intensity={0.18} />

      <directionalLight
        position={[-5, 4, 5]}
        intensity={3.4}
        color="#bfd0ff"
      />

      <directionalLight
        position={[4, -3, -2]}
        intensity={0.72}
        color="#694eff"
      />

      <fog attach="fog" args={["#03050a", 11, 25]} />
    </>
  );
}

export default function SpaceScene() {
  const {
    quality,
    isPageVisible,
    reducedMotion,
  } = usePerformance();

  const {
    coreMode,
    openPlanetPortal,
    planetPortalOpen,
  } = useUniverse();

  const qualitySettings = QUALITY_SETTINGS[quality];

  const [
    isFlyingToPlanet,
    setIsFlyingToPlanet,
  ] = useState(false);
const sceneContainerRef =
  useRef<HTMLDivElement>(null);

const [isSceneVisible, setIsSceneVisible] =
  useState(true);
  const interaction = useRef<InteractionState>({
    pointerX: 0,
    pointerY: 0,
    dragX: 0,
    dragY: 0,
    velocityX: 0,
    velocityY: 0,
    isDragging: false,
    hasDragged: false,
    planetProximity: 0,
    planetHovered: false,
  });

  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    dragX: 0,
    dragY: 0,
  });
useEffect(() => {
  const sceneElement =
    sceneContainerRef.current;

  if (!sceneElement) {
    return;
  }

  const observer =
    new IntersectionObserver(
      ([entry]) => {
        setIsSceneVisible(
          entry.isIntersecting &&
            entry.intersectionRatio > 0.05,
        );
      },
      {
        threshold: [0, 0.05, 0.2],
        rootMargin: "120px 0px 120px 0px",
      },
    );

  observer.observe(sceneElement);

  return () => {
    observer.disconnect();
  };
}, []);
  useEffect(() => {
    if (!isSceneVisible) {
  interaction.current.isDragging = false;

  document.body.classList.remove(
    "space-dragging",
  );

  document.body.classList.remove(
    "planet-hovering",
  );

  return;
}
    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      interaction.current.pointerX =
        (event.clientX / window.innerWidth - 0.5) *
        2;

      interaction.current.pointerY =
        (event.clientY / window.innerHeight - 0.5) *
        2;

      
      const normalizedPlanetX = 0.5;
      const normalizedPlanetY = 0;

      const distanceX =
        interaction.current.pointerX -
        normalizedPlanetX;

      const distanceY =
        interaction.current.pointerY -
        normalizedPlanetY;

      const distance = Math.sqrt(
        distanceX * distanceX +
          distanceY * distanceY,
      );

      interaction.current.planetProximity =
        THREE.MathUtils.clamp(
          1 - distance / 0.95,
          0,
          1,
        );

      if (!interaction.current.isDragging) {
        return;
      }

      const differenceX =
        (event.clientX -
          dragStart.current.mouseX) /
        window.innerWidth;

      const differenceY =
        (event.clientY -
          dragStart.current.mouseY) /
        window.innerHeight;

      if (
        Math.abs(differenceX) > 0.004 ||
        Math.abs(differenceY) > 0.004
      ) {
        interaction.current.hasDragged = true;
      }

      const nextDragX =
        dragStart.current.dragX +
        differenceX * 2.4;

      const nextDragY =
        dragStart.current.dragY +
        differenceY * 2.1;

      
      interaction.current.velocityX =
        (nextDragX -
          interaction.current.dragX) *
        0.55;

      interaction.current.velocityY =
        (nextDragY -
          interaction.current.dragY) *
        0.55;

      interaction.current.dragX = nextDragX;
      interaction.current.dragY = nextDragY;
    };

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      if (
        event.button !== 0 ||
        planetPortalOpen ||
        isFlyingToPlanet
      ) {
        return;
      }

      interaction.current.isDragging = true;
      interaction.current.hasDragged = false;
      interaction.current.velocityX = 0;
      interaction.current.velocityY = 0;

      dragStart.current = {
        mouseX: event.clientX,
        mouseY: event.clientY,
        dragX: interaction.current.dragX,
        dragY: interaction.current.dragY,
      };

      document.body.classList.add(
        "space-dragging",
      );
    };

    const handlePointerUp = () => {
      interaction.current.isDragging = false;

      document.body.classList.remove(
        "space-dragging",
      );
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    window.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp,
    );

    window.addEventListener(
      "pointercancel",
      handlePointerUp,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      window.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp,
      );

      window.removeEventListener(
        "pointercancel",
        handlePointerUp,
      );

      document.body.classList.remove(
        "space-dragging",
      );

      document.body.classList.remove(
        "planet-hovering",
      );
    };
  }, [planetPortalOpen, isFlyingToPlanet]);

  const shouldRenderContinuously =
  isPageVisible &&
  isSceneVisible &&
  !planetPortalOpen;

  return (
    <div
  ref={sceneContainerRef}
  className="three-scene"
>
      <Canvas
        camera={{
          position: [0, 0, 8.2],
          fov: 42,
          near: 0.1,
          far: 100,
        }}
        dpr={qualitySettings.dpr}
        frameloop={
          shouldRenderContinuously
            ? "always"
            : "never"
        }
        gl={{
          antialias: quality !== "high",
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene
          interaction={interaction}
          coreMode={coreMode}
          openPlanetPortal={openPlanetPortal}
          planetPortalOpen={planetPortalOpen}
          isFlyingToPlanet={isFlyingToPlanet}
          setIsFlyingToPlanet={setIsFlyingToPlanet}
          quality={quality}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
