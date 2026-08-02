"use client";

import { visibleProjects } from "@/data/projects";
import { usePerformance } from "@/components/UI/PerformanceManager";
import { useUniverse } from "@/components/UI/UniverseContext";
import {
  AnimatePresence,
  motion,
  type PanInfo,
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
} from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

const AUTOPLAY_DELAY = 7200;
const SWIPE_THRESHOLD = 65;

function wrapIndex(index: number) {
  const total = visibleProjects.length;
  return ((index % total) + total) % total;
}

function getTitleClass(title: string) {
  if (title.length >= 24) {
    return "project-title project-title-long";
  }

  if (title.length >= 16) {
    return "project-title project-title-medium";
  }

  return "project-title project-title-short";
}
function renderProjectTitle(
  projectId: string,
  title: string,
) {
  switch (projectId) {
    case "snowman-ai":
      return (
        <>
          SNOWMAN
          <br />
          AI
        </>
      );

    case "face-emotion-recognition":
      return (
        <>
          FACE
          <br />
          EMOTION
          <br />
          RECOGNITION
        </>
      );

    case "community-events":
      return (
        <>
          COMMUNITY
          <br />
          EVENTS
        </>
      );

    default:
      return title;
  }
}
export default function ProjectCarousel() {
  const { openProject } = useUniverse();

  const {
    reducedMotion,
    isPageVisible,
  } = usePerformance();

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] =
    useState<1 | -1>(1);
  const [isPaused, setIsPaused] =
    useState(false);
  const [hasInteracted, setHasInteracted] =
    useState(false);
  const [logoFailed, setLogoFailed] =
    useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const autoplayTimerRef =
    useRef<number | null>(null);

  const activeProject =
    visibleProjects[activeIndex];

  const previousProject =
    visibleProjects[
      wrapIndex(activeIndex - 1)
    ];

  const nextProject =
    visibleProjects[
      wrapIndex(activeIndex + 1)
    ];

  const projectLogoMap = useMemo(
    () => ({
      "q-adapt":
        "/images/project-logos/q-adapt.png",
      "snowman-ai":
        "/images/project-logos/snowman-ai.png",
      "face-emotion-recognition":
        "/images/project-logos/emotion-ai.png",
      "community-events":
        "/images/project-logos/community-events.png",
      "block-ninja":
        "/images/project-logos/block-ninja.png",
      "sonic-air":
        "/images/project-logos/sonic-air.png",
      weatherx:
        "/images/project-logos/weatherx.png",
    }),
    [],
  );
const [
  isCarouselVisible,
  setIsCarouselVisible,
] = useState(false);
const [
  isTransitioning,
  setIsTransitioning,
] = useState(false);
  const changeProject = useCallback(
  (
    nextIndex: number,
    nextDirection: 1 | -1,
  ) => {
    if (isTransitioning) {
      return;
    }

    setIsTransitioning(true);
    setDirection(nextDirection);
    setActiveIndex(wrapIndex(nextIndex));
    setHasInteracted(true);
    setLogoFailed(false);

    window.setTimeout(() => {
      setIsTransitioning(false);
    }, reducedMotion ? 280 : 760);
  },
  [
    isTransitioning,
    reducedMotion,
  ],
);

  const showNextProject = useCallback(() => {
    changeProject(activeIndex + 1, 1);
  }, [activeIndex, changeProject]);

  const showPreviousProject =
    useCallback(() => {
      changeProject(activeIndex - 1, -1);
    }, [activeIndex, changeProject]);

  const handleOpenProject = useCallback(
    (
      event: ReactMouseEvent<HTMLButtonElement>,
    ) => {
      const cardElement =
        event.currentTarget.closest(
          ".project-carousel-card",
        ) as HTMLElement | null;

      const sourceElement =
        cardElement ?? event.currentTarget;

      const rectangle =
        sourceElement.getBoundingClientRect();

      openProject(activeProject.id, {
        source: "carousel",
        originRect: {
          top: rectangle.top,
          left: rectangle.left,
          width: rectangle.width,
          height: rectangle.height,
        },
      });
    },
    [activeProject.id, openProject],
  );
useEffect(() => {
  const section = sectionRef.current;

  if (!section) {
    return;
  }

  const observer =
    new IntersectionObserver(
      ([entry]) => {
        setIsCarouselVisible(
          entry.isIntersecting &&
            entry.intersectionRatio > 0.18,
        );
      },
      {
        threshold: [
          0,
          0.18,
          0.45,
        ],
        rootMargin:
          "100px 0px 100px 0px",
      },
    );

  observer.observe(section);

  return () => {
    observer.disconnect();
  };
}, []);
  useEffect(() => {
    if (
  isPaused ||
  reducedMotion ||
  !isPageVisible ||
  !isCarouselVisible ||
  isTransitioning ||
  visibleProjects.length <= 1
) {
  return;
}

    autoplayTimerRef.current =
      window.setTimeout(() => {
        setDirection(1);
        setActiveIndex((currentIndex) =>
          wrapIndex(currentIndex + 1),
        );
        setLogoFailed(false);
      }, AUTOPLAY_DELAY);

    return () => {
      if (
        autoplayTimerRef.current !== null
      ) {
        window.clearTimeout(
          autoplayTimerRef.current,
        );

        autoplayTimerRef.current = null;
      }
    };
  }, [
  activeIndex,
  isPaused,
  reducedMotion,
  isPageVisible,
  isCarouselVisible,
  isTransitioning,
]);
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const rectangle =
        section.getBoundingClientRect();

      const sectionIsActive =
        rectangle.top <
          window.innerHeight * 0.55 &&
        rectangle.bottom >
          window.innerHeight * 0.45;

      if (!sectionIsActive) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousProject();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextProject();
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
    showPreviousProject,
    showNextProject,
  ]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (
      Math.abs(info.offset.x) <
      SWIPE_THRESHOLD
    ) {
      return;
    }

    if (info.offset.x < 0) {
      showNextProject();
    } else {
      showPreviousProject();
    }
  };

  const transitionVariants = reducedMotion
  ? {
      enter: {
        opacity: 0,
      },

      center: {
        opacity: 1,
      },

      exit: {
        opacity: 0,
      },
    }
  : {
      enter: (
        slideDirection: number,
      ) => ({
        opacity: 0,
        rotateY:
          slideDirection > 0
            ? 34
            : -34,
        x:
          slideDirection > 0
            ? "16%"
            : "-16%",
        scale: 0.94,
      }),

      center: {
        opacity: 1,
        rotateY: 0,
        x: 0,
        scale: 1,
      },

      exit: (
        slideDirection: number,
      ) => ({
        opacity: 0,
        rotateY:
          slideDirection > 0
            ? -34
            : 34,
        x:
          slideDirection > 0
            ? "-16%"
            : "16%",
        scale: 0.94,
      }),
    };

  return (
    <>
      <section
        ref={sectionRef}
        id="projects"
        className="project-carousel-section"
      >
        <div className="project-carousel-background">
          <div className="project-carousel-grid" />
          <div className="project-carousel-glow" />
        </div>

        <header className="project-carousel-header">
  <div>
    <p>02</p>

    <h2>
      SELECTED
      <span> SYSTEMS.</span>
    </h2>
  </div>

          <div className="project-carousel-counter">
            <strong>
              {String(
                activeIndex + 1,
              ).padStart(2, "0")}
            </strong>

            <span>/</span>

            <small>
              {String(
                visibleProjects.length,
              ).padStart(2, "0")}
            </small>
          </div>
        </header>

        <div className="project-carousel-stage">
          <button
  type="button"
  className="project-carousel-arrow project-carousel-arrow-left"
  onClick={showPreviousProject}
  disabled={isTransitioning}
  aria-label="Show previous project"
>
  <ArrowLeft size={21} />
</button>

          <button
  type="button"
  className="project-carousel-preview project-carousel-preview-left"
  onClick={showPreviousProject}
  disabled={isTransitioning}
  aria-label={`Show ${previousProject.title}`}
>
  <span>
    {previousProject.number}
  </span>

  <strong>
    {previousProject.shortTitle}
  </strong>
</button>

          <div className="project-carousel-perspective">
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              <motion.article
                key={activeProject.id}
                custom={direction}
                variants={
                  transitionVariants
                }
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: reducedMotion
                    ? 0.25
                    : 0.72,
                  ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                  ],
                }}
                drag={
                  reducedMotion
                    ? false
                    : "x"
                }
                dragConstraints={{
                  left: 0,
                  right: 0,
                }}
                dragElastic={0.1}
                onDragStart={() => {
                  setHasInteracted(true);
                }}
                onDragEnd={(event, info) => {
                  handleDragEnd(event, info);
                }}
                className={`project-carousel-card project-carousel-card-${activeProject.visual}`}
              >
                <button
                  type="button"
                  className="project-carousel-card-button"
                  onClick={handleOpenProject}
                  aria-label={`Open ${activeProject.title} details`}
                >
                  <div className="project-carousel-visual">
                    <div className="project-carousel-visual-grid" />

                    <span className="project-carousel-node">
                      NODE 
                      {activeProject.number}
                    </span>

                    <div className="project-carousel-logo-shell">
                      {!logoFailed ? (
                        <Image
                          src={
                            projectLogoMap[
                              activeProject.id
                            ]
                          }
                          alt={`${activeProject.title} project logo`}
                          fill
                          priority={
                            activeIndex === 0
                          }
                          sizes="(max-width: 720px) 38vw, (max-width: 1100px) 28vw, 20vw"
                          className="project-carousel-logo"
                          onError={() =>
                            setLogoFailed(
                              true,
                            )
                          }
                        />
                      ) : (
                        <span className="project-logo-fallback">
                          {activeProject.shortTitle
                            .split(" ")
                            .map(
                              (word) =>
                                word[0],
                            )
                            .join("")
                            .slice(0, 3)}
                        </span>
                      )}
                    </div>

                    <span className="project-carousel-visual-status">
                      {
                        activeProject.status
                      }
                    </span>
                  </div>

                  <div className="project-carousel-copy">
                    <div className="project-copy-top">
                      <div className="project-carousel-status-row">
                        <span className="project-status-dot" />

                        <span>
                          {
                            activeProject.status
                          }
                        </span>
                      </div>

                      <p className="project-carousel-category">
                        {
                          activeProject.category
                        }
                      </p>

                      <h3
  className={getTitleClass(
    activeProject.title,
  )}
>
  {renderProjectTitle(
    activeProject.id,
    activeProject.title,
  )}
</h3>

                      <p className="project-carousel-summary">
                        {
                          activeProject.summary
                        }
                      </p>

                      <div className="project-carousel-technologies">
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
                    </div>

                    <div className="project-carousel-open">
                      VIEW SYSTEM
                      <ArrowUpRight
                        size={18}
                      />
                    </div>
                  </div>
                </button>
              </motion.article>
            </AnimatePresence>
          </div>

         <button
  type="button"
  className="project-carousel-preview project-carousel-preview-right"
  onClick={showNextProject}
  disabled={isTransitioning}
  aria-label={`Show ${nextProject.title}`}
>
  <span>
    {nextProject.number}
  </span>

  <strong>
    {nextProject.shortTitle}
  </strong>
</button>

         <button
  type="button"
  className="project-carousel-arrow project-carousel-arrow-right"
  onClick={showNextProject}
  disabled={isTransitioning}
  aria-label="Show next project"
>
  <ArrowRight size={21} />
</button>
        </div>

        <div className="project-carousel-footer">
         <div className="project-carousel-dots">
  {visibleProjects.map(
    (project, index) => (
      <button
        key={project.id}
        type="button"
        disabled={
          isTransitioning ||
          index === activeIndex
        }
        className={
          index === activeIndex
            ? "active"
            : ""
        }
        onClick={() => {
          const nextDirection: 1 | -1 =
            index > activeIndex
              ? 1
              : -1;

          changeProject(
            index,
            nextDirection,
          );
        }}
        aria-label={`Show ${project.title}`}
        aria-current={
          index === activeIndex
            ? "true"
            : undefined
        }
      >
        <span />
      </button>
    ),
  )}
</div>

          <button
            type="button"
            className="project-carousel-pause"
            onClick={() =>
              setIsPaused(
                (current) => !current,
              )
            }
          >
            {isPaused ? (
              <>
                <Play size={13} />
                RESUME AUTO CYCLE
              </>
            ) : (
              <>
                <Pause size={13} />
                PAUSE AUTO CYCLE
              </>
            )}
          </button>

          <div className="project-carousel-hint">
            DRAG OR USE ← →
            {hasInteracted && (
  <span>
    {" "}
    // MANUAL CONTROL
  </span>
)}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .project-carousel-section {
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 720px;
          padding: clamp(52px, 7vh, 78px)
            clamp(20px, 3vw, 46px)
            clamp(22px, 4vh, 36px);
          display: grid;
          grid-template-rows:
            auto
            minmax(0, 1fr)
            auto;
          gap: clamp(14px, 2vh, 22px);
          overflow: hidden;
          isolation: isolate;
          color: #f4f7ff;
          border-top: 1px solid
            rgba(112, 149, 226, 0.14);
          border-bottom: 1px solid
            rgba(112, 149, 226, 0.14);
          background:
            radial-gradient(
              circle at 72% 42%,
              rgba(55, 89, 199, 0.14),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #030611,
              #050a18 58%,
              #02040a
            );
        }

        .project-carousel-background {
          position: absolute;
          inset: 0;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
        }

        .project-carousel-grid {
          position: absolute;
          inset: 0;
          opacity: 0.3;
          background-image:
            linear-gradient(
              rgba(105, 142, 218, 0.055)
                1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(105, 142, 218, 0.055)
                1px,
              transparent 1px
            );
          background-size: 46px 46px;
        }

        .project-carousel-glow {
          position: absolute;
          width: min(70vw, 900px);
          aspect-ratio: 1;
          right: -18%;
          top: 5%;
          border-radius: 50%;
          border: 1px solid
            rgba(105, 142, 255, 0.08);
          box-shadow:
            0 0 130px
              rgba(68, 94, 215, 0.09),
            inset 0 0 100px
              rgba(79, 113, 226, 0.035);
        }

        .project-carousel-header {
          position: relative;
          z-index: 4;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }

        .project-carousel-header p {
          margin: 0 0 9px;
          color: #607391;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .project-carousel-header h2 {
          margin: 0;
          font-size: clamp(
            34px,
            4vw,
            62px
          );
          font-weight: 500;
          line-height: 0.92;
          letter-spacing: -0.055em;
        }

        .project-carousel-header h2 span {
          color: transparent;
          -webkit-text-stroke: 1px
            rgba(134, 164, 226, 0.58);
        }

        .project-carousel-counter {
          display: flex;
          align-items: baseline;
          gap: 8px;
          color: #53627b;
          font-size: 11px;
          letter-spacing: 0.13em;
        }

        .project-carousel-counter strong {
          color: #e9efff;
          font-size: clamp(
            23px,
            2.2vw,
            30px
          );
          font-weight: 500;
        }

        .project-carousel-stage {
          position: relative;
          min-height: 0;
          display: grid;
          grid-template-columns:
            54px
            minmax(86px, 0.16fr)
            minmax(0, 1fr)
            minmax(86px, 0.16fr)
            54px;
          align-items: center;
          gap: 12px;
        }

        .project-carousel-perspective {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0;
          perspective: 1500px;
          transform-style: preserve-3d;
        }

        .project-carousel-card {
  position: absolute;
  inset: 0;
  transform-origin: center;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
  .project-carousel-arrow:disabled,
.project-carousel-preview:disabled,
.project-carousel-dots button:disabled {
  pointer-events: none;
}

.project-carousel-arrow:disabled {
  opacity: 0.62;
}

        .project-carousel-card-button {
          width: 100%;
          height: 100%;
          min-height: 0;
          padding: 0;
          display: grid;
          grid-template-columns:
            minmax(250px, 42%)
            minmax(0, 58%);
          overflow: hidden;
          color: inherit;
          text-align: left;
          border: 1px solid
            rgba(113, 151, 226, 0.18);
          background:
            linear-gradient(
              135deg,
              rgba(8, 14, 31, 0.97),
              rgba(4, 8, 20, 0.92)
            );
          box-shadow:
            0 24px 72px
              rgba(0, 0, 0, 0.28),
            inset 0 0 70px
              rgba(73, 104, 205, 0.025);
          cursor: pointer;
        }
.project-carousel-arrow:disabled,
.project-carousel-preview:disabled,
.project-carousel-dots button:disabled {
  pointer-events: none;
  cursor: default;
}

.project-carousel-arrow:disabled,
.project-carousel-preview:disabled {
  opacity: 0.58;
}

.project-carousel-dots
  button.active:disabled {
  opacity: 1;
}
        .project-carousel-visual {
          position: relative;
          min-width: 0;
          min-height: 0;
          overflow: hidden;
          display: grid;
          place-items: center;
          border-right: 1px solid
            rgba(113, 151, 226, 0.14);
          background:
            radial-gradient(
              circle at 50% 44%,
              rgba(64, 101, 224, 0.17),
              rgba(9, 15, 34, 0.58)
                42%,
              rgba(3, 7, 17, 0.95)
                78%
            );
        }

        .project-carousel-visual::before,
        .project-carousel-visual::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          border: 1px solid
            rgba(115, 153, 238, 0.11);
          pointer-events: none;
        }

        .project-carousel-visual::before {
          width: 66%;
          aspect-ratio: 1;
        }

        .project-carousel-visual::after {
          width: 46%;
          aspect-ratio: 1;
          border-style: dashed;
        }

        .project-carousel-visual-grid {
          position: absolute;
          inset: 0;
          opacity: 0.24;
          background-image:
            linear-gradient(
              rgba(112, 149, 225, 0.07)
                1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(112, 149, 225, 0.07)
                1px,
              transparent 1px
            );
          background-size: 34px 34px;
        }

        .project-carousel-logo-shell {
  position: relative;
  z-index: 2;
  width: min(48%, 210px);
  aspect-ratio: 1;

  border-radius: 26px;
  overflow: hidden;

  filter: drop-shadow(
    0 0 24px rgba(89,129,255,.2)
  );
}

        .project-carousel-logo {
  object-fit: contain;
  border-radius: 26px;

  user-select: none;
  -webkit-user-drag: none;
}

        .project-logo-fallback {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          color: #9ab3ff;
          border: 1px solid
            rgba(126, 164, 255, 0.25);
          border-radius: 50%;
          background: rgba(
            60,
            91,
            178,
            0.08
          );
          font-size: clamp(
            24px,
            4vw,
            54px
          );
          font-weight: 600;
          letter-spacing: 0.08em;
        }

        .project-carousel-node,
        .project-carousel-visual-status {
          position: absolute;
          z-index: 3;
          padding: 7px 9px;
          color: #657896;
          border: 1px solid
            rgba(112, 149, 225, 0.13);
          background: rgba(
            4,
            9,
            22,
            0.82
          );
          font-size: 5px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .project-carousel-node {
          left: 20px;
          top: 20px;
        }

        .project-carousel-visual-status {
          left: 20px;
          right: 20px;
          bottom: 20px;
          overflow: hidden;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .project-carousel-copy {
          min-width: 0;
          min-height: 0;
          padding: clamp(
            26px,
            3vw,
            48px
          );
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .project-copy-top {
          min-height: 0;
        }

        .project-carousel-status-row {
          margin-bottom: clamp(
            12px,
            1.7vh,
            18px
          );
          display: flex;
          align-items: center;
          gap: 8px;
          color: #7384a2;
          font-size: 5px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .project-status-dot {
          width: 5px;
          height: 5px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #5cffb0;
          box-shadow: 0 0 9px
            rgba(92, 255, 176, 0.8);
        }

        .project-carousel-category {
          margin: 0 0 clamp(
              11px,
              1.5vh,
              17px
            );
          color: #7087b0;
          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .project-title {
          margin: 0;
          max-width: 100%;
          font-weight: 500;
          line-height: 0.9;
          letter-spacing: -0.058em;
          overflow-wrap: normal;
          word-break: normal;
          text-wrap: balance;
        }

        .project-title-short {
          font-size: clamp(
            42px,
            5vw,
            78px
          );
        }

        .project-title-medium {
          font-size: clamp(
            35px,
            4.2vw,
            65px
          );
        }

        .project-title-long {
          font-size: clamp(
            29px,
            3.35vw,
            51px
          );
          line-height: 0.94;
        }

        .project-carousel-summary {
          max-width: 570px;
          margin: clamp(
              16px,
              2.2vh,
              24px
            )
            0 0;
          color: #8290a8;
          font-size: clamp(
            10px,
            0.9vw,
            13px
          );
          line-height: 1.75;
        }

        .project-carousel-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: clamp(
            16px,
            2.1vh,
            24px
          );
        }

        .project-carousel-technologies
          span {
          min-height: 27px;
          padding: 0 9px;
          display: inline-flex;
          align-items: center;
          color: #71819b;
          border: 1px solid
            rgba(111, 148, 219, 0.14);
          background: rgba(
            7,
            12,
            26,
            0.52
          );
          font-size: 5px;
          font-weight: 800;
          letter-spacing: 0.11em;
        }

        .project-carousel-open {
          margin-top: auto;
          padding-top: clamp(
            16px,
            2vh,
            24px
          );
          display: flex;
          align-items: center;
          gap: 10px;
          color: #dce6fa;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.17em;
          transition:
            transform 0.18s ease,
            color 0.18s ease;
        }

        .project-carousel-card-button:hover
          .project-carousel-open {
          color: #ffffff;
          transform: translateX(5px);
        }

        .project-carousel-arrow {
          width: 50px;
          height: 68px;
          padding: 0;
          display: grid;
          place-items: center;
          color: #6f82a3;
          border: 1px solid
            rgba(112, 149, 225, 0.16);
          background: rgba(
            5,
            10,
            23,
            0.74
          );
          cursor: pointer;
        }

        .project-carousel-arrow:hover {
          color: white;
          border-color: rgba(
            123,
            167,
            255,
            0.5
          );
          background: rgba(
            78,
            112,
            202,
            0.08
          );
        }

        .project-carousel-preview {
          min-width: 0;
          height: 40%;
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 9px;
          overflow: hidden;
          color: #56647c;
          border: 1px solid
            rgba(112, 149, 225, 0.1);
          background: rgba(
            5,
            10,
            23,
            0.46
          );
          cursor: pointer;
        }

        .project-carousel-preview span {
          font-size: 5px;
          letter-spacing: 0.14em;
        }

        .project-carousel-preview strong {
          overflow: hidden;
          font-size: 6px;
          letter-spacing: 0.09em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .project-carousel-preview-left {
          align-items: flex-end;
          text-align: right;
        }

        .project-carousel-preview-right {
          align-items: flex-start;
          text-align: left;
        }

        .project-carousel-footer {
          position: relative;
          z-index: 4;
          min-height: 34px;
          display: grid;
          grid-template-columns:
            1fr auto 1fr;
          align-items: center;
          gap: 18px;
        }

        .project-carousel-dots {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .project-carousel-dots button {
          width: 24px;
          height: 18px;
          padding: 0;
          display: grid;
          place-items: center;
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .project-carousel-dots
          button
          span {
          width: 100%;
          height: 1px;
          background: rgba(
            113,
            149,
            220,
            0.2
          );
        }

        .project-carousel-dots
          button.active
          span {
          background: #86a7ff;
          transform: scaleY(2);
          box-shadow: 0 0 8px
            rgba(111, 151, 255, 0.65);
        }

        .project-carousel-pause {
          min-height: 32px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #65758e;
          border: 1px solid
            rgba(112, 149, 225, 0.13);
          background: rgba(
            5,
            10,
            23,
            0.55
          );
          font-size: 5px;
          font-weight: 800;
          letter-spacing: 0.12em;
          cursor: pointer;
        }

        .project-carousel-hint {
          justify-self: end;
          color: #4f5c72;
          font-size: 5px;
          letter-spacing: 0.13em;
        }

        .project-carousel-hint span {
          color: #7588aa;
        }

        @media (max-width: 1180px) {
          .project-carousel-section {
            min-height: 680px;
            padding-inline: 24px;
          }

          .project-carousel-stage {
            grid-template-columns:
              46px
              minmax(0, 1fr)
              46px;
            gap: 10px;
          }

          .project-carousel-preview {
            display: none;
          }

          .project-carousel-card-button {
            grid-template-columns:
              minmax(215px, 38%)
              minmax(0, 62%);
          }

          .project-carousel-copy {
            padding: 30px;
          }

          .project-title-short {
            font-size: clamp(
              40px,
              5.7vw,
              67px
            );
          }

          .project-title-medium {
            font-size: clamp(
              34px,
              4.8vw,
              56px
            );
          }

          .project-title-long {
            font-size: clamp(
              27px,
              3.9vw,
              45px
            );
          }
        }

        @media (max-width: 820px) {
          .project-carousel-section {
            height: auto;
            min-height: 100svh;
            padding: 72px 16px 24px;
            grid-template-rows:
              auto auto auto;
          }

          .project-carousel-header {
            align-items: flex-start;
          }

          .project-carousel-header h2 {
            font-size: clamp(
              31px,
              8vw,
              44px
            );
          }

          .project-carousel-header
            h2
            span {
            display: block;
          }

          .project-carousel-stage {
            min-height: 610px;
            grid-template-columns:
              38px
              minmax(0, 1fr)
              38px;
            gap: 7px;
          }

          .project-carousel-arrow {
            width: 38px;
            height: 56px;
          }

          .project-carousel-perspective {
            height: 610px;
          }

          .project-carousel-card-button {
            grid-template-columns: 1fr;
            grid-template-rows:
              minmax(210px, 42%)
              minmax(0, 58%);
          }

          .project-carousel-visual {
            border-right: 0;
            border-bottom: 1px solid
              rgba(
                113,
                151,
                226,
                0.14
              );
          }

          .project-carousel-logo-shell {
            width: min(31%, 125px);
          }

          .project-carousel-copy {
            padding: 20px;
          }

          .project-carousel-status-row {
            margin-bottom: 10px;
          }

          .project-carousel-category {
            margin-bottom: 10px;
          }

          .project-title-short {
            font-size: clamp(
              37px,
              11vw,
              53px
            );
          }

          .project-title-medium {
            font-size: clamp(
              31px,
              9vw,
              45px
            );
          }

          .project-title-long {
            font-size: clamp(
              25px,
              7.3vw,
              37px
            );
          }

          .project-carousel-summary {
            margin-top: 13px;
            font-size: 10px;
            line-height: 1.6;
          }

          .project-carousel-technologies {
            margin-top: 13px;
          }

          .project-carousel-technologies
            span {
            min-height: 23px;
            padding: 0 7px;
          }

          .project-carousel-open {
            padding-top: 13px;
          }

          .project-carousel-visual-status {
            left: 12px;
            right: 12px;
            bottom: 12px;
          }

          .project-carousel-node {
            left: 12px;
            top: 12px;
          }

          .project-carousel-footer {
            grid-template-columns: 1fr;
          }

          .project-carousel-pause,
          .project-carousel-hint {
            display: none;
          }

          .project-carousel-dots {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .project-carousel-section {
            padding-inline: 10px;
          }

          .project-carousel-stage {
            min-height: 580px;
            grid-template-columns:
              32px
              minmax(0, 1fr)
              32px;
            gap: 5px;
          }

          .project-carousel-arrow {
            width: 32px;
            height: 50px;
          }

          .project-carousel-perspective {
            height: 580px;
          }

          .project-carousel-card-button {
            grid-template-rows:
              205px
              minmax(0, 1fr);
          }

          .project-carousel-copy {
            padding: 17px 15px;
          }

          .project-carousel-status-row {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .project-title-long {
            font-size: clamp(
              23px,
              7.5vw,
              31px
            );
          }
        }

        @media (max-height: 760px) and (min-width: 821px) {
          .project-carousel-section {
            min-height: 640px;
            padding-top: 42px;
            padding-bottom: 20px;
          }

          .project-carousel-header h2 {
            font-size: clamp(
              32px,
              3.5vw,
              52px
            );
          }

          .project-carousel-copy {
            padding-top: 24px;
            padding-bottom: 24px;
          }

          .project-carousel-summary {
            line-height: 1.55;
          }

          .project-carousel-technologies {
            margin-top: 14px;
          }

          .project-carousel-open {
            padding-top: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-carousel-card,
          .project-carousel-open {
            transition: none !important;
          }
        }
          /* ==========================================
   PROJECT TITLE WRAPPING CORRECTIONS
========================================== */

.project-title {
  word-break: keep-all !important;
  overflow-wrap: normal !important;
  hyphens: none !important;
}

/* SNOWMAN AI */

.project-carousel-card-brain
  .project-title {
  max-width: 100%;

  font-size: clamp(
    40px,
    4.55vw,
    70px
  );

  line-height: 0.88;
}

/* FACE EMOTION RECOGNITION */

.project-carousel-card-face
  .project-title {
  max-width: 100%;

  font-size: clamp(
    30px,
    3.35vw,
    52px
  );

  line-height: 0.89;
  letter-spacing: -0.052em;
}

/* COMMUNITY EVENTS */

.project-carousel-card-city
  .project-title {
  max-width: 100%;

  font-size: clamp(
    35px,
    4vw,
    62px
  );

  line-height: 0.9;
}
  @media (max-width: 820px) {
  .project-carousel-card-brain
    .project-title {
    font-size: clamp(
      34px,
      10vw,
      48px
    );
  }

  .project-carousel-card-face
    .project-title {
    font-size: clamp(
      25px,
      7.2vw,
      36px
    );

    line-height: 0.92;
  }

  .project-carousel-card-city
    .project-title {
    font-size: clamp(
      30px,
      8.8vw,
      43px
    );
  }
}
      `}</style>
    </>
  );
}
