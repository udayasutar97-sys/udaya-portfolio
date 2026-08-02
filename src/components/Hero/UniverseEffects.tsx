"use client";

import { useUniverse } from "@/components/UI/UniverseContext";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type EffectEvent = {
  id: number;
  type: "CORE" | "ORBITAL";
  label: string;
  className: string;
};

export default function UniverseEffects() {
  const { coreMode, orbitalMode } = useUniverse();

  const previousCoreMode = useRef(coreMode);
  const previousOrbitalMode = useRef(orbitalMode);

  const [effect, setEffect] = useState<EffectEvent | null>(null);

  useEffect(() => {
    if (previousCoreMode.current === coreMode) {
      return;
    }

    previousCoreMode.current = coreMode;

    setEffect({
      id: Date.now(),
      type: "CORE",
      label:
        coreMode === "OVERDRIVE"
          ? "CORE OVERDRIVE ENGAGED"
          : coreMode === "QUANTUM"
            ? "QUANTUM REALITY SHIFT"
            : "CORE STABILIZED",
      className: `universe-effect-${coreMode.toLowerCase()}`,
    });

    const timeout = window.setTimeout(() => {
      setEffect(null);
    }, 1450);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [coreMode]);

  useEffect(() => {
    if (previousOrbitalMode.current === orbitalMode) {
      return;
    }

    previousOrbitalMode.current = orbitalMode;

    setEffect({
      id: Date.now(),
      type: "ORBITAL",
      label:
        orbitalMode === "SWARM"
          ? "ORBITAL SWARM DEPLOYED"
          : orbitalMode === "CALM"
            ? "ORBITAL NETWORK SUSPENDED"
            : "ORBITAL NETWORK ACTIVE",
      className: `universe-effect-${orbitalMode.toLowerCase()}`,
    });

    const timeout = window.setTimeout(() => {
      setEffect(null);
    }, 1200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [orbitalMode]);

  return (
    <div className="universe-effects" aria-live="polite">
      <AnimatePresence mode="wait">
        {effect && (
          <motion.div
            key={effect.id}
            className={`universe-transition ${effect.className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="universe-transition-flash"
              initial={{
                opacity: 0,
                scale: 0.45,
              }}
              animate={{
                opacity: [0, 0.78, 0.18, 0],
                scale: [0.45, 1.05, 1.28, 1.5],
              }}
              transition={{
                duration: 1.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            <motion.div
              className="universe-transition-ring ring-one"
              initial={{
                opacity: 0,
                scale: 0.12,
              }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0.12, 1.05, 1.65],
              }}
              transition={{
                duration: 1.15,
                ease: "easeOut",
              }}
            />

            <motion.div
              className="universe-transition-ring ring-two"
              initial={{
                opacity: 0,
                scale: 0.08,
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0.08, 0.72, 1.32],
              }}
              transition={{
                duration: 1.3,
                delay: 0.08,
                ease: "easeOut",
              }}
            />

            <motion.div
              className="universe-transition-lines"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.65, 0],
              }}
              transition={{
                duration: 0.85,
              }}
            />

            <motion.div
              className="universe-transition-message"
              initial={{
                opacity: 0,
                y: 14,
                letterSpacing: "0.34em",
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [14, 0, 0, -8],
                letterSpacing: [
                  "0.34em",
                  "0.18em",
                  "0.18em",
                  "0.24em",
                ],
              }}
              transition={{
                duration: 1.25,
                times: [0, 0.2, 0.72, 1],
              }}
            >
              <span>{effect.type} SYSTEM</span>
              <strong>{effect.label}</strong>
            </motion.div>

            {effect.type === "CORE" && coreMode === "OVERDRIVE" && (
              <motion.div
                className="overdrive-warning"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0.35, 1, 0],
                }}
                transition={{
                  duration: 1.1,
                  times: [0, 0.15, 0.32, 0.5, 1],
                }}
              >
                WARNING 
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}