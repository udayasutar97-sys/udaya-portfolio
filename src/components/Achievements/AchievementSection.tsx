"use client";

import {
  achievements,
  type Achievement,
} from "@/data/achievements";
import {
  AnimatePresence,
  motion,
  type PanInfo,
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bike,
  BookOpen,
  BrainCircuit,
  Code2,
  GraduationCap,
  Medal,
  Palette,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";

const SWIPE_THRESHOLD = 65;

type Direction = 1 | -1;

function wrapIndex(index: number) {
  const total = achievements.length;

  return ((index % total) + total) % total;
}

function getAchievementIcon(
  achievement: Achievement,
): ComponentType<{ size?: number }> {
  switch (achievement.id) {
    case "uiux":
      return Palette;

    case "science":
      return Sparkles;

    case "computer":
      return Code2;

    case "rank":
      return GraduationCap;

    case "blackbelt":
      return ShieldCheck;

    case "state":
      return Medal;

    case "uci":
      return Bike;

    case "tourde":
      return Trophy;

    case "calc":
      return BookOpen;

    case "qc1":
    case "qc2":
    case "qc3":
      return BrainCircuit;

    case "cs50":
      return Code2;

    default:
      return Award;
  }
}

function getCategoryLabel(category: string) {
  const normalizedCategory =
    category.toLowerCase();

  if (
    normalizedCategory.includes("course")
  ) {
    return "UNIVERSITY COURSEWORK";
  }

  if (
    normalizedCategory.includes("sport") ||
    normalizedCategory.includes("cycling")
  ) {
    return "ATHLETIC RECORD";
  }

  if (
    normalizedCategory.includes("martial") ||
    normalizedCategory.includes("competition")
  ) {
    return "MARTIAL ARTS RECORD";
  }

  if (
    normalizedCategory.includes("academic")
  ) {
    return "ACADEMIC RECORD";
  }

  if (
    normalizedCategory.includes("design")
  ) {
    return "DESIGN RECORD";
  }

  if (
    normalizedCategory.includes("programming")
  ) {
    return "TECHNOLOGY RECORD";
  }

  return "ACHIEVEMENT RECORD";
}

function getRecordCode(
  achievement: Achievement,
  index: number,
) {
  const prefix = achievement.category
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();

  return `${prefix || "REC"}-${String(
    index + 1,
  ).padStart(3, "0")}`;
}

export default function AchievementSection() {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [direction, setDirection] =
    useState<Direction>(1);

  const [hasInteracted, setHasInteracted] =
    useState(false);

  const sectionRef =
    useRef<HTMLElement>(null);

  const activeAchievement =
    achievements[activeIndex];

  const previousAchievementIndex =
    wrapIndex(activeIndex - 1);

  const nextAchievementIndex =
    wrapIndex(activeIndex + 1);

  const previousAchievement =
    achievements[previousAchievementIndex];

  const nextAchievement =
    achievements[nextAchievementIndex];

  const ActiveIcon = useMemo(
    () =>
      getAchievementIcon(
        activeAchievement,
      ),
    [activeAchievement],
  );

  const changeAchievement = useCallback(
    (
      nextIndex: number,
      nextDirection: Direction,
    ) => {
      setDirection(nextDirection);
      setActiveIndex(
        wrapIndex(nextIndex),
      );
      setHasInteracted(true);
    },
    [],
  );

  const showNextAchievement =
    useCallback(() => {
      changeAchievement(
        activeIndex + 1,
        1,
      );
    }, [
      activeIndex,
      changeAchievement,
    ]);

  const showPreviousAchievement =
    useCallback(() => {
      changeAchievement(
        activeIndex - 1,
        -1,
      );
    }, [
      activeIndex,
      changeAchievement,
    ]);

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const section =
        sectionRef.current;

      if (!section) {
        return;
      }

      const bounds =
        section.getBoundingClientRect();

      const sectionIsActive =
        bounds.top <
          window.innerHeight * 0.55 &&
        bounds.bottom >
          window.innerHeight * 0.45;

      if (!sectionIsActive) {
        return;
      }

      if (
        event.key === "ArrowLeft"
      ) {
        event.preventDefault();
        showPreviousAchievement();
      }

      if (
        event.key === "ArrowRight"
      ) {
        event.preventDefault();
        showNextAchievement();
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
    showNextAchievement,
    showPreviousAchievement,
  ]);

  const handleDragEnd = (
    _:
      | MouseEvent
      | TouchEvent
      | PointerEvent,
    info: PanInfo,
  ) => {
    if (
      Math.abs(info.offset.x) <
      SWIPE_THRESHOLD
    ) {
      return;
    }

    if (info.offset.x < 0) {
      showNextAchievement();
    } else {
      showPreviousAchievement();
    }
  };

  const cardVariants = {
    enter: (
      slideDirection: number,
    ) => ({
      opacity: 0,
      x:
        slideDirection > 0
          ? "22%"
          : "-22%",
      rotateY:
        slideDirection > 0
          ? 38
          : -38,
      scale: 0.94,
    }),

    center: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
    },

    exit: (
      slideDirection: number,
    ) => ({
      opacity: 0,
      x:
        slideDirection > 0
          ? "-22%"
          : "22%",
      rotateY:
        slideDirection > 0
          ? -38
          : 38,
      scale: 0.94,
    }),
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="achievements"
        className="achievement-vault"
      >
        <div className="achievement-vault-background">
          <div className="achievement-vault-grid" />

          <div className="achievement-vault-glow achievement-vault-glow-one" />

          <div className="achievement-vault-glow achievement-vault-glow-two" />

          <div className="achievement-vault-orbit" />
        </div>

        <header className="achievement-vault-header">
          <div>
            <p className="achievement-vault-index">
              04 
            </p>

            <h2>
              ACHIEVEMENT
              <br />
              <span>VAULT.</span>
            </h2>

            <p className="achievement-vault-introduction">
              Academic, technical and
              athletic milestones built
              through curiosity, discipline
              and sustained performance.
            </p>
          </div>

          <div className="achievement-vault-count">
            <span>RECORDS LOADED</span>

            <div>
              <strong>
                {String(
                  activeIndex + 1,
                ).padStart(2, "0")}
              </strong>

              <small>
                /{" "}
                {String(
                  achievements.length,
                ).padStart(2, "0")}
              </small>
            </div>
          </div>
        </header>

        <div className="achievement-vault-interface">
          <aside className="achievement-record-list">
            <div className="achievement-record-list-heading">
              <span>ARCHIVE INDEX</span>

              <small>
                {achievements.length} RECORDS
              </small>
            </div>

            <div className="achievement-record-list-scroll">
              {achievements.map(
                (
                  achievement,
                  index,
                ) => {
                  const ListIcon =
                    getAchievementIcon(
                      achievement,
                    );

                  const isActive =
                    index === activeIndex;

                  return (
                    <button
                      key={
                        achievement.id
                      }
                      type="button"
                      className={
                        isActive
                          ? "active"
                          : ""
                      }
                      onClick={() => {
                        if (
                          index ===
                          activeIndex
                        ) {
                          return;
                        }

                        changeAchievement(
                          index,
                          index >
                            activeIndex
                            ? 1
                            : -1,
                        );
                      }}
                      aria-label={`Open ${achievement.title}`}
                    >
                      <span className="achievement-list-number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <span className="achievement-list-icon">
                        <ListIcon
                          size={14}
                        />
                      </span>

                      <span className="achievement-list-copy">
                        <strong>
                          {
                            achievement.title
                          }
                        </strong>

                        <small>
                          {
                            achievement.category
                          }
                        </small>
                      </span>

                      <span className="achievement-list-line" />
                    </button>
                  );
                },
              )}
            </div>
          </aside>

          <div className="achievement-record-stage">
            <button
              type="button"
              className="achievement-navigation-arrow achievement-navigation-arrow-left"
              onClick={
                showPreviousAchievement
              }
              aria-label={`Show previous achievement: ${previousAchievement.title}`}
            >
              <ArrowLeft size={20} />
            </button>

            <button
              type="button"
              className="achievement-preview achievement-preview-left"
              onClick={
                showPreviousAchievement
              }
              aria-label={`Show ${previousAchievement.title}`}
            >
              <span className="achievement-preview-number">
                {String(
                  previousAchievementIndex +
                    1,
                ).padStart(2, "0")}
              </span>

              <span className="achievement-preview-copy">
                <small>
                  PREVIOUS RECORD
                </small>

                <strong>
                  {
                    previousAchievement.title
                  }
                </strong>
              </span>

              <span className="achievement-preview-line" />
            </button>

            <div className="achievement-record-perspective">
              <AnimatePresence
                initial={false}
                mode="popLayout"
                custom={direction}
              >
                <motion.article
                  key={
                    activeAchievement.id
                  }
                  className={`achievement-record-card achievement-record-${activeAchievement.accent}`}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.72,
                    ease: [
                      0.16,
                      1,
                      0.3,
                      1,
                    ],
                  }}
                  drag="x"
                  dragConstraints={{
                    left: 0,
                    right: 0,
                  }}
                  dragElastic={0.1}
                  onDragEnd={
                    handleDragEnd
                  }
                >
                  <div className="achievement-record-card-background">
                    <div className="achievement-record-card-grid" />

                    <div className="achievement-record-card-radar" />

                    <div className="achievement-record-card-scanline" />
                  </div>

                  <div className="achievement-record-topbar">
                    <div>
                      <span className="achievement-record-status-dot" />

                      ARCHIVE RECORD 
                    </div>

                    <span>
                      {getRecordCode(
                        activeAchievement,
                        activeIndex,
                      )}
                    </span>
                  </div>

                  <div className="achievement-record-main">
                    <div className="achievement-record-identity">
                      <div className="achievement-record-icon">
                        <ActiveIcon
                          size={34}
                        />
                      </div>

                      <div className="achievement-record-classification">
                        <span>
                          {getCategoryLabel(
                            activeAchievement.category,
                          )}
                        </span>

                        <small>
                          CLASSIFICATION 
                          {activeAchievement.category.toUpperCase()}
                        </small>
                      </div>
                    </div>

                    <div className="achievement-record-title-block">
                      <span className="achievement-record-number">
                        RECORD 
                        {String(
                          activeIndex + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <h3>
                        {
                          activeAchievement.title
                        }
                      </h3>

                      <p className="achievement-record-organization">
                        {
                          activeAchievement.organization
                        }
                      </p>
                    </div>

                    <div className="achievement-record-metric">
                      <span>
                        PRIMARY METRIC
                      </span>

                      <strong>
                        {
                          activeAchievement.metric
                        }
                      </strong>
                    </div>

                    <p className="achievement-record-description">
                      {
                        activeAchievement.description
                      }
                    </p>
                  </div>

                  <div className="achievement-record-footer">
                    <div>
                      <span>
                        CATEGORY
                      </span>

                      <strong>
                        {
                          activeAchievement.category
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        ORGANISATION
                      </span>

                      <strong>
                        {
                          activeAchievement.organization
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        STATUS
                      </span>

                      <strong>
                        RECORDED
                      </strong>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>

            <button
              type="button"
              className="achievement-preview achievement-preview-right"
              onClick={
                showNextAchievement
              }
              aria-label={`Show ${nextAchievement.title}`}
            >
              <span className="achievement-preview-number">
                {String(
                  nextAchievementIndex + 1,
                ).padStart(2, "0")}
              </span>

              <span className="achievement-preview-copy">
                <small>
                  NEXT RECORD
                </small>

                <strong>
                  {
                    nextAchievement.title
                  }
                </strong>
              </span>

              <span className="achievement-preview-line" />
            </button>

            <button
              type="button"
              className="achievement-navigation-arrow achievement-navigation-arrow-right"
              onClick={
                showNextAchievement
              }
              aria-label={`Show next achievement: ${nextAchievement.title}`}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <footer className="achievement-vault-footer">
          <div className="achievement-vault-progress">
            {achievements.map(
              (
                achievement,
                index,
              ) => (
                <button
                  key={
                    achievement.id
                  }
                  type="button"
                  className={
                    index ===
                    activeIndex
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    if (
                      index ===
                      activeIndex
                    ) {
                      return;
                    }

                    changeAchievement(
                      index,
                      index >
                        activeIndex
                        ? 1
                        : -1,
                    );
                  }}
                  aria-label={`Show ${achievement.title}`}
                >
                  <span />
                </button>
              ),
            )}
          </div>

          <div className="achievement-vault-controls">
            DRAG OR USE ← →
            {hasInteracted && (
              <span>
                {" "}
                
              </span>
            )}
          </div>
        </footer>
      </section>

      <style jsx global>{`
        .achievement-vault {
          position: relative;

          width: 100%;
          min-height: 100svh;

          padding:
            clamp(58px, 7vh, 84px)
            clamp(22px, 4vw, 62px)
            clamp(24px, 4vh, 42px);

          display: grid;
          grid-template-rows:
            auto
            minmax(0, 1fr)
            auto;

          gap: clamp(20px, 3vh, 32px);

          overflow: hidden;
          isolation: isolate;

          color: #f3f6ff;

          border-top: 1px solid
            rgba(109, 147, 223, 0.13);

          border-bottom: 1px solid
            rgba(109, 147, 223, 0.13);

          background:
            radial-gradient(
              circle at 68% 43%,
              rgba(57, 84, 177, 0.12),
              transparent 37%
            ),
            linear-gradient(
              135deg,
              #02050d,
              #050918 55%,
              #02040a
            );
        }

        .achievement-vault-background {
          position: absolute;
          inset: 0;
          z-index: -2;

          overflow: hidden;

          pointer-events: none;
        }

        .achievement-vault-grid {
          position: absolute;
          inset: 0;

          opacity: 0.27;

          background-image:
            linear-gradient(
              rgba(104, 139, 210, 0.055)
                1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(104, 139, 210, 0.055)
                1px,
              transparent 1px
            );

          background-size: 48px 48px;

          mask-image:
            linear-gradient(
              to bottom,
              transparent,
              black 12%,
              black 88%,
              transparent
            );
        }

        .achievement-vault-glow {
          position: absolute;

          border-radius: 50%;

          pointer-events: none;
        }

        .achievement-vault-glow-one {
          width: min(65vw, 900px);
          aspect-ratio: 1;

          right: -24%;
          top: -13%;

          border: 1px solid
            rgba(102, 139, 230, 0.07);

          box-shadow:
            0 0 160px
              rgba(51, 76, 168, 0.08),
            inset 0 0 120px
              rgba(75, 107, 205, 0.03);
        }

        .achievement-vault-glow-two {
          width: 330px;
          aspect-ratio: 1;

          left: 12%;
          bottom: -18%;

          background:
            radial-gradient(
              circle,
              rgba(75, 111, 222, 0.08),
              transparent 68%
            );
        }

        .achievement-vault-orbit {
          position: absolute;

          width: min(52vw, 730px);
          aspect-ratio: 1;

          right: 1%;
          top: 17%;

          border-radius: 50%;

          border: 1px dashed
            rgba(107, 143, 225, 0.055);

          transform:
            rotateX(67deg)
            rotateZ(-18deg);
        }

        .achievement-vault-header {
          position: relative;
          z-index: 4;

          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 32px;
        }

        .achievement-vault-index {
          margin: 0 0 11px;

          color: #5b6e8b;

          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.19em;
        }

        .achievement-vault-header h2 {
          margin: 0;

          font-size: clamp(
            40px,
            4.8vw,
            76px
          );

          font-weight: 500;
          line-height: 0.86;
          letter-spacing: -0.062em;
        }

        .achievement-vault-header h2 span {
          color: transparent;

          -webkit-text-stroke: 1px
            rgba(128, 158, 224, 0.65);
        }

        .achievement-vault-introduction {
          max-width: 540px;
          margin: 18px 0 0;

          color: #66748c;

          font-size: clamp(
            9px,
            0.78vw,
            12px
          );

          line-height: 1.75;
        }

        .achievement-vault-count {
          min-width: 130px;

          text-align: right;
        }

        .achievement-vault-count > span {
          display: block;

          margin-bottom: 9px;

          color: #53627a;

          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .achievement-vault-count div {
          display: flex;
          align-items: baseline;
          justify-content: flex-end;

          gap: 8px;
        }

        .achievement-vault-count strong {
          color: #e5ebfb;

          font-size: clamp(
            27px,
            2.5vw,
            38px
          );

          font-weight: 500;
        }

        .achievement-vault-count small {
          color: #526079;

          font-size: 10px;
        }

        .achievement-vault-interface {
          min-height: 0;

          display: grid;
          grid-template-columns:
            minmax(205px, 0.23fr)
            minmax(0, 1fr);

          gap: clamp(
            18px,
            2.5vw,
            34px
          );
        }

        .achievement-record-list {
          min-height: 0;

          overflow: hidden;

          border: 1px solid
            rgba(107, 143, 218, 0.12);

          background:
            rgba(5, 10, 22, 0.48);
        }

        .achievement-record-list-heading {
          min-height: 48px;
          padding: 0 16px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          border-bottom: 1px solid
            rgba(107, 143, 218, 0.12);

          color: #6b7d99;

          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .achievement-record-list-heading
          small {
          color: #3f4c62;

          font-size: 5px;
        }

        .achievement-record-list-scroll {
          height: calc(100% - 48px);
          max-height: 510px;

          overflow-y: auto;
          overscroll-behavior: contain;

          scrollbar-width: thin;

          scrollbar-color:
            rgba(106, 143, 226, 0.24)
            transparent;
        }

        .achievement-record-list-scroll
          button {
          position: relative;

          width: 100%;
          min-height: 62px;

          padding: 9px 13px;

          display: grid;
          grid-template-columns:
            25px
            31px
            minmax(0, 1fr);

          align-items: center;

          gap: 9px;

          overflow: hidden;

          color: #64738b;
          text-align: left;

          border: 0;
          border-bottom: 1px solid
            rgba(105, 140, 212, 0.09);

          background: transparent;

          cursor: pointer;

          transition:
            color 0.16s ease,
            background 0.16s ease;
        }

        .achievement-record-list-scroll
          button:hover {
          color: #a9b8d0;

          background:
            rgba(72, 105, 188, 0.045);
        }

        .achievement-record-list-scroll
          button.active {
          color: #f1f5ff;

          background:
            linear-gradient(
              90deg,
              rgba(73, 106, 202, 0.13),
              rgba(73, 106, 202, 0.02)
            );
        }

        .achievement-list-number {
          color: #3f4d65;

          font-size: 5px;
          letter-spacing: 0.11em;
        }

        .achievement-list-icon {
          width: 29px;
          height: 29px;

          display: grid;
          place-items: center;

          border: 1px solid
            rgba(109, 147, 225, 0.13);

          background:
            rgba(63, 95, 184, 0.035);
        }

        .achievement-record-list-scroll
          button.active
          .achievement-list-icon {
          color: #8eaaff;

          border-color:
            rgba(116, 158, 255, 0.32);

          background:
            rgba(81, 116, 212, 0.09);
        }

        .achievement-list-copy {
          min-width: 0;
        }

        .achievement-list-copy strong {
          display: block;

          overflow: hidden;

          font-size: 7px;
          font-weight: 750;
          letter-spacing: 0.08em;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .achievement-list-copy small {
          display: block;

          margin-top: 5px;

          overflow: hidden;

          color: #4c5a70;

          font-size: 5px;
          letter-spacing: 0.1em;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .achievement-list-line {
          position: absolute;

          left: 0;
          top: 0;
          bottom: 0;

          width: 2px;

          background: #718fff;

          opacity: 0;

          transition:
            opacity 0.16s ease;
        }

        .achievement-record-list-scroll
          button.active
          .achievement-list-line {
          opacity: 1;
        }

        /* =====================================
           STAGE AND SIDE NAVIGATION
        ===================================== */

        .achievement-record-stage {
          position: relative;

          width: 100%;
          min-width: 0;
          min-height: 0;
          height: 100%;

          display: grid;
          grid-template-columns:
            46px
            minmax(110px, 0.15fr)
            minmax(0, 1fr)
            minmax(110px, 0.15fr)
            46px;

          align-items: center;

          gap: clamp(
            9px,
            0.9vw,
            14px
          );
        }

        .achievement-navigation-arrow {
          position: relative;
          z-index: 4;

          width: 46px;
          height: 70px;
          padding: 0;

          display: grid;
          place-items: center;

          color: #7184a5;

          border: 1px solid
            rgba(110, 148, 224, 0.18);

          background:
            linear-gradient(
              145deg,
              rgba(9, 15, 31, 0.82),
              rgba(4, 8, 19, 0.72)
            );

          box-shadow:
            inset 0 0 24px
              rgba(72, 105, 205, 0.025);

          cursor: pointer;

          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .achievement-navigation-arrow::after {
          content: "";

          position: absolute;

          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: #8da8ff;

          opacity: 0;

          box-shadow:
            0 0 10px
              rgba(114, 151, 255, 0.9);

          transition:
            opacity 0.2s ease;
        }

        .achievement-navigation-arrow-left::after {
          right: 7px;
        }

        .achievement-navigation-arrow-right::after {
          left: 7px;
        }

        .achievement-navigation-arrow:hover {
          color: #ffffff;

          border-color:
            rgba(130, 171, 255, 0.46);

          background:
            linear-gradient(
              145deg,
              rgba(18, 29, 58, 0.9),
              rgba(6, 12, 28, 0.84)
            );

          box-shadow:
            0 0 24px
              rgba(74, 105, 198, 0.1),
            inset 0 0 26px
              rgba(80, 116, 220, 0.05);
        }

        .achievement-navigation-arrow:hover::after {
          opacity: 1;
        }

        .achievement-navigation-arrow-left:hover {
          transform:
            translateX(-3px);
        }

        .achievement-navigation-arrow-right:hover {
          transform:
            translateX(3px);
        }

        .achievement-preview {
          position: relative;

          width: 100%;
          min-width: 0;

          height: clamp(
            142px,
            26vh,
            220px
          );

          padding: 16px 13px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          gap: 14px;

          overflow: hidden;

          color: #667895;

          border: 1px solid
            rgba(108, 145, 220, 0.14);

          background:
            linear-gradient(
              145deg,
              rgba(8, 14, 29, 0.62),
              rgba(4, 8, 19, 0.42)
            );

          cursor: pointer;

          transition:
            color 0.22s ease,
            border-color 0.22s ease,
            background 0.22s ease,
            transform 0.22s ease,
            box-shadow 0.22s ease;
        }

        .achievement-preview::before {
          content: "";

          position: absolute;
          inset: 0;

          opacity: 0;

          pointer-events: none;

          background:
            linear-gradient(
              135deg,
              rgba(79, 113, 212, 0.13),
              transparent 62%
            );

          transition:
            opacity 0.22s ease;
        }

        .achievement-preview-right::before {
          background:
            linear-gradient(
              -135deg,
              rgba(79, 113, 212, 0.13),
              transparent 62%
            );
        }

        .achievement-preview-line {
          position: absolute;

          top: 0;
          bottom: 0;

          width: 1px;

          opacity: 0;

          background:
            linear-gradient(
              to bottom,
              transparent,
              #7898ff,
              transparent
            );

          transition:
            opacity 0.22s ease;
        }

        .achievement-preview-left
          .achievement-preview-line {
          left: 0;
        }

        .achievement-preview-right
          .achievement-preview-line {
          right: 0;
        }

        .achievement-preview:hover {
          color: #dce6fb;

          border-color:
            rgba(121, 160, 244, 0.3);

          background:
            linear-gradient(
              145deg,
              rgba(12, 21, 43, 0.74),
              rgba(5, 11, 25, 0.6)
            );

          box-shadow:
            0 18px 44px
              rgba(0, 0, 0, 0.17);
        }

        .achievement-preview:hover::before,
        .achievement-preview:hover
          .achievement-preview-line {
          opacity: 1;
        }

        .achievement-preview-left:hover {
          transform:
            translateX(-2px);
        }

        .achievement-preview-right:hover {
          transform:
            translateX(2px);
        }

        .achievement-preview-number {
          position: relative;
          z-index: 2;

          color: #46546d;

          font-size: 5px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .achievement-preview-copy {
          position: relative;
          z-index: 2;

          min-width: 0;

          display: flex;
          flex-direction: column;

          gap: 9px;
        }

        .achievement-preview-copy small {
          color: #53637d;

          font-size: 5px;
          font-weight: 800;
          line-height: 1.5;
          letter-spacing: 0.15em;
        }

        .achievement-preview-copy strong {
          display: -webkit-box;

          overflow: hidden;

          color: inherit;

          font-size: clamp(
            7px,
            0.63vw,
            10px
          );

          font-weight: 700;
          line-height: 1.5;
          letter-spacing: 0.065em;

          overflow-wrap: anywhere;

          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
        }

        .achievement-preview-left {
          text-align: right;
        }

        .achievement-preview-left
          .achievement-preview-number,
        .achievement-preview-left
          .achievement-preview-copy {
          align-self: flex-end;
          align-items: flex-end;
        }

        .achievement-preview-right {
          text-align: left;
        }

        .achievement-preview-right
          .achievement-preview-number,
        .achievement-preview-right
          .achievement-preview-copy {
          align-self: flex-start;
          align-items: flex-start;
        }

        /* =====================================
           ACTIVE RECORD CARD
        ===================================== */

        .achievement-record-perspective {
          position: relative;

          width: 100%;
          height: min(58vh, 570px);
          min-height: 470px;

          perspective: 1450px;
          transform-style: preserve-3d;
        }

        .achievement-record-card {
          position: absolute;
          inset: 0;

          overflow: hidden;

          display: grid;
          grid-template-rows:
            48px
            minmax(0, 1fr)
            82px;

          border: 1px solid
            rgba(112, 150, 225, 0.2);

          background:
            linear-gradient(
              135deg,
              rgba(8, 14, 30, 0.98),
              rgba(4, 8, 19, 0.96)
            );

          box-shadow:
            0 25px 75px
              rgba(0, 0, 0, 0.32),
            inset 0 0 90px
              rgba(69, 98, 196, 0.027);

          transform-style: preserve-3d;

          will-change:
            transform,
            opacity;
        }

        .achievement-record-card-background {
          position: absolute;
          inset: 0;

          overflow: hidden;

          pointer-events: none;
        }

        .achievement-record-card-grid {
          position: absolute;
          inset: 0;

          opacity: 0.24;

          background-image:
            linear-gradient(
              rgba(106, 142, 219, 0.055)
                1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(106, 142, 219, 0.055)
                1px,
              transparent 1px
            );

          background-size: 32px 32px;
        }

        .achievement-record-card-radar {
          position: absolute;

          width: 310px;
          aspect-ratio: 1;

          right: -85px;
          top: 50%;

          border-radius: 50%;

          border: 1px solid
            rgba(114, 154, 242, 0.11);

          transform:
            translateY(-50%);

          box-shadow:
            inset 0 0 75px
              rgba(73, 104, 212, 0.035);
        }

        .achievement-record-card-radar::before,
        .achievement-record-card-radar::after {
          content: "";

          position: absolute;

          border-radius: 50%;

          border: 1px dashed
            rgba(114, 154, 242, 0.08);
        }

        .achievement-record-card-radar::before {
          inset: 20%;
        }

        .achievement-record-card-radar::after {
          inset: 39%;
        }

        .achievement-record-card-scanline {
          position: absolute;

          left: 0;
          right: 0;
          top: 22%;

          height: 1px;

          opacity: 0.35;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(122, 162, 255, 0.55),
              transparent
            );
        }

        .achievement-record-topbar {
          position: relative;
          z-index: 2;

          min-height: 47px;
          padding: 0 17px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          color: #596a84;

          border-bottom: 1px solid
            rgba(108, 145, 218, 0.12);

          font-size: 5px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .achievement-record-topbar div {
          display: flex;
          align-items: center;

          gap: 8px;
        }

        .achievement-record-status-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #58ffad;

          box-shadow:
            0 0 8px
              rgba(88, 255, 173, 0.72);
        }

        .achievement-record-main {
          position: relative;
          z-index: 2;

          min-height: 0;

          overflow: hidden;

          padding:
            clamp(22px, 2.6vw, 38px)
            clamp(24px, 3vw, 44px)
            clamp(20px, 2.4vw, 34px);

          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .achievement-record-identity {
          display: flex;
          align-items: center;

          gap: 14px;
        }

        .achievement-record-icon {
          width: 62px;
          height: 62px;

          flex: 0 0 auto;

          display: grid;
          place-items: center;

          color: #91aaff;

          border: 1px solid
            rgba(118, 158, 248, 0.23);

          background:
            radial-gradient(
              circle,
              rgba(90, 126, 224, 0.13),
              rgba(33, 51, 103, 0.025)
            );

          box-shadow:
            0 0 27px
              rgba(76, 113, 220, 0.12);
        }

        .achievement-record-classification
          span {
          display: block;

          color: #8298c0;

          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .achievement-record-classification
          small {
          display: block;

          margin-top: 6px;

          color: #44526a;

          font-size: 5px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .achievement-record-title-block {
          margin-top: clamp(
            16px,
            2.2vh,
            24px
          );
        }

        .achievement-record-number {
          color: #4f5f78;

          font-size: 5px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .achievement-record-title-block
          h3 {
          max-width: min(
            760px,
            78%
          );

          margin: 10px 0 0;

          color: #f3f6ff;

          font-size: clamp(
            34px,
            3.55vw,
            57px
          );

          font-weight: 500;
          line-height: 0.94;
          letter-spacing: -0.052em;

          text-wrap: balance;
          overflow-wrap: anywhere;
        }

        .achievement-record-organization {
          max-width: 74%;

          margin: 10px 0 0;

          color: #71819d;

          font-size: clamp(
            8px,
            0.72vw,
            11px
          );

          font-weight: 600;
          line-height: 1.5;
          letter-spacing: 0.1em;
        }

        .achievement-record-metric {
          margin-top: clamp(
            17px,
            2.2vh,
            24px
          );

          display: flex;
          flex-direction: column;
          align-items: flex-start;

          gap: 7px;
        }

        .achievement-record-metric
          span {
          color: #53647e;

          font-size: 5px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .achievement-record-metric
          strong {
          max-width: 82%;

          color: #9fb3e4;

          font-size: clamp(
            13px,
            1.25vw,
            19px
          );

          font-weight: 550;
          line-height: 1.35;
          letter-spacing: 0.025em;
        }

        .achievement-record-description {
          position: relative;
          z-index: 3;

          max-width: 72%;

          margin:
            clamp(13px, 1.8vh, 18px)
            0
            0;

          color: #77849b;

          font-size: clamp(
            8px,
            0.7vw,
            11px
          );

          line-height: 1.65;
        }

        .achievement-record-footer {
          position: relative;
          z-index: 8;

          min-height: 82px;
          padding: 0 17px;

          display: grid;
          grid-template-columns:
            0.8fr
            1.25fr
            0.65fr;

          border-top: 1px solid
            rgba(108, 145, 218, 0.12);

          background:
            rgba(3, 7, 16, 0.96);

          backdrop-filter: blur(10px);
        }

        .achievement-record-footer
          > div {
          min-width: 0;

          padding:
            14px
            clamp(12px, 1.5vw, 20px);

          display: flex;
          flex-direction: column;
          justify-content: center;

          gap: 6px;

          border-right: 1px solid
            rgba(108, 145, 218, 0.1);
        }

        .achievement-record-footer
          > div:last-child {
          border-right: 0;
        }

        .achievement-record-footer
          span {
          color: #46536a;

          font-size: 5px;
          font-weight: 800;
          letter-spacing: 0.13em;
        }

        .achievement-record-footer
          strong {
          overflow: hidden;

          color: #8190a9;

          font-size: 6px;
          font-weight: 700;
          line-height: 1.45;
          letter-spacing: 0.1em;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .achievement-vault-footer {
          position: relative;
          z-index: 4;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;
        }

        .achievement-vault-progress {
          display: flex;
          align-items: center;

          gap: 6px;
        }

        .achievement-vault-progress
          button {
          width: 19px;
          height: 18px;

          padding: 0;

          display: grid;
          place-items: center;

          border: 0;
          background: transparent;

          cursor: pointer;
        }

        .achievement-vault-progress
          button
          span {
          width: 100%;
          height: 1px;

          background:
            rgba(108, 145, 215, 0.17);

          transition:
            background 0.17s ease,
            transform 0.17s ease,
            box-shadow 0.17s ease;
        }

        .achievement-vault-progress
          button.active
          span {
          background: #809fff;

          transform: scaleY(2);

          box-shadow:
            0 0 8px
              rgba(111, 150, 255, 0.62);
        }

        .achievement-vault-controls {
          color: #4e5b71;

          font-size: 5px;
          letter-spacing: 0.13em;
        }

        .achievement-vault-controls span {
          color: #7184a5;
        }

        .achievement-record-gold
          .achievement-record-icon,
        .achievement-record-orange
          .achievement-record-icon {
          color: #f3c875;

          border-color:
            rgba(243, 187, 88, 0.28);

          box-shadow:
            0 0 27px
              rgba(233, 169, 58, 0.11);
        }

        .achievement-record-red
          .achievement-record-icon {
          color: #ff8585;

          border-color:
            rgba(255, 105, 105, 0.26);
        }

        .achievement-record-green
          .achievement-record-icon,
        .achievement-record-teal
          .achievement-record-icon {
          color: #70e6bf;

          border-color:
            rgba(76, 218, 178, 0.26);
        }

        .achievement-record-purple
          .achievement-record-icon,
        .achievement-record-violet
          .achievement-record-icon,
        .achievement-record-indigo
          .achievement-record-icon {
          color: #bc91ff;

          border-color:
            rgba(164, 109, 255, 0.28);
        }

        .achievement-record-pink
          .achievement-record-icon {
          color: #ff96d3;

          border-color:
            rgba(255, 121, 201, 0.27);
        }

        /* =====================================
           SMALLER LAPTOPS AND TABLETS
        ===================================== */

        @media (max-width: 1180px) {
          .achievement-vault {
            padding-inline: 25px;
          }

          .achievement-vault-interface {
            grid-template-columns:
              185px
              minmax(0, 1fr);
          }

          .achievement-record-stage {
            grid-template-columns:
              42px
              minmax(0, 1fr)
              42px;

            gap: 8px;
          }

          .achievement-preview {
            display: none;
          }

          .achievement-navigation-arrow {
            width: 42px;
            height: 62px;
          }

          .achievement-record-title-block
            h3 {
            font-size: clamp(
              33px,
              4.6vw,
              58px
            );
          }
        }

        /* =====================================
           TABLET AND MOBILE
        ===================================== */

        @media (max-width: 900px) {
          .achievement-vault {
            height: auto;
            min-height: 100svh;

            padding:
              74px
              18px
              34px;

            grid-template-rows:
              auto
              auto
              auto;
          }

          .achievement-vault-header {
            align-items: flex-start;
          }

          .achievement-vault-introduction {
            max-width: 430px;
          }

          .achievement-vault-interface {
            grid-template-columns: 1fr;
          }

          .achievement-record-list {
            display: none !important;
          }

          .achievement-record-stage {
            width: 100%;

            grid-template-columns:
              44px
              minmax(0, 1fr)
              44px;

            gap: 8px;
          }

          .achievement-preview {
            display: none;
          }

          .achievement-record-perspective {
            height: min(
              69svh,
              610px
            );

            min-height: 520px;
          }

          .achievement-record-card {
            grid-template-rows:
              45px
              minmax(0, 1fr)
              78px;
          }

          .achievement-record-main {
            padding:
              22px
              24px
              18px;
          }

          .achievement-record-title-block
            h3 {
            max-width: 88%;

            font-size: clamp(
              31px,
              7.4vw,
              52px
            );
          }

          .achievement-record-organization {
            max-width: 90%;
          }

          .achievement-record-metric
            strong {
            max-width: 92%;
          }

          .achievement-record-description {
            max-width: 88%;
          }

          .achievement-vault-footer {
            justify-content: center;
          }

          .achievement-vault-progress {
            width: auto;

            justify-content: center;
          }

          .achievement-vault-controls {
            display: none;
          }
        }

        /* =====================================
           SMALL MOBILE
        ===================================== */

        @media (max-width: 650px) {
          .achievement-vault {
            padding:
              68px
              10px
              28px;
          }

          .achievement-vault-header {
            padding-inline: 8px;
          }

          .achievement-vault-header h2 {
            font-size: clamp(
              39px,
              13vw,
              58px
            );
          }

          .achievement-vault-count {
            min-width: auto;
          }

          .achievement-vault-count
            > span {
            display: none;
          }

          .achievement-record-stage {
            grid-template-columns:
              34px
              minmax(0, 1fr)
              34px;

            gap: 4px;
          }

          .achievement-navigation-arrow {
            width: 34px;
            height: 54px;

            border-color:
              rgba(110, 147, 222, 0.16);
          }

          .achievement-navigation-arrow::after {
            display: none;
          }

          .achievement-record-perspective {
            height: min(
              72svh,
              590px
            );

            min-height: 540px;
          }

          .achievement-record-card {
            grid-template-rows:
              43px
              minmax(0, 1fr)
              75px;
          }

          .achievement-record-main {
            padding:
              18px
              17px
              15px;
          }

          .achievement-record-icon {
            width: 48px;
            height: 48px;
          }

          .achievement-record-classification
            span {
            font-size: 6px;
          }

          .achievement-record-classification
            small {
            font-size: 4px;
          }

          .achievement-record-title-block {
            margin-top: 16px;
          }

          .achievement-record-title-block
            h3 {
            max-width: 96%;

            font-size: clamp(
              28px,
              9.4vw,
              43px
            );

            line-height: 0.96;
          }

          .achievement-record-organization {
            max-width: 96%;

            font-size: 8px;
            line-height: 1.45;
          }

          .achievement-record-metric {
            margin-top: 16px;
          }

          .achievement-record-metric
            strong {
            max-width: 100%;

            font-size: clamp(
              13px,
              4vw,
              18px
            );
          }

          .achievement-record-description {
            max-width: 96%;

            margin-top: 13px;

            font-size: 8px;
            line-height: 1.55;
          }

          .achievement-record-footer {
            min-height: 75px;

            padding-inline: 5px;

            grid-template-columns:
              1fr
              1fr;
          }

          .achievement-record-footer
            > div {
            padding:
              10px
              8px;
          }

          .achievement-record-footer
            > div:nth-child(2) {
            border-right: 0;
          }

          .achievement-record-footer
            > div:last-child {
            display: none;
          }

          .achievement-record-footer
            span {
            font-size: 4px;
          }

          .achievement-record-footer
            strong {
            font-size: 5px;
          }

          .achievement-vault-progress {
            width: 100%;
            max-width: 100%;

            padding-inline: 12px;

            justify-content: center;
            flex-wrap: wrap;

            overflow-x: auto;

            scrollbar-width: none;
          }

          .achievement-vault-progress::-webkit-scrollbar {
            display: none;
          }

          .achievement-vault-progress
            button {
            width: 17px;
          }
        }

        @media (max-width: 430px) {
          .achievement-vault {
            padding-inline: 10px;
          }

          .achievement-vault-header {
            gap: 12px;
          }

          .achievement-vault-introduction {
            font-size: 9px;
          }

          .achievement-record-stage {
            grid-template-columns:
              31px
              minmax(0, 1fr)
              31px;
          }

          .achievement-navigation-arrow {
            width: 31px;
            height: 48px;
          }

          .achievement-record-perspective {
            height: 570px;
            min-height: 570px;
          }

          .achievement-record-topbar {
            padding-inline: 11px;
          }

          .achievement-record-main {
            padding-inline: 15px;
          }

          .achievement-record-title-block
            h3 {
            font-size: clamp(
              28px,
              9vw,
              39px
            );
          }

          .achievement-record-description {
            line-height: 1.6;
          }

          .achievement-record-footer {
            padding-inline: 8px;
          }

          .achievement-record-footer
            > div {
            padding-inline: 8px;
          }
        }

        /* =====================================
           SHORT LAPTOP SCREENS
        ===================================== */

        @media (
          max-height: 760px
        ) and (min-width: 901px) {
          .achievement-vault {
            min-height: 650px;

            padding-top: 34px;
            padding-bottom: 18px;

            gap: 15px;
          }

          .achievement-vault-header h2 {
            font-size: clamp(
              37px,
              4vw,
              61px
            );
          }

          .achievement-vault-introduction {
            margin-top: 12px;
          }

          .achievement-record-perspective {
            height: 455px;
            min-height: 455px;
          }

          .achievement-record-card {
            grid-template-rows:
              44px
              minmax(0, 1fr)
              72px;
          }

          .achievement-record-main {
            padding:
              18px
              30px
              16px;
          }

          .achievement-record-icon {
            width: 50px;
            height: 50px;
          }

          .achievement-record-title-block {
            margin-top: 14px;
          }

          .achievement-record-title-block
            h3 {
            max-width: 75%;

            font-size: clamp(
              30px,
              3.15vw,
              48px
            );
          }

          .achievement-record-organization {
            margin-top: 8px;
          }

          .achievement-record-metric {
            margin-top: 13px;
          }

          .achievement-record-description {
            margin-top: 10px;

            font-size: 8px;
            line-height: 1.5;
          }

          .achievement-record-footer {
            min-height: 72px;
          }
        }

        /* =====================================
           ONE VIEWPORT DESKTOP LAYOUT
        ===================================== */

        @media (min-width: 901px) {
          .achievement-vault {
            height: 100svh;
            min-height: 680px;
            max-height: 100svh;

            padding:
              clamp(34px, 4.5vh, 56px)
              clamp(22px, 4vw, 62px)
              clamp(18px, 2.5vh, 30px);

            grid-template-rows:
              auto
              minmax(0, 1fr)
              auto;

            gap: clamp(
              12px,
              1.8vh,
              22px
            );

            overflow: hidden;
          }

          .achievement-vault-header {
            flex: 0 0 auto;
          }

          .achievement-vault-header h2 {
            font-size: clamp(
              34px,
              3.7vw,
              60px
            );

            line-height: 0.87;
          }

          .achievement-vault-introduction {
            margin-top: 10px;

            font-size: clamp(
              8px,
              0.68vw,
              11px
            );

            line-height: 1.55;
          }

          .achievement-vault-interface {
            min-height: 0;
            height: 100%;
          }

          .achievement-record-list {
            height: 100%;
            min-height: 0;
          }

          .achievement-record-list-scroll {
            max-height: none;

            height: calc(
              100% - 48px
            );
          }

          .achievement-record-stage {
            min-height: 0;
            height: 100%;
          }

          .achievement-record-perspective {
            height: 100%;
            min-height: 0;
            max-height: none;
          }

          .achievement-record-card {
            min-height: 0;

            grid-template-rows:
              46px
              minmax(0, 1fr)
              72px;
          }

          .achievement-record-main {
            min-height: 0;

            padding:
              clamp(18px, 2.4vh, 28px)
              clamp(24px, 2.8vw, 42px)
              clamp(14px, 1.8vh, 22px);

            justify-content: center;
          }

          .achievement-record-icon {
            width: clamp(
              48px,
              4vw,
              60px
            );

            height: clamp(
              48px,
              4vw,
              60px
            );
          }

          .achievement-record-title-block {
            margin-top: clamp(
              12px,
              1.7vh,
              20px
            );
          }

          .achievement-record-title-block
            h3 {
            max-width: 76%;

            font-size: clamp(
              30px,
              3.2vw,
              52px
            );

            line-height: 0.92;
          }

          .achievement-record-organization {
            margin-top: 8px;

            font-size: clamp(
              8px,
              0.68vw,
              10px
            );
          }

          .achievement-record-metric {
            margin-top: clamp(
              12px,
              1.8vh,
              19px
            );
          }

          .achievement-record-metric
            strong {
            font-size: clamp(
              12px,
              1.15vw,
              18px
            );
          }

          .achievement-record-description {
            margin-top: clamp(
              10px,
              1.4vh,
              15px
            );

            font-size: clamp(
              7px,
              0.62vw,
              10px
            );

            line-height: 1.5;
          }

          .achievement-record-footer {
            min-height: 72px;
          }

          .achievement-vault-footer {
            min-height: 18px;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .achievement-record-card {
            will-change: auto;
          }

          .achievement-preview,
          .achievement-navigation-arrow {
            transition: none;
          }
        }
          /* ==========================================
   ACHIEVEMENT CARD — NARROW MOBILE FIX
   Works on regular phones and foldables
========================================== */

@media (max-width: 900px) {
  .achievement-vault-interface {
    width: 100%;
    min-width: 0;
  }

  .achievement-record-stage {
    width: 100%;
    min-width: 0;

    display: flex !important;
    align-items: center;
    justify-content: center;

    padding-inline: 12px;
  }

  .achievement-navigation-arrow,
  .achievement-preview {
    display: none !important;
  }

  .achievement-record-perspective {
    width: min(100%, 620px) !important;
    min-width: 0 !important;
    margin-inline: auto;

    container-type: inline-size;
  }

  .achievement-record-card {
    width: 100%;
    min-width: 0;

    box-sizing: border-box;
  }

  .achievement-record-topbar,
  .achievement-record-main,
  .achievement-record-footer {
    min-width: 0;
    box-sizing: border-box;
  }

  .achievement-record-main {
    padding:
      clamp(17px, 5cqw, 25px)
      clamp(16px, 5.5cqw, 28px)
      clamp(15px, 4.5cqw, 22px);
  }

  .achievement-record-title-block,
  .achievement-record-identity,
  .achievement-record-classification,
  .achievement-record-metric {
    min-width: 0;
  }

  .achievement-record-title-block h3 {
    max-width: 100% !important;

    font-size: clamp(
      26px,
      10cqw,
      46px
    ) !important;

    line-height: 0.96;
    overflow-wrap: anywhere;
    word-break: normal;
    text-wrap: balance;
  }

  .achievement-record-organization {
    max-width: 100% !important;

    font-size: clamp(
      7px,
      2.6cqw,
      10px
    ) !important;

    overflow-wrap: anywhere;
  }

  .achievement-record-metric strong {
    max-width: 100% !important;

    font-size: clamp(
      12px,
      4.2cqw,
      18px
    ) !important;

    overflow-wrap: anywhere;
  }

  .achievement-record-description {
    max-width: 100% !important;

    font-size: clamp(
      7px,
      2.65cqw,
      10px
    ) !important;

    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  .achievement-record-footer {
    width: 100%;

    grid-template-columns:
      minmax(0, 1fr)
      minmax(0, 1fr) !important;

    padding-inline: clamp(
      3px,
      1.8cqw,
      8px
    ) !important;
  }

  .achievement-record-footer > div {
    min-width: 0;

    padding:
      10px
      clamp(6px, 2.8cqw, 12px) !important;
  }

  .achievement-record-footer > div:last-child {
    display: none !important;
  }

  .achievement-record-footer
    > div:nth-child(2) {
    border-right: 0;
  }

  .achievement-record-footer strong {
    width: 100%;

    font-size: clamp(
      4px,
      1.9cqw,
      6px
    ) !important;

    line-height: 1.45;

    white-space: normal !important;
    overflow-wrap: anywhere;
  }
}

/* Narrow phones and foldable outer screens */

@media (max-width: 430px) {
  .achievement-vault {
    padding-inline: 8px !important;
  }

  .achievement-record-stage {
    padding-inline: 6px;
  }

  .achievement-record-perspective {
    width: calc(100vw - 28px) !important;

    height: clamp(
      515px,
      72svh,
      570px
    ) !important;

    min-height: 515px !important;
  }

  .achievement-record-card {
    grid-template-rows:
      42px
      minmax(0, 1fr)
      72px !important;
  }

  .achievement-record-topbar {
    padding-inline: 10px !important;

    font-size: 4px;
    letter-spacing: 0.1em;
  }

  .achievement-record-icon {
    width: 44px !important;
    height: 44px !important;
  }

  .achievement-record-icon svg {
    width: 25px;
    height: 25px;
  }

  .achievement-record-classification span {
    font-size: 5px !important;
  }

  .achievement-record-classification small {
    font-size: 3.5px !important;
    line-height: 1.45;
  }

  .achievement-record-title-block {
    margin-top: 13px !important;
  }

  .achievement-record-title-block h3 {
    margin-top: 8px;

    font-size: clamp(
      24px,
      10.5cqw,
      36px
    ) !important;
  }

  .achievement-record-metric {
    margin-top: 13px !important;
  }

  .achievement-record-description {
    margin-top: 11px !important;
  }
}

/* Extremely narrow foldable screens */

@media (max-width: 360px) {
  .achievement-record-perspective {
    width: calc(100vw - 20px) !important;
  }

  .achievement-record-main {
    padding:
      15px
      14px
      13px !important;
  }

  .achievement-record-title-block h3 {
    font-size: clamp(
      22px,
      10cqw,
      32px
    ) !important;
  }

  .achievement-record-description {
    font-size: 7px !important;
  }


}

/* ==========================================
   MOBILE ACHIEVEMENT CENTERING
========================================== */

@media (max-width: 900px) {

  /* Move the card slightly left */
  .achievement-record-perspective {
    margin-left: -1.5px;
  }

  /* Keep the progress indicator perfectly centered */
  .achievement-vault-footer {
    justify-content: center;
  }

  .achievement-vault-progress {
    margin: 0 auto;
  }
}
      `}</style>
    </>
  );
}