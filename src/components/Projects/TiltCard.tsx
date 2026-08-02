"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePerformance } from "@/components/UI/PerformanceManager";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

export default function TiltCard({
  children,
  className = "",
}: TiltCardProps) {
  const {
    quality,
    reducedMotion,
    isCoarsePointer,
  } = usePerformance();

  const cardRef = useRef<HTMLDivElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, {
    stiffness: 160,
    damping: 22,
    mass: 0.45,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 160,
    damping: 22,
    mass: 0.45,
  });

  const rotateX = useTransform(
    smoothY,
    [-0.5, 0.5],
    [7, -7],
  );

  const rotateY = useTransform(
    smoothX,
    [-0.5, 0.5],
    [-7, 7],
  );

  const highlightX = useTransform(
    smoothX,
    [-0.5, 0.5],
    ["20%", "80%"],
  );

  const highlightY = useTransform(
    smoothY,
    [-0.5, 0.5],
    ["20%", "80%"],
  );

  const tiltEnabled =
    quality !== "low" &&
    !reducedMotion &&
    !isCoarsePointer;

  const handleMouseMove = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (!tiltEnabled || !cardRef.current) {
      return;
    }

    const rect =
      cardRef.current.getBoundingClientRect();

    pointerX.set(
      (event.clientX - rect.left) / rect.width - 0.5,
    );

    pointerY.set(
      (event.clientY - rect.top) / rect.height - 0.5,
    );
  };

  const handleMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`tilt-card ${
        tiltEnabled ? "tilt-card-enabled" : "tilt-card-static"
      } ${className}`}
      style={
        tiltEnabled
          ? {
              rotateX,
              rotateY,
              transformPerspective: 1100,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={
        tiltEnabled
          ? {
              scale: 1.015,
            }
          : undefined
      }
      transition={{
        scale: {
          duration: 0.25,
        },
      }}
    >
      {tiltEnabled && (
        <motion.div
          className="tilt-card-highlight"
          style={{
            left: highlightX,
            top: highlightY,
          }}
        />
      )}

      <div className="tilt-card-content">
        {children}
      </div>
    </motion.div>
  );
}