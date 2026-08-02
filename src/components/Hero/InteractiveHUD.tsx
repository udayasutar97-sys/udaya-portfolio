"use client";

import { useUniverse } from "@/components/UI/UniverseContext";
import { usePerformance } from "@/components/UI/PerformanceManager";
import { motion, useMotionValue, useSpring } from "motion/react";
import {
  Activity,
  Atom,
  Cpu,
  Crosshair,
  RotateCcw,
  Satellite,
  Signal,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

type PanelProps = {
  className: string;
  children: ReactNode;
  initialX?: number;
  initialY?: number;
  rotate?: number;
  dragEnabled: boolean;
};

function DraggablePanel({
  className,
  children,
  initialX = 0,
  initialY = 0,
  rotate = 0,
  dragEnabled,
}: PanelProps) {
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  const smoothRotateX = useSpring(0, {
    stiffness: 150,
    damping: 18,
  });

  const smoothRotateY = useSpring(0, {
    stiffness: 150,
    damping: 18,
  });

  const reset = () => {
    x.set(initialX);
    y.set(initialY);
    smoothRotateX.set(0);
    smoothRotateY.set(0);
  };

  return (
    <motion.div
      className={`hud-panel ${className} ${
        dragEnabled ? "hud-panel-draggable" : "hud-panel-static"
      }`}
      drag={dragEnabled}
      dragMomentum={dragEnabled}
      dragElastic={dragEnabled ? 0.12 : 0}
      dragTransition={
        dragEnabled
          ? {
              bounceStiffness: 280,
              bounceDamping: 22,
              power: 0.18,
              timeConstant: 260,
            }
          : undefined
      }
      style={{
        x,
        y,
        rotate,
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
      }}
      whileHover={
        dragEnabled
          ? {
              scale: 1.025,
              borderColor: "rgba(125, 171, 255, 0.52)",
            }
          : undefined
      }
      whileDrag={
        dragEnabled
          ? {
              scale: 1.045,
              zIndex: 30,
            }
          : undefined
      }
      onDrag={
        dragEnabled
          ? (_, info) => {
              smoothRotateY.set(info.velocity.x * 0.006);
              smoothRotateX.set(-info.velocity.y * 0.006);
            }
          : undefined
      }
      onDragEnd={
        dragEnabled
          ? () => {
              smoothRotateX.set(0);
              smoothRotateY.set(0);
            }
          : undefined
      }
      onDoubleClick={dragEnabled ? reset : undefined}
    >
      {dragEnabled && (
        <div className="hud-panel-drag-handle">
          <span />
          <span />
          <span />
        </div>
      )}

      {children}
    </motion.div>
  );
}

export default function InteractiveHUD() {
  const {
    coreMode,
    orbitalMode,
    cycleCoreMode,
    cycleOrbitalMode,
  } = useUniverse();

  const {
    quality,
    reducedMotion,
    isCoarsePointer,
    isPageVisible,
  } = usePerformance();

  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
  });

  const [signalStrength, setSignalStrength] =
    useState(92);

  const hudEnabled =
    quality !== "low" &&
    !isCoarsePointer;

  const dragEnabled =
    quality === "high" &&
    !reducedMotion &&
    !isCoarsePointer;

  const continuousAnimation =
    quality === "high" &&
    !reducedMotion &&
    isPageVisible;

  useEffect(() => {
    if (!hudEnabled) {
      return;
    }

    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      setCursor({
        x: Math.round(event.clientX),
        y: Math.round(event.clientY),
      });
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );
    };
  }, [hudEnabled]);

  useEffect(() => {
    if (!hudEnabled || !isPageVisible) {
      return;
    }

    const signalInterval = window.setInterval(
      () => {
        setSignalStrength(
          88 + Math.round(Math.random() * 11),
        );
      },
      quality === "high" ? 1500 : 2500,
    );

    return () => {
      window.clearInterval(signalInterval);
    };
  }, [
    hudEnabled,
    isPageVisible,
    quality,
  ]);

  if (!hudEnabled) {
    return null;
  }

  return (
    <div
      className={`interactive-hud interactive-hud-${quality}`}
    >
      <DraggablePanel
        className="hud-panel-coordinates"
        initialX={0}
        initialY={0}
        rotate={-1.4}
        dragEnabled={dragEnabled}
      >
        <div className="hud-panel-heading">
          <span>
            <Crosshair size={13} />
            TRACKING MATRIX
          </span>

          <span className="hud-live-indicator">
            LIVE
          </span>
        </div>

        <div className="hud-coordinate-grid">
          <div>
            <span>CURSOR X</span>
            <strong>
              {cursor.x
                .toString()
                .padStart(4, "0")}
            </strong>
          </div>

          <div>
            <span>CURSOR Y</span>
            <strong>
              {cursor.y
                .toString()
                .padStart(4, "0")}
            </strong>
          </div>

          <div>
            <span>DEPTH</span>
            <strong>08.2</strong>
          </div>

          <div>
            <span>VECTOR</span>
            <strong>LOCKED</strong>
          </div>
        </div>

        <div className="hud-scanner">
          {continuousAnimation ? (
            <motion.div
              animate={{
                x: ["-10%", "110%", "-10%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ) : (
            <div />
          )}
        </div>
      </DraggablePanel>

      <DraggablePanel
        className="hud-panel-core"
        initialX={0}
        initialY={0}
        rotate={1.2}
        dragEnabled={dragEnabled}
      >
        <div className="hud-panel-heading">
          <span>
            <Atom size={13} />
            QUANTUM CORE
          </span>

          <span>Q-01</span>
        </div>

        <button
          type="button"
          className={`hud-core-button hud-core-${coreMode.toLowerCase()}`}
          onClick={cycleCoreMode}
        >
          <span className="hud-core-rings">
            <span />
            <span />
            <span />
          </span>

          <span className="hud-core-centre">
            <Zap size={18} />
          </span>
        </button>

        <div className="hud-core-mode">
          <span>CORE STATE</span>
          <strong>{coreMode}</strong>
        </div>

        <p>
          Click the reactor to cycle operating
          modes.
        </p>
      </DraggablePanel>

      <DraggablePanel
        className="hud-panel-network"
        initialX={0}
        initialY={0}
        rotate={-0.8}
        dragEnabled={dragEnabled}
      >
        <div className="hud-panel-heading">
          <span>
            <Satellite size={13} />
            ORBITAL NETWORK
          </span>

          <Signal size={13} />
        </div>

        <button
          type="button"
          className="hud-network-button"
          onClick={cycleOrbitalMode}
        >
          <div className="hud-signal-value">
            <strong>{signalStrength}%</strong>
            <span>SIGNAL INTEGRITY</span>
          </div>

          <div className="hud-signal-bars">
            {Array.from(
              { length: 12 },
              (_, index) => {
                const active =
                  index <
                  Math.round(
                    signalStrength / 8.34,
                  );

                return continuousAnimation ? (
                  <motion.span
                    key={index}
                    animate={{
                      opacity: active
                        ? [0.6, 1, 0.72]
                        : 0.12,
                      scaleY: active
                        ? [0.78, 1, 0.84]
                        : 0.4,
                    }}
                    transition={{
                      duration: 1.2,
                      delay: index * 0.035,
                      repeat: Infinity,
                    }}
                  />
                ) : (
                  <span
                    key={index}
                    style={{
                      opacity: active
                        ? 0.85
                        : 0.12,
                      transform: `scaleY(${
                        active ? 0.9 : 0.4
                      })`,
                    }}
                  />
                );
              },
            )}
          </div>

          <div className="hud-network-row">
            <span>
              <Activity size={11} />
              {orbitalMode}
            </span>

            <span>
              <Cpu size={11} />
              ONLINE
            </span>
          </div>

          <div className="hud-network-mode">
            {orbitalMode}
          </div>
        </button>
      </DraggablePanel>

      {quality === "high" && (
        <DraggablePanel
          className="hud-panel-instructions"
          initialX={0}
          initialY={0}
          rotate={0.7}
          dragEnabled={dragEnabled}
        >
          <div className="hud-panel-heading">
            <span>
              <Sparkles size={13} />
              INTERACTION GUIDE
            </span>

            <RotateCcw size={12} />
          </div>

          <div className="hud-instruction-list">
            <span>
              <strong>DRAG</strong>
              MOVE INTERFACE MODULES
            </span>

            <span>
              <strong>CLICK</strong>
              ALTER CORE STATE
            </span>

            <span>
              <strong>DOUBLE CLICK</strong>
              RESET A MODULE
            </span>

            <span>
              <strong>DRAG SPACE</strong>
              ROTATE THE UNIVERSE
            </span>
          </div>
        </DraggablePanel>
      )}
    </div>
  );
}
