"use client";

import { visibleProjects } from "@/data/projects";
import Image from "next/image";
import { useUniverse } from "@/components/UI/UniverseContext";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  GitBranch,
  Lightbulb,
  Target,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

const projectNavigationItems = visibleProjects;

type TransitionFrame = {
  opacity: number;
  x: number;
  y: number;
  scale: number;
  borderRadius: number;
  filter: string;
};

const DEFAULT_TRANSITION_FRAME: TransitionFrame = {
  opacity: 0,
  x: 0,
  y: 20,
  scale: 0.97,
  borderRadius: 20,
  filter: "blur(10px)",
};

function getTransitionFrame(
  originRect:
    | {
        top: number;
        left: number;
        width: number;
        height: number;
      }
    | null
    | undefined,
): TransitionFrame {
  if (
    !originRect ||
    typeof window === "undefined"
  ) {
    return DEFAULT_TRANSITION_FRAME;
  }

  const viewportWidth = Math.max(
    window.innerWidth,
    1,
  );

  const viewportHeight = Math.max(
    window.innerHeight,
    1,
  );

  const originCenterX =
    originRect.left +
    originRect.width / 2;

  const originCenterY =
    originRect.top +
    originRect.height / 2;

  const viewportCenterX =
    viewportWidth / 2;

  const viewportCenterY =
    viewportHeight / 2;

  const widthScale =
    originRect.width / viewportWidth;

  const heightScale =
    originRect.height / viewportHeight;

  const scale = Math.max(
    0.055,
    Math.min(
      0.96,
      Math.max(widthScale, heightScale),
    ),
  );

  return {
    opacity: 0.18,
    x: originCenterX - viewportCenterX,
    y: originCenterY - viewportCenterY,
    scale,
    borderRadius: 28,
    filter: "blur(8px)",
  };
}

export default function ProjectExperience() {
  const {
    selectedProject,
    projectTransition,
    openProject,
    closeProject,
    closePlanetPortal,
    clearProjectTransition,
  } = useUniverse();

  const experienceRef =
    useRef<HTMLElement>(null);

  const projectNavigationRef =
    useRef<HTMLDivElement>(null);

  const projectIndex = visibleProjects.findIndex(
    (project) =>
      project.id === selectedProject,
  );

  const activeProject =
    projectIndex >= 0
      ? visibleProjects[projectIndex]
      : null;

  const previousProject =
    projectIndex >= 0
      ? visibleProjects[
          (projectIndex -
            1 +
            visibleProjects.length) %
            visibleProjects.length
        ]
      : null;

  const nextProject =
    projectIndex >= 0
      ? visibleProjects[
          (projectIndex + 1) %
            visibleProjects.length
        ]
      : null;

  const transitionFrame = useMemo(
    () =>
      getTransitionFrame(
        projectTransition?.originRect,
      ),
    [projectTransition],
  );

  const handleClose = useCallback(() => {
    closeProject();
  }, [closeProject]);

  const handleReturnToPortfolio =
    useCallback(() => {
      closeProject();

      window.setTimeout(() => {
        closePlanetPortal();
      }, 620);
    }, [
      closeProject,
      closePlanetPortal,
    ]);

  const handleProjectChange = useCallback(
    (projectId: string) => {
      
      experienceRef.current?.scrollTo({
        top: 0,
        behavior: "auto",
      });

      
      openProject(projectId);
    },
    [openProject],
  );

  const scrollProjectNavigation = (
    direction: "left" | "right",
  ) => {
    const navigation =
      projectNavigationRef.current;

    if (!navigation) {
      return;
    }

    const movement = Math.max(
      navigation.clientWidth * 0.7,
      220,
    );

    navigation.scrollBy({
      left:
        direction === "left"
          ? -movement
          : movement,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!activeProject) {
      document.body.classList.remove(
        "project-experience-active",
      );

      return;
    }

    document.body.classList.add(
      "project-experience-active",
    );

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      if (
        event.key === "ArrowLeft" &&
        previousProject
      ) {
        event.preventDefault();

        handleProjectChange(
          previousProject.id,
        );
      }

      if (
        event.key === "ArrowRight" &&
        nextProject
      ) {
        event.preventDefault();

        handleProjectChange(
          nextProject.id,
        );
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

      document.body.classList.remove(
        "project-experience-active",
      );
    };
  }, [
    activeProject,
    previousProject,
    nextProject,
    handleClose,
    handleProjectChange,
  ]);

  return (
    <>
      <AnimatePresence
        onExitComplete={() => {
          clearProjectTransition();
        }}
      >
        {activeProject && (
          
          <motion.section
            ref={experienceRef}
            className={`project-experience project-experience-${activeProject.visual}`}
            data-lenis-prevent
            initial={transitionFrame}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              borderRadius: 0,
              filter: "blur(0px)",
            }}
            exit={transitionFrame}
            transition={{
              duration: 0.72,
              ease: [0.16, 1, 0.3, 1],
              opacity: {
                duration: 0.46,
              },
              filter: {
                duration: 0.5,
              },
            }}
            style={{
              transformOrigin: "center center",
              willChange:
                "transform, opacity, filter, border-radius",
            }}
          >
            <motion.div
              className="project-experience-transition-flare"
              initial={{
                opacity: 0.72,
                scale: 0.72,
              }}
              animate={{
                opacity: 0,
                scale: 1.35,
              }}
              exit={{
                opacity: 0.55,
                scale: 0.78,
              }}
              transition={{
                duration: 0.72,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            <div className="project-experience-background">
              <div className="project-experience-grid" />
              <div className="project-experience-glow" />

              <div className="project-experience-orbit project-experience-orbit-one" />
              <div className="project-experience-orbit project-experience-orbit-two" />
            </div>

            <header className="project-experience-header">
              <button
                type="button"
                className="project-experience-back"
                onClick={
                  handleReturnToPortfolio
                }
              >
                <ArrowLeft size={16} />
                RETURN TO PORTFOLIO
              </button>

              <div className="project-experience-status">
                <span />
                {activeProject.status}
              </div>

              <button
                type="button"
                className="project-experience-close"
                onClick={handleClose}
                aria-label="Close project details"
              >
                <X size={18} />
              </button>
            </header>

            <div className="project-progress-shell">
              <button
                type="button"
                className="project-progress-arrow project-progress-arrow-left"
                onClick={() =>
                  scrollProjectNavigation(
                    "left",
                  )
                }
                aria-label="Scroll project list left"
              >
                <ArrowLeft size={17} />
              </button>

              <div
                ref={projectNavigationRef}
                className="project-experience-progress"
              >
                {projectNavigationItems.map(
                  (project, index) => (
                    <button
                      key={project.id}
                      type="button"
                      className={
                        project.id ===
                        activeProject.id
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        handleProjectChange(
                          project.id,
                        )
                      }
                      aria-label={`Open ${project.title}`}
                    >
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <strong>
                        {project.shortTitle}
                      </strong>
                    </button>
                  ),
                )}
              </div>

              <button
                type="button"
                className="project-progress-arrow project-progress-arrow-right"
                onClick={() =>
                  scrollProjectNavigation(
                    "right",
                  )
                }
                aria-label="Scroll project list right"
              >
                <ArrowRight size={17} />
              </button>
            </div>

            {}
            <AnimatePresence
              mode="popLayout"
              initial={false}
            >
              <motion.main
                key={activeProject.id}
                className="project-experience-content"
                initial={{
                  opacity: 0,
                  y: 28,
                  scale: 0.985,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -24,
                  scale: 0.985,
                }}
                transition={{
                  duration: 0.42,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="project-experience-hero">
                  <div className="project-experience-meta">
                    <span>
                      PROJECT 
                      {
                        activeProject.number
                      }
                    </span>

                    <span>
                      {
                        activeProject.category
                      }
                    </span>
                  </div>

                  <h1>
                    {activeProject.title}
                  </h1>

                  <p className="project-experience-summary">
                    {
                      activeProject.summary
                    }
                  </p>

                  <div className="project-experience-actions">
                    {activeProject.repository && (
                      <a
                        href={
                          activeProject.repository
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <GitBranch
                          size={17}
                        />

                        VIEW SOURCE CODE

                        <ArrowUpRight
                          size={15}
                        />
                      </a>
                    )}

                    {activeProject.liveDemo ? (
                      <a
                        href={
                          activeProject.liveDemo
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        OPEN LIVE DEMO

                        <ArrowUpRight
                          size={16}
                        />
                      </a>
                    ) : (
                      <div className="project-demo-unavailable">
                        <span>
                          LOCAL BUILD ONLY
                        </span>

                        <small>
                          Deployment is
                          currently unavailable.
                        </small>
                      </div>
                    )}
                  </div>
                </div>

                <div className="project-experience-visual">
  <div className="project-visual-interface">
    <div className="project-visual-radar" />
    <div className="project-visual-core" />

    <div className="project-visual-axis project-visual-axis-x" />
    <div className="project-visual-axis project-visual-axis-y" />

    <span className="project-visual-label project-visual-label-one">
      NODE 
    </span>

    <span className="project-visual-label project-visual-label-two">
      SYSTEM 
    </span>

    <span className="project-visual-label project-visual-label-three">
      STATUS 
    </span>

    <div className="project-floating-gallery">
      {activeProject.images.map((image, index) => (
        <motion.figure
          key={image.src}
          className={`project-floating-image project-floating-image-${index + 1}`}
          initial={{
            opacity: 0,
            scale: 0.86,
            y: 24,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -9, 0, 7, 0],
            rotate: [
              index === 0 ? -4 : index === 1 ? 3 : -2,
              index === 0 ? -2 : index === 1 ? 1 : 1,
              index === 0 ? -4 : index === 1 ? 3 : -2,
            ],
          }}
          transition={{
            opacity: {
              duration: 0.55,
              delay: 0.28 + index * 0.12,
            },
            scale: {
              duration: 0.65,
              delay: 0.28 + index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            },
            y: {
              duration: 8 + index * 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.7,
            },
            rotate: {
              duration: 10 + index * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            },
          }}
        >
          <div className="project-floating-image-frame">
            <img
  src={image.src}
  alt={image.alt}
  className="project-floating-image-content"
  loading="lazy"
  draggable={false}
/>
          </div>

          <figcaption>
            <span>
              FRAME 
            </span>

            <small>{image.caption}</small>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  </div>
</div>

                <div className="project-experience-sections">
                  <motion.article
                    className="project-information-panel project-overview-panel"
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.1,
                    }}
                  >
                    <div className="project-panel-heading">
                      <span>
                        <Target
                          size={15}
                        />
                        01 
                      </span>
                    </div>

                    <p>
                      {
                        activeProject.overview
                      }
                    </p>
                  </motion.article>

                  <motion.article
                    className="project-information-panel project-motivation-panel"
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.1,
                    }}
                  >
                    <div className="project-panel-heading">
                      <span>
                        <Lightbulb
                          size={15}
                        />
                        02 
                        IT
                      </span>
                    </div>

                    <p>
                      {
                        activeProject.motivation
                      }
                    </p>
                  </motion.article>

                  <motion.article
                    className="project-information-panel project-contribution-panel"
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.1,
                    }}
                  >
                    <div className="project-panel-heading">
                      <span>
                        <Code2
                          size={15}
                        />
                        03 
                        CONTRIBUTION
                      </span>
                    </div>

                    <div className="project-contribution-list">
                      {activeProject.contribution.map(
                        (
                          contribution,
                          index,
                        ) => (
                          <div
                            key={
                              contribution
                            }
                            className="project-contribution-item"
                          >
                            <span>
                              {String(
                                index + 1,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </span>

                            <p>
                              {
                                contribution
                              }
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </motion.article>

                  <motion.article
                    className="project-information-panel project-highlights-panel"
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.1,
                    }}
                  >
                    <div className="project-panel-heading">
                      <span>
                        <Check
                          size={15}
                        />
                        04 
                      </span>
                    </div>

                    <div className="project-highlight-grid">
                      {activeProject.highlights.map(
                        (highlight) => (
                          <div
                            key={
                              highlight
                            }
                            className="project-highlight-item"
                          >
                            <Check
                              size={13}
                            />

                            <span>
                              {
                                highlight
                              }
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </motion.article>

                  <motion.article
                    className="project-information-panel project-technology-panel"
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.1,
                    }}
                  >
                    <div className="project-panel-heading">
                      <span>
                        <Code2
                          size={15}
                        />
                        05 
                      </span>
                    </div>

                    <div className="project-technology-list">
                      {activeProject.technologies.map(
                        (
                          technology,
                          index,
                        ) => (
                          <span
                            key={
                              technology
                            }
                          >
                            <small>
                              {String(
                                index + 1,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </small>

                            {
                              technology
                            }
                          </span>
                        ),
                      )}
                    </div>
                  </motion.article>
                </div>

                <div className="project-experience-navigation">
                  {previousProject && (
                    <button
                      type="button"
                      onClick={() =>
                        handleProjectChange(
                          previousProject.id,
                        )
                      }
                    >
                      <ArrowLeft
                        size={18}
                      />

                      <span>
                        <small>
                          PREVIOUS PROJECT
                        </small>

                        <strong>
                          {
                            previousProject.shortTitle
                          }
                        </strong>
                      </span>
                    </button>
                  )}

                  {nextProject && (
                    <button
                      type="button"
                      className="project-navigation-next"
                      onClick={() =>
                        handleProjectChange(
                          nextProject.id,
                        )
                      }
                    >
                      <span>
                        <small>
                          NEXT PROJECT
                        </small>

                        <strong>
                          {
                            nextProject.shortTitle
                          }
                        </strong>
                      </span>

                      <ArrowRight
                        size={18}
                      />
                    </button>
                  )}
                </div>
              </motion.main>
            </AnimatePresence>

            <footer className="project-experience-footer">
              <span>
                UDAYA.SYS 
                ARCHIVE • 07 PROJECTS
              </span>

              <span>
                USE ← → TO NAVIGATE 
                ESC TO CLOSE
              </span>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .project-experience-transition-flare {
          position: fixed;
          inset: 50% auto auto 50%;
          z-index: 1000;
          width: min(62vw, 760px);
          aspect-ratio: 1;
          translate: -50% -50%;
          border-radius: 50%;
          pointer-events: none;
          background:
            radial-gradient(
              circle,
              rgba(135, 173, 255, 0.2),
              rgba(78, 112, 223, 0.08) 35%,
              transparent 70%
            );
          filter: blur(18px);
          mix-blend-mode: screen;
        }

        .project-demo-unavailable {
          min-height: 48px;
          padding: 8px 18px;

          display: inline-flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 5px;

          color: #8f9cb4;

          border: 1px solid
            rgba(
              108,
              145,
              218,
              0.18
            );

          background:
            linear-gradient(
              135deg,
              rgba(
                7,
                13,
                28,
                0.68
              ),
              rgba(
                4,
                9,
                20,
                0.5
              )
            );

          font-family: inherit;
          text-align: left;
        }

        .project-demo-unavailable
          > span {
          color: #9eadc5;

          font-size: 8px;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: 0.14em;
        }

        .project-demo-unavailable
          > small {
          color: #65738a;

          font-size: 6px;
          font-weight: 600;
          line-height: 1.4;
          letter-spacing: 0.08em;
        }

        @media (max-width: 900px) {
          .project-demo-unavailable {
            width: fit-content;
            min-height: 48px;

            padding:
              9px
              17px;
          }
        }

        @media (max-width: 430px) {
          .project-demo-unavailable {
            width: 100%;
            min-height: 52px;

            align-items: center;

            text-align: center;
          }

          .project-demo-unavailable
            > span {
            font-size: 8px;
          }

          .project-demo-unavailable
            > small {
            font-size: 6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-experience-transition-flare {
            display: none;
          }
        }

        /* =======================================================
   PROJECT FLOATING SCREENSHOTS
======================================================= */

.project-floating-gallery {
  position: absolute;
  inset: 0;

  overflow: visible;
  pointer-events: none;

  z-index: 5;
}

.project-floating-image {
  position: absolute;

  width: clamp(215px, 19vw, 340px);

  margin: 0;

  pointer-events: none;

  animation:
    projectFloat 9s ease-in-out infinite;

  filter:
    drop-shadow(
      0 30px 55px rgba(0,0,0,.45)
    )
    drop-shadow(
      0 0 26px rgba(92,130,255,.14));

  will-change: transform;
}

.project-floating-image:nth-child(2){
    animation-duration:11s;
}

.project-floating-image:nth-child(3){
    animation-duration:13s;
}

.project-floating-image-1{
    left:-3%;
    top:-2%;
    transform:rotate(-7deg);
}

.project-floating-image-2{
    right:-4%;
    top:24%;
    transform:rotate(6deg);
}

.project-floating-image-3{
    left:16%;
    bottom:-6%;
    transform:rotate(-4deg);
}

.project-floating-image-frame {
  position: relative;

  width: 100%;

  overflow: hidden;

  border-radius: 22px;

  border: 1px solid
    rgba(115, 150, 230, 0.22);

  background:
    linear-gradient(
      145deg,
      rgba(10, 18, 35, 0.96),
      rgba(5, 10, 20, 0.97)
    );

  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.38),
    inset 0 0 50px rgba(84, 118, 230, 0.05);
}

.project-floating-image-content {
  display: block;

  width: 100%;
  height: auto;

  object-fit: contain;

  user-select: none;
  -webkit-user-drag: none;
}

.project-floating-image figcaption{

    margin-top:10px;

    padding:10px 13px;

    display:flex;
    flex-direction:column;
    gap:5px;

    border-radius:12px;

    border:1px solid
        rgba(112,149,225,.14);

    background:
        rgba(6,10,22,.84);

    backdrop-filter:blur(18px);
}

.project-floating-image figcaption span{

    color:#7085aa;

    font-size:5px;

    font-weight:800;

    letter-spacing:.18em;
}

.project-floating-image figcaption small{

    color:#d2ddf6;

    font-size:7px;

    font-weight:600;

    line-height:1.45;
}

/* =======================================================
   FLOATING ANIMATION
======================================================= */

@keyframes projectFloat{

0%{
    transform:translateY(0px);
}

25%{
    transform:translateY(-12px);
}

50%{
    transform:translateY(5px);
}

75%{
    transform:translateY(-8px);
}

100%{
    transform:translateY(0px);
}

}

/* =======================================================
   MEDIUM LAPTOPS
======================================================= */

@media (max-width:1180px){

.project-floating-image{

    width:clamp(190px,18vw,290px);
}

.project-floating-image-1{

    left:-4%;
    top:0%;
}

.project-floating-image-2{

    right:-5%;
    top:25%;
}

.project-floating-image-3{

    left:14%;
    bottom:-2%;
}

}

/* =======================================================
   MOBILE
======================================================= */

/* Hide floating screenshots on phones */

@media (max-width: 900px) {
  .project-floating-gallery {
    display: none;
  }
}

/* =======================================================
   SMALL PHONES
======================================================= */

@media (max-width:480px){

.project-floating-image{

    width:88vw;

    flex-basis:88vw;
}

.project-floating-gallery{

    padding:12px;

    gap:12px;
}

      }
/* =======================================================
   PROJECT-SPECIFIC SCREENSHOT LAYOUT FIXES
   Q-ADAPT + SONIC BREEZE ONLY
======================================================= */

/* -------------------------------
   Q-ADAPT
-------------------------------- */

.project-experience-quantum
  .project-floating-image {
  width: clamp(205px, 17vw, 305px);
}

.project-experience-quantum
  .project-floating-image-1 {
  left: -6%;
  top: -4%;
}

.project-experience-quantum
  .project-floating-image-2 {
  right: -7%;
  top: 7%;
}

.project-experience-quantum
  .project-floating-image-3 {
  left: 6%;
  bottom: -9%;
}

/*
 * Bring captions above neighbouring cards
 * so text is never visually cut off.
 */

.project-experience-quantum
  .project-floating-image
  figcaption {
  position: relative;
  z-index: 12;
}

/* -------------------------------
   SONIC BREEZE
-------------------------------- */

.project-experience-sound
  .project-floating-image {
  width: clamp(185px, 15vw, 270px);
}

.project-experience-sound
  .project-floating-image-1 {
  left: -4%;
  top: -7%;
  z-index: 5;
}

.project-experience-sound
  .project-floating-image-2 {
  right: -5%;
  top: 10%;
  z-index: 4;
}

.project-experience-sound
  .project-floating-image-3 {
  left: 23%;
  bottom: -4%;
  z-index: 8;
}

/*
 * The third image is landscape, so it can
 * remain wider without colliding with the
 * portrait screenshots.
 */

.project-experience-sound
  .project-floating-image-3 {
  width: clamp(220px, 20vw, 350px);
}

.project-experience-sound
  .project-floating-image
  figcaption {
  position: relative;
  z-index: 12;
}

/* =======================================================
   SHORT DESKTOP / LAPTOP SCREENS
======================================================= */

@media (max-height: 820px) and (min-width: 901px) {
  .project-experience-quantum
    .project-floating-image {
    width: clamp(180px, 15vw, 260px);
  }

  .project-experience-quantum
    .project-floating-image-1 {
    left: -5%;
    top: -6%;
  }

  .project-experience-quantum
    .project-floating-image-2 {
    right: -6%;
    top: 5%;
  }

  .project-experience-quantum
    .project-floating-image-3 {
    left: 8%;
    bottom: -12%;
  }

  .project-experience-sound
    .project-floating-image {
    width: clamp(165px, 13.5vw, 235px);
  }

  .project-experience-sound
    .project-floating-image-1 {
    left: -5%;
    top: -9%;
  }

  .project-experience-sound
    .project-floating-image-2 {
    right: -6%;
    top: 7%;
  }

  .project-experience-sound
    .project-floating-image-3 {
    left: 22%;
    bottom: -6%;

    width: clamp(200px, 18vw, 310px);
  }
}

/* =======================================================
   PHONES — SCREENSHOTS ALREADY HIDDEN
======================================================= */

@media (max-width: 900px) {
  .project-experience-quantum
    .project-floating-gallery,
  .project-experience-sound
    .project-floating-gallery {
    display: none;
  }
}

      `}</style>
    </>
  );
}
