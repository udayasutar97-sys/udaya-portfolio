"use client";

import { useUniverse } from "@/components/UI/UniverseContext";
import { visibleProjects } from "@/data/projects";
import { usePerformance } from "@/components/UI/PerformanceManager";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  AudioWaveform,
  BrainCircuit,
  CalendarDays,
  CloudSun,
  Gamepad2,
  MoveHorizontal,
  Orbit,
  RotateCcw,
  ScanFace,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

const projectIcons: Record<string, LucideIcon> = {
  "q-adapt": Orbit,
  "snowman-ai": BrainCircuit,
  "face-emotion-recognition": ScanFace,
  "community-events": CalendarDays,
  "block-ninja": Gamepad2,
  "sonic-air": AudioWaveform,
  weatherx: CloudSun,
};

const projectPositions: Record<string, string> = {
  "q-adapt": "portal-hotspot-one",
  "snowman-ai": "portal-hotspot-two",
  "face-emotion-recognition": "portal-hotspot-three",
  "community-events": "portal-hotspot-four",
  "block-ninja": "portal-hotspot-five",
  "sonic-air": "portal-hotspot-six",
  weatherx: "portal-hotspot-seven",
};

export default function PlanetPortal() {
  const {
    planetPortalOpen,
    selectedProject,
    closePlanetPortal,
    openProject,
    closeProject,
  } = useUniverse();

  const { isCoarsePointer } = usePerformance();

  const [isDraggingWorld, setIsDraggingWorld] =
    useState(false);

  const [hasExploredWorld, setHasExploredWorld] =
    useState(false);

  const worldWasDragged = useRef(false);

  const dragResetTimeout =
    useRef<number | null>(null);

  const worldX = useMotionValue(0);
  const worldY = useMotionValue(0);

  const worldRotate = useTransform(
    worldX,
    [-420, 0, 420],
    [-13, 0, 13],
  );

  const worldScale = useTransform(
    worldY,
    [-260, 0, 260],
    [1.035, 1, 0.965],
  );

  const activeProject = visibleProjects.find(
    (project) =>
      project.id === selectedProject,
  );

  const openProjectFromElement = useCallback(
    (
      projectId: string,
      element: HTMLElement,
    ) => {
      const rectangle =
        element.getBoundingClientRect();

      openProject(projectId, {
        source: "planet",
        originRect: {
          top: rectangle.top,
          left: rectangle.left,
          width: rectangle.width,
          height: rectangle.height,
        },
      });
    },
    [openProject],
  );

  const resetWorldPosition = useCallback(() => {
    setIsDraggingWorld(false);
    setHasExploredWorld(false);

    worldWasDragged.current = false;

    if (dragResetTimeout.current !== null) {
      window.clearTimeout(
        dragResetTimeout.current,
      );

      dragResetTimeout.current = null;
    }

    worldX.stop();
    worldY.stop();

    worldX.set(0);
    worldY.set(0);
  }, [worldX, worldY]);

  
  useEffect(() => {
    if (
      isCoarsePointer &&
      planetPortalOpen
    ) {
      closeProject();
      closePlanetPortal();
    }
  }, [
    isCoarsePointer,
    planetPortalOpen,
    closeProject,
    closePlanetPortal,
  ]);

  useEffect(() => {
    if (!planetPortalOpen) {
      resetWorldPosition();
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        if (selectedProject) {
          closeProject();
        } else {
          closePlanetPortal();
        }

        return;
      }

      if (
        event.key.toLowerCase() === "r"
      ) {
        event.preventDefault();
        resetWorldPosition();
        return;
      }

      const movementAmount =
        event.shiftKey ? 90 : 45;

      if (event.key === "ArrowLeft") {
        event.preventDefault();

        worldX.set(
          Math.min(
            worldX.get() +
              movementAmount,
            430,
          ),
        );

        setHasExploredWorld(true);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();

        worldX.set(
          Math.max(
            worldX.get() -
              movementAmount,
            -430,
          ),
        );

        setHasExploredWorld(true);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        worldY.set(
          Math.min(
            worldY.get() +
              movementAmount,
            280,
          ),
        );

        setHasExploredWorld(true);
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();

        worldY.set(
          Math.max(
            worldY.get() -
              movementAmount,
            -280,
          ),
        );

        setHasExploredWorld(true);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    planetPortalOpen,
    selectedProject,
    closePlanetPortal,
    closeProject,
    resetWorldPosition,
    worldX,
    worldY,
  ]);

  useEffect(() => {
    return () => {
      if (
        dragResetTimeout.current !== null
      ) {
        window.clearTimeout(
          dragResetTimeout.current,
        );
      }
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {planetPortalOpen &&
          !isCoarsePointer && (
            <motion.section
              className="planet-portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.42,
              }}
            >
              <div className="planet-portal-grid" />
              <div className="planet-portal-vignette" />

              <motion.div
                className={`planet-portal-world ${
                  isDraggingWorld
                    ? "planet-portal-world-dragging"
                    : ""
                }`}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  opacity: {
                    duration: 0.65,
                  },
                }}
                drag
                dragConstraints={{
                  left: -430,
                  right: 430,
                  top: -280,
                  bottom: 280,
                }}
                dragElastic={0.08}
                dragMomentum
                dragTransition={{
                  bounceStiffness: 220,
                  bounceDamping: 28,
                  power: 0.22,
                  timeConstant: 320,
                }}
                style={{
                  x: worldX,
                  y: worldY,
                  rotate: worldRotate,
                  scale: worldScale,
                }}
                onDragStart={() => {
                  if (
                    dragResetTimeout.current !==
                    null
                  ) {
                    window.clearTimeout(
                      dragResetTimeout.current,
                    );

                    dragResetTimeout.current =
                      null;
                  }

                  setIsDraggingWorld(true);
                  setHasExploredWorld(true);

                  worldWasDragged.current =
                    true;
                }}
                onDragEnd={() => {
                  setIsDraggingWorld(false);

                  dragResetTimeout.current =
                    window.setTimeout(() => {
                      worldWasDragged.current =
                        false;

                      dragResetTimeout.current =
                        null;
                    }, 140);
                }}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  resetWorldPosition();
                }}
              >
                <div className="portal-world-surface" />
                <div className="portal-world-atmosphere" />

                <div className="portal-world-orbit portal-orbit-one" />
                <div className="portal-world-orbit portal-orbit-two" />

                {visibleProjects.map(
                  (project, index) => {
                    const Icon =
                      projectIcons[
                        project.id
                      ];

                    const position =
                      projectPositions[
                        project.id
                      ];

                    if (!Icon || !position) {
                      return null;
                    }

                    return (
                      <motion.button
                        key={project.id}
                        type="button"
                        className={`portal-hotspot ${position}`}
                        onPointerDown={(
                          event,
                        ) => {
                          event.stopPropagation();
                        }}
                        onClick={(event) => {
                          event.stopPropagation();

                          if (
                            isDraggingWorld ||
                            worldWasDragged.current
                          ) {
                            return;
                          }

                          openProjectFromElement(
                            project.id,
                            event.currentTarget,
                          );
                        }}
                        initial={{
                          opacity: 0,
                          scale: 0.45,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          delay:
                            0.38 +
                            index * 0.08,
                          duration: 0.34,
                          ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                          ],
                        }}
                        whileHover={{
                          scale: 1.1,
                          transition: {
                            duration: 0.14,
                          },
                        }}
                        whileTap={{
                          scale: 0.94,
                          transition: {
                            duration: 0.08,
                          },
                        }}
                        aria-label={`Open ${project.title}`}
                      >
                        <span className="portal-hotspot-pulse" />

                        <span className="portal-hotspot-icon">
                          <Icon size={17} />
                        </span>

                        <span className="portal-hotspot-label">
                          <small>
                            {project.number}
                          </small>

                          <strong>
                            {project.title}
                          </strong>
                        </span>
                      </motion.button>
                    );
                  },
                )}
              </motion.div>

              <header className="planet-portal-header">
                <button
                  type="button"
                  className="portal-back-button"
                  onClick={() => {
                    closeProject();
                    closePlanetPortal();
                  }}
                >
                  <ArrowLeft size={16} />
                  RETURN TO ORBIT
                </button>

                <div className="portal-header-status">
                  <span className="portal-status-dot" />
                  PLANETARY INTERFACE ONLINE
                </div>

                <button
                  type="button"
                  className="portal-close-button"
                  onClick={() => {
                    closeProject();
                    closePlanetPortal();
                  }}
                  aria-label="Close planetary interface"
                >
                  <X size={18} />
                </button>
              </header>

              <div className="planet-portal-title">
                <p>
                  UDAYA.SYS 
                  NAVIGATION
                </p>

                <h2>
                  SELECT A
                  <br />
                  <span>COORDINATE.</span>
                </h2>

                <p>
                  Drag the world to explore
                  every project node. Click any
                  coordinate to inspect the
                  project.
                </p>

                <button
                  type="button"
                  className="portal-title-reset"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    resetWorldPosition();
                  }}
                >
                  <RotateCcw size={14} />
                  RESET WORLD
                </button>
              </div>

              <div className="portal-coordinate-readout">
                <span>
                  LAT 
                </span>

                <span>
                  LON 
                </span>

                <span>
                  ORBIT 
                </span>
              </div>

              <AnimatePresence>
                {activeProject && (
                  <motion.aside
                    className="portal-project-drawer"
                    initial={{
                      opacity: 0,
                      x: 70,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 70,
                    }}
                    transition={{
                      duration: 0.34,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                  >
                    <button
                      type="button"
                      className="portal-drawer-close"
                      onClick={
                        closeProject
                      }
                      aria-label="Close project"
                    >
                      <X size={17} />
                    </button>

                    <p className="portal-project-index">
                      PROJECT NODE 
                      {
                        activeProject.number
                      }
                    </p>

                    <div className="portal-project-icon">
                      {(() => {
                        const ActiveIcon =
                          projectIcons[
                            activeProject
                              .id
                          ];

                        return ActiveIcon ? (
                          <ActiveIcon
                            size={28}
                          />
                        ) : null;
                      })()}
                    </div>

                    <p className="portal-project-category">
                      {
                        activeProject.category
                      }
                    </p>

                    <h3>
                      {activeProject.title}
                    </h3>

                    <p className="portal-project-description">
                      {
                        activeProject.overview
                      }
                    </p>

                    <div className="portal-project-tags">
                      {activeProject.technologies
                        .slice(0, 4)
                        .map(
                          (
                            technology,
                          ) => (
                            <span
                              key={
                                technology
                              }
                            >
                              {
                                technology
                              }
                            </span>
                          ),
                        )}
                    </div>

                    <button
                      type="button"
                      className="portal-project-link"
                      onClick={(
                        event: ReactMouseEvent<HTMLButtonElement>,
                      ) => {
                        openProjectFromElement(
                          activeProject.id,
                          event.currentTarget,
                        );
                      }}
                    >
                      VIEW PROJECT DETAILS
                      <ArrowUpRight
                        size={17}
                      />
                    </button>
                  </motion.aside>
                )}
              </AnimatePresence>

              {!hasExploredWorld && (
                <motion.div
                  className="portal-drag-cue"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.8,
                    duration: 0.4,
                  }}
                >
                  <motion.div
                    className="portal-drag-cue-icon"
                    animate={{
                      x: [
                        -10,
                        10,
                        -10,
                      ],
                      opacity: [
                        0.45,
                        1,
                        0.45,
                      ],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <MoveHorizontal
                      size={22}
                    />
                  </motion.div>

                  <strong>
                    DRAG THE PLANET
                  </strong>

                  <span>
                    EXPLORE ALL PROJECT
                    COORDINATES
                  </span>
                </motion.div>
              )}

              <div className="portal-interaction-hint">
                DRAG TO EXPLORE
                <span />
                DOUBLE CLICK TO RESET
              </div>
            </motion.section>
          )}
      </AnimatePresence>

      <style jsx global>{`
        /*
         * Reset button under the description
         * inside SELECT A COORDINATE.
         */

        .portal-title-reset {
          position: static !important;
          inset: auto !important;
          transform: none !important;

          width: fit-content;
          min-height: 42px;
          margin-top: 28px;
          padding: 0 17px;

          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          color: #8190aa;

          border: 1px solid
            rgba(
              113,
              149,
              220,
              0.2
            );

          background:
            linear-gradient(
              135deg,
              rgba(
                9,
                15,
                32,
                0.76
              ),
              rgba(
                4,
                9,
                21,
                0.88
              )
            );

          font-family: inherit;
          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.16em;

          cursor: pointer;

          transition:
            color 0.16s ease,
            border-color 0.16s ease,
            background 0.16s ease,
            transform 0.16s ease;
        }

        .portal-title-reset:hover {
          color: #ffffff;

          border-color: rgba(
            126,
            166,
            255,
            0.48
          );

          background: rgba(
            69,
            99,
            187,
            0.1
          );

          transform: translateY(
            -2px
          ) !important;
        }

        .portal-title-reset:active {
          transform: translateY(
            0
          ) !important;
        }

        /*
         * Prevent any old standalone reset
         * button rule from rendering.
         */

        .portal-reset-world {
          display: none !important;
        }

        @media (max-width: 720px) {
          .portal-title-reset {
            min-height: 38px;
            margin-top: 20px;
            padding: 0 14px;
          }
        }

        @media (
          max-height: 720px
        ) and (min-width: 721px) {
          .portal-title-reset {
            min-height: 36px;
            margin-top: 17px;
          }
        }

        .planet-portal-title
          > p:last-of-type {
          max-width: 500px;
          margin-top: 28px;

          color: #60708a;

          font-size: clamp(
            8px,
            0.68vw,
            11px
          );

          font-weight: 700;
          line-height: 1.9;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
      `}</style>
    </>
  );
}
