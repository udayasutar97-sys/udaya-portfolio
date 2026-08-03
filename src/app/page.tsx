"use client";

import SpaceScene from "@/components/SpaceScene";
import { motion } from "motion/react";
import CursorGlow from "@/components/Cursor/CursorGlow";
import IntroLoader from "@/components/Loader/IntroLoader";
import MagneticButton from "@/components/UI/MagneticButton";
import InteractiveHUD from "@/components/Hero/InteractiveHUD";
import UniverseEffects from "@/components/Hero/UniverseEffects";
import PlanetPortal from "@/components/Planet/PlanetPortal";
import ProjectExperience from "@/components/Projects/ProjectExperience";
import ProjectCarousel from "@/components/Projects/ProjectCarousel";
import AchievementSection from "@/components/Achievements/AchievementSection";
import MobileNavigation from "@/components/UI/MobileNavigation";
import ExperienceNotice from "@/components/UI/ExperienceNotice";
import DesktopInstructions from "@/components/UI/DesktopInstructions";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Mail,
  MapPin,
  Orbit,
  Radio,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

const identityTracks = [
  {
    number: "01",
    title: "ENGINEER",
    description:
      "Building artificial-intelligence systems, full-stack software, computer-vision applications and autonomous platforms.",
  },
  {
    number: "02",
    title: "RESEARCHER",
    description:
      "Exploring adaptive quantum computing, experimental workflows and intelligent algorithms that respond to changing systems.",
  },
  {
    number: "03",
    title: "ATHLETE",
    description:
      "Competing as a UCI Elite cyclist and training as a black-belt Taekwondo athlete—developing precision, endurance and resilience.",
  },
];

const coreSystems = [
  "PYTHON",
  "TYPESCRIPT",
  "REACT",
  "NEXT.JS",
  "DJANGO",
  "QISKIT",
  "ARTIFICIAL INTELLIGENCE",
  "COMPUTER VISION",
  "AUTONOMOUS SYSTEMS",
];

const skills = [
  "Artificial Intelligence",
  "Quantum Computing",
  "Python",
  "Django",
  "JavaScript",
  "TypeScript",
  "HTML / CSS",
  "Tailwind CSS",
  "UI/UX Design",
  "IOS and Android Development",
  "Autonomous Systems",
  "React / Next.js",
  "Computer Vision",
  "UCI Elite Cycling",
  "Black-Belt Taekwondo",
  "Vibe Coding",
  "Research and Experimentation",
  "Natural Language Programming",
];

const trajectoryPaths = [
  {
    number: "01",
    title: "INTELLIGENT SYSTEMS",
    description:
      "Building autonomous software that can reason, retain context, coordinate models and assist people across complex tasks.",
    signal: "AI // AGENTS // MULTIMODAL",
  },
  {
    number: "02",
    title: "QUANTUM RESEARCH",
    description:
      "Exploring adaptive quantum workflows, noise-aware experimentation and software that responds intelligently to changing hardware.",
    signal: "QISKIT // ADAPTATION // RESEARCH",
  },
  {
    number: "03",
    title: "HUMAN PERFORMANCE",
    description:
      "Carrying the discipline developed through elite cycling and black-belt Taekwondo into engineering, research and long-term execution.",
    signal: "ENDURANCE // PRECISION // RESILIENCE",
  },
];

const activeMissions = [
  {
    code: "SYS-01",
    title: "SNOWMAN AI",
    description:
      "Modular intelligence, memory, planning and model routing.",
    status: "IN DEVELOPMENT",
  },
  {
    code: "QNT-02",
    title: "Q-ADAPT",
    description:
      "Adaptive quantum experimentation under changing noise.",
    status: "ACTIVE RESEARCH",
  },
  {
    code: "RND-03",
    title: "INDEPENDENT RESEARCH",
    description:
      "Exploring intelligent and quantum computational systems.",
    status: "ONGOING",
  },
];

const navigationItems = [
  {
    label: "HOME",
    target: "home",
  },
  {
    label: "PROJECTS",
    target: "projects",
  },
  {
    label: "ABOUT",
    target: "about",
  },
  {
    label: "ACHIEVEMENTS",
    target: "achievements",
  },
  {
    label: "TRAJECTORY",
    target: "trajectory",
  },
] as const;

type NavigationTarget =
  (typeof navigationItems)[number]["target"];

export default function Home() {
  const [activeSection, setActiveSection] =
    useState<NavigationTarget>("home");

  const [indicatorPosition, setIndicatorPosition] =
    useState(0);

  const navigationRef =
    useRef<HTMLElement | null>(null);

 const navigationLinkRefs =
  useRef<
    Partial<
      Record<
        NavigationTarget,
        HTMLAnchorElement | null
      >
    >
  >({});
useEffect(() => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  if (window.location.hash) {
    window.history.replaceState(
      null,
      "",
      window.location.pathname +
        window.location.search,
    );
  }

  const resetToHome = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setActiveSection("home");
  };

  resetToHome();

  const firstFrame =
    window.requestAnimationFrame(() => {
      resetToHome();

      window.requestAnimationFrame(
        resetToHome,
      );
    });

  const delayedReset =
    window.setTimeout(
      resetToHome,
      120,
    );

  return () => {
    window.cancelAnimationFrame(
      firstFrame,
    );

    window.clearTimeout(
      delayedReset,
    );
  };
}, []);




useEffect(() => {
  const snapSections = [
    ".hero",
    ".project-carousel-section",
    ".about-section",
    "#achievements",
    ".trajectory-section",
  ];

  const updateScrollSnapping = () => {
    const viewportHeight =
      window.visualViewport?.height ??
      window.innerHeight;

    const sections = snapSections
      .map((selector) =>
        document.querySelector<HTMLElement>(
          selector,
        ),
      )
      .filter(
        (
          section,
        ): section is HTMLElement =>
          section !== null,
      );

    /*
     * A small tolerance prevents snapping from
     * being disabled because of sub-pixel rounding.
     */
    const tolerance = 8;

    const sectionDoesNotFit = sections.some(
      (section) => {
        const requiredHeight = Math.max(
          section.scrollHeight,
          section.getBoundingClientRect()
            .height,
        );

        return (
          requiredHeight >
          viewportHeight + tolerance
        );
      },
    );

    document.documentElement.classList.toggle(
      "regular-scroll-mode",
      sectionDoesNotFit,
    );

    document.body.classList.toggle(
      "regular-scroll-mode",
      sectionDoesNotFit,
    );
  };

  let animationFrame: number | null = null;

  const scheduleUpdate = () => {
    if (animationFrame !== null) {
      window.cancelAnimationFrame(
        animationFrame,
      );
    }

    animationFrame =
      window.requestAnimationFrame(() => {
        updateScrollSnapping();
        animationFrame = null;
      });
  };

  const resizeObserver = new ResizeObserver(
    scheduleUpdate,
  );

  snapSections.forEach((selector) => {
    const section =
      document.querySelector<HTMLElement>(
        selector,
      );

    if (section) {
      resizeObserver.observe(section);
    }
  });

  scheduleUpdate();

  window.addEventListener(
    "resize",
    scheduleUpdate,
  );

  window.visualViewport?.addEventListener(
    "resize",
    scheduleUpdate,
  );

  window.addEventListener(
    "load",
    scheduleUpdate,
  );

  return () => {
    resizeObserver.disconnect();

    window.removeEventListener(
      "resize",
      scheduleUpdate,
    );

    window.visualViewport?.removeEventListener(
      "resize",
      scheduleUpdate,
    );

    window.removeEventListener(
      "load",
      scheduleUpdate,
    );

    if (animationFrame !== null) {
      window.cancelAnimationFrame(
        animationFrame,
      );
    }

    document.documentElement.classList.remove(
      "regular-scroll-mode",
    );

    document.body.classList.remove(
      "regular-scroll-mode",
    );
  };
}, []);


  const scrollFrameRef =
    useRef<number | null>(null);

  const updateIndicatorPosition =
    useCallback(() => {
      const activeLink =
        navigationLinkRefs.current[
          activeSection
        ];

      const navigation =
        navigationRef.current;

      if (!activeLink || !navigation) {
        return;
      }

      const linkRectangle =
        activeLink.getBoundingClientRect();

      const navigationRectangle =
        navigation.getBoundingClientRect();

      const linkCenter =
        linkRectangle.top -
        navigationRectangle.top +
        linkRectangle.height / 2;

      setIndicatorPosition(linkCenter);
    }, [activeSection]);

  const updateActiveSection =
    useCallback(() => {
      const activationLine =
        window.innerHeight * 0.42;

      let detectedSection: NavigationTarget =
        "home";

      for (const item of navigationItems) {
        const section =
          document.getElementById(
            item.target,
          );

        if (!section) {
          continue;
        }

        const rectangle =
          section.getBoundingClientRect();

        if (
          rectangle.top <=
            activationLine &&
          rectangle.bottom >
            activationLine
        ) {
          detectedSection =
            item.target;

          break;
        }

        if (
          rectangle.top <=
          activationLine
        ) {
          detectedSection =
            item.target;
        }
      }

      const reachedBottom =
        window.innerHeight +
          window.scrollY >=
        document.documentElement
          .scrollHeight -
          8;

      if (reachedBottom) {
        detectedSection =
          "trajectory";
      }

      setActiveSection(
        (currentSection) =>
          currentSection ===
          detectedSection
            ? currentSection
            : detectedSection,
      );
    }, []);

  useLayoutEffect(() => {
    updateIndicatorPosition();
  }, [
    activeSection,
    updateIndicatorPosition,
  ]);

  useEffect(() => {
    const handleWindowChange = () => {
      if (
        scrollFrameRef.current !== null
      ) {
        return;
      }

      scrollFrameRef.current =
        window.requestAnimationFrame(() => {
          updateActiveSection();
          updateIndicatorPosition();

          scrollFrameRef.current =
            null;
        });
    };

    updateActiveSection();
    updateIndicatorPosition();

    window.addEventListener(
      "scroll",
      handleWindowChange,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      handleWindowChange,
    );

    window.addEventListener(
      "load",
      handleWindowChange,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleWindowChange,
      );

      window.removeEventListener(
        "resize",
        handleWindowChange,
      );

      window.removeEventListener(
        "load",
        handleWindowChange,
      );

      if (
        scrollFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(
          scrollFrameRef.current,
        );

        scrollFrameRef.current =
          null;
      }
    };
  }, [
    updateActiveSection,
    updateIndicatorPosition,
  ]);

  const handleNavigationClick = (
    target: NavigationTarget,
  ) => {
    setActiveSection(target);
  };

  return (
    <main>
      <ExperienceNotice />
      <IntroLoader />
      <UniverseEffects />
      <PlanetPortal />
      <ProjectExperience />

      <div className="noise" />

      <CursorGlow />

      <MobileNavigation />

      <aside className="sidebar">
        <a
          className="brand"
          href="#home"
          onClick={() =>
            handleNavigationClick("home")
          }
        >
          <span className="brand-mark">
            <Orbit size={19} />
          </span>

          <span>
            UDAYA
            <span className="accent">
              .SYS
            </span>
          </span>
        </a>

        <nav
          ref={navigationRef}
          className="side-navigation"
          aria-label="Main navigation"
        >
          <motion.span
            className="side-navigation-active-arrow"
            initial={false}
            animate={{
              top: indicatorPosition,
              opacity:
                indicatorPosition > 0
                  ? 1
                  : 0,
            }}
            transition={{
              top: {
                type: "spring",
                stiffness: 420,
                damping: 35,
                mass: 0.6,
              },
              opacity: {
                duration: 0.2,
              },
            }}
            aria-hidden="true"
          >
            <span className="side-navigation-arrow-glow" />

            <ArrowRight
              size={16}
              strokeWidth={2.3}
            />
          </motion.span>

          {navigationItems.map(
            (item, index) => {
              const isActive =
                activeSection ===
                item.target;

              return (
                <a
                  key={item.label}
                  ref={(element) => {
                    navigationLinkRefs.current[
                      item.target
                    ] = element;
                  }}
                  href={`#${item.target}`}
                  className={
                    isActive
                      ? "side-navigation-link active"
                      : "side-navigation-link"
                  }
                  aria-current={
                    isActive
                      ? "page"
                      : undefined
                  }
                  onClick={() =>
                    handleNavigationClick(
                      item.target,
                    )
                  }
                >
                  <span className="side-navigation-number">
                    0{index + 1}
                  </span>

                  <span className="side-navigation-label">
                    {item.label}
                  </span>
                </a>
              );
            },
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="status">
            <span className="status-dot" />
            EXPLORING WHAT COMES NEXT
          </div>

          <div className="socials">
            <a
              href="https://github.com/udayasutar97-sys"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub size={17} />
            </a>

            <a
              href="https://www.linkedin.com/in/udaya-chandra-sutar-585980425"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn
                size={17}
              />
            </a>

            <a
              href="mailto:udayasutar97@gmail.com"
              aria-label="Email"
            >
              <Mail size={17} />
            </a>
          </div>

          <p>UDAYA.SYS © 2026</p>
        </div>
      </aside>

      <section
        id="home"
        className="hero"
      >
        <div className="topbar">
          <div className="system-status">
            <Radio size={15} />
            <span>SYSTEM ONLINE</span>
          </div>

          <div className="top-meta">
            <span>
              EARTH / 20.2961° N
            </span>

            <span>
              LOCAL TIME 
            </span>
          </div>
        </div>

        <div className="space-background">
          <div className="stars stars-one" />
          <div className="stars stars-two" />

          <div className="orbit-line orbit-one" />
          <div className="orbit-line orbit-two" />

          <motion.div
            className="space-scene-wrapper"
            initial={{
              scale: 0.82,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 1.8,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            <SpaceScene />
          </motion.div>
        </div>

        <InteractiveHUD />
        <DesktopInstructions />

        <div className="hero-content">
          <motion.div
  className="eyebrow"
  initial={{
    opacity: 0,
    y: 18,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    delay: 0.2,
  }}
>
  <span>IDENTITY // 001</span>
  <span className="eyebrow-line" />
</motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 45,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.25,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            UDAYA
            <br />
            <span>CH. SUTAR</span>
          </motion.h1>

          <motion.div
            className="hero-description"
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.55,
            }}
          >
            <p className="role">
              AI DEVELOPER{" "}
              <span>×</span>{" "}
              QUANTUM EXPLORER
              <span>×</span>{" "}
              BLACK BELT
              <span>×</span>{" "}
              ELITE CYCLIST
            </p>

            <p className="summary">
              Building intelligent
              systems and exploring
              quantum technology while
              competing as a black-belt
              Taekwondo athlete and UCI
              Elite cyclist. Code,
              research, precision and
              endurance shape everything
              I create.
            </p>

            <div className="hero-buttons">
              <MagneticButton
                className="primary-button"
                href="#projects"
              >
                ENTER MY WORLD
                <ArrowDown size={17} />
              </MagneticButton>

              <MagneticButton
                className="secondary-button"
                href="#about"
                strength={0.2}
              >
                DISCOVER MY STORY
                <ArrowDown size={17} />
              </MagneticButton>
            </div>
          </motion.div>
        </div>

        <div className="hero-data">
          <div>
            <span>
              CURRENT FOCUS
            </span>

            <strong>
              AI 
              PERFORMANCE
            </strong>
          </div>

          <div>
            <span>
              OPERATING FROM
            </span>

            <strong>
              <MapPin size={14} />
              EARTH
            </strong>
          </div>

          <div>
            <span>SIGNAL</span>
            <strong>100%</strong>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>
            SCROLL TO EXPLORE
          </span>

          <div className="scroll-track">
            <motion.div
              animate={{
                y: [0, 31, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </div>
      </section>

      <div className="page-content">
        <ProjectCarousel />

        <section
          id="about"
          className="about-section section-shell"
        >
          <div className="about-heading">
            <p className="section-index">
              03 
            </p>

            <h2>
              BUILT ACROSS
              <br />
              <span>
                MULTIPLE WORLDS.
              </span>
            </h2>
          </div>

          <div className="about-copy">
            <p className="large-copy">
              I move between software,
              research and elite
              sport—building ambitious
              systems with the same
              discipline I bring to racing
              and martial arts.
            </p>

            <div className="about-columns">
              <p>
                My technical work spans
                artificial intelligence,
                autonomous systems,
                full-stack engineering,
                computer vision and
                quantum computing
                research.
              </p>

              <p>
                Outside technology, I
                compete as a UCI Elite
                cyclist and train as a
                black-belt Taekwondo
                athlete. Racing develops
                endurance; martial arts
                develops precision,
                control and resilience.
              </p>
            </div>

            <div className="skill-list">
              {skills.map(
                (skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{
                      opacity: 0,
                    }}
                    whileInView={{
                      opacity: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay:
                        index * 0.04,
                    }}
                  >
                    <span>
                      0{index + 1}
                    </span>

                    {skill}
                  </motion.div>
                ),
              )}
            </div>
          </div>
        </section>

        <AchievementSection />

        <section
          id="trajectory"
          className="trajectory-section section-shell"
        >
          <div className="trajectory-background">
            <div className="trajectory-grid" />

            <div className="trajectory-orbit trajectory-orbit-one" />
            <div className="trajectory-orbit trajectory-orbit-two" />

            <div className="trajectory-glow" />
          </div>

          <header className="trajectory-header">
            <div>
              <p className="section-index">
                05 
              </p>

              <h2>
                WHERE I AM
                <br />
                <span>
                  HEADED NEXT.
                </span>
              </h2>
            </div>

            <div className="trajectory-header-status">
              <span className="trajectory-live-dot" />

              <div>
                <small>
                  CURRENT VECTOR
                </small>

                <strong>
                  FORWARD 
                </strong>
              </div>
            </div>
          </header>

          <div className="trajectory-body">
            <div className="trajectory-vision">
              <p className="trajectory-statement">
                I want to build the next
                generation of intelligent
                systems—combining
                artificial intelligence,
                quantum computing and
                autonomous software to
                expand what computation
                can achieve.
              </p>

              <p className="trajectory-supporting-copy">
                My direction is centred on
                original research,
                ambitious engineering and
                technologies that solve
                meaningful problems. I am
                not interested only in
                using the systems that
                define the future; I want
                to help create them.
              </p>

              <div className="trajectory-coordinate">
                <span>
                  DESTINATION 
                </span>

                <span>
                  DIRECTION 
                </span>

                <span>
                  LIMIT 
                </span>
              </div>
            </div>

            <div className="trajectory-paths">
              {trajectoryPaths.map(
                (path, index) => (
                  <motion.article
                    key={path.title}
                    className="trajectory-path"
                    initial={{
                      opacity: 0,
                      x: 24,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.3,
                    }}
                    transition={{
                      duration: 0.55,
                      delay:
                        index * 0.08,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                  >
                    <div className="trajectory-path-index">
                      <span>
                        {path.number}
                      </span>

                      <div />
                    </div>

                    <div className="trajectory-path-content">
                      <h3>
                        {path.title}
                      </h3>

                      <p>
                        {
                          path.description
                        }
                      </p>

                      <small>
                        {path.signal}
                      </small>
                    </div>
                  </motion.article>
                ),
              )}
            </div>

            <aside className="trajectory-mission-panel">
              <div className="trajectory-panel-header">
                <div>
                  <span className="trajectory-live-dot" />
                  ACTIVE MISSION FEED
                </div>

                <small>
                  03 SIGNALS
                </small>
              </div>

              <div className="trajectory-mission-list">
                {activeMissions.map(
                  (mission, index) => (
                    <motion.div
                      key={
                        mission.code
                      }
                      className="trajectory-mission"
                      initial={{
                        opacity: 0,
                        y: 14,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay:
                          0.14 +
                          index * 0.07,
                      }}
                    >
                      <div className="trajectory-mission-top">
                        <span>
                          {
                            mission.code
                          }
                        </span>

                        <small>
                          {
                            mission.status
                          }
                        </small>
                      </div>

                      <strong>
                        {
                          mission.title
                        }
                      </strong>

                      <p>
                        {
                          mission.description
                        }
                      </p>
                    </motion.div>
                  ),
                )}
              </div>

              <div className="trajectory-panel-footer">
                <span>
                  NEXT TRANSMISSION
                </span>

                <strong>
                  CONTINUOUSLY EVOLVING
                </strong>
              </div>
            </aside>
          </div>

          <div className="trajectory-footer">
            <div className="profile-links">
              <a
                href="https://github.com/udayasutar97-sys"
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  GITHUB 
                  ARCHIVE
                </span>

                <ArrowUpRight
                  size={17}
                />
              </a>

              <a
                href="https://www.linkedin.com/in/udaya-chandra-sutar-585980425"
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  LINKEDIN 
                </span>

                <ArrowUpRight
                  size={17}
                />
              </a>

              <a href="mailto:udayasutar97@gmail.com">
                <span>
                  EMAIL 
                  CORRESPONDENCE
                </span>

                <Mail size={17} />
              </a>
            </div>

            <footer className="trajectory-signature">
              <p>
                DESIGNED &amp; ENGINEERED
                BY UDAYA CHANDRA SUTAR
              </p>

              <div>
                <span>EARTH</span>

                <span>
                  UDAYA.SYS © 2026
                </span>
              </div>
            </footer>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .side-navigation {
          position: relative;
        }

        .side-navigation-link {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          transition:
            color 0.22s ease,
            opacity 0.22s ease;
        }

        .side-navigation-number {
          transition:
            color 0.22s ease,
            text-shadow 0.22s ease;
        }

        .side-navigation-label {
          transition:
            color 0.22s ease,
            text-shadow 0.22s ease,
            transform 0.22s ease;
        }

        .side-navigation-link.active {
          color: #ffffff;
        }

        .side-navigation-link.active
          .side-navigation-number {
          color: #b8cbff;
          text-shadow:
            0 0 7px
              rgba(
                145,
                179,
                255,
                0.78
              );
        }

        .side-navigation-link.active
          .side-navigation-label {
          color: #ffffff;
          transform: translateX(2px);
          text-shadow:
            0 0 6px
              rgba(
                255,
                255,
                255,
                0.45
              ),
            0 0 14px
              rgba(
                128,
                164,
                255,
                0.48
              );
        }

        .side-navigation-active-arrow {
          position: absolute;
          left: -27px;
          z-index: 5;

          width: 20px;
          height: 20px;

          display: grid;
          place-items: center;

          color: #ffffff;

          transform: translateY(-50%);

          pointer-events: none;

          filter:
            drop-shadow(
              0 0 4px
                rgba(
                  255,
                  255,
                  255,
                  0.95
                )
            )
            drop-shadow(
              0 0 10px
                rgba(
                  132,
                  170,
                  255,
                  0.92
                )
            );
        }

        .side-navigation-active-arrow
          svg {
          position: relative;
          z-index: 2;
        }

        .side-navigation-arrow-glow {
          position: absolute;
          inset: 4px;

          border-radius: 50%;

          background: rgba(
            155,
            188,
            255,
            0.78
          );

          filter: blur(7px);

          opacity: 0.8;

          animation:
            sidebarArrowPulse
            1.8s ease-in-out infinite;
        }

        @keyframes sidebarArrowPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.82);
          }

          50% {
            opacity: 1;
            transform: scale(1.18);
          }
        }

        @media (max-width: 900px) {
          .side-navigation-active-arrow {
            display: none;
          }
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          .side-navigation-active-arrow {
            transition: none !important;
          }

          .side-navigation-arrow-glow {
            animation: none;
          }

          .side-navigation-link.active
            .side-navigation-label {
            transform: none;
          }
        }

        
























        /* =========================================================
   TRAJECTORY SECTION
   One-screen desktop layout + fully responsive mobile layout
   Paste at the END of globals.css
   ========================================================= */

.trajectory-section {
  position: relative;
  isolation: isolate;

  width: 100%;
  height: 100svh;
  min-height: 680px;
  max-height: 100svh;

  padding:
    clamp(46px, 5.2vh, 72px)
    clamp(28px, 3.7vw, 62px)
    clamp(22px, 2.8vh, 38px);

  display: grid;
  grid-template-rows:
    auto
    minmax(0, 1fr)
    auto;

  gap: clamp(18px, 2.2vh, 30px);

  overflow: hidden;
}

/* ---------------------------------------------------------
   Decorative background
   --------------------------------------------------------- */

.trajectory-background {
  position: absolute;
  inset: 0;
  z-index: -2;

  overflow: hidden;
  pointer-events: none;
}

.trajectory-grid,
.trajectory-orbit,
.trajectory-glow {
  pointer-events: none;
}

/* ---------------------------------------------------------
   Header
   --------------------------------------------------------- */

.trajectory-header {
  position: relative;
  z-index: 2;

  width: 100%;
  min-width: 0;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
}

.trajectory-header > div:first-child {
  min-width: 0;
}

.trajectory-header .section-index {
  margin: 0 0 clamp(7px, 1vh, 11px);
}

.trajectory-header h2 {
  margin: 0;

  font-size: clamp(
    34px,
    3.65vw,
    58px
  );

  line-height: 0.92;
  letter-spacing: -0.055em;
}

.trajectory-header-status {
  flex: 0 0 auto;
}

/* ---------------------------------------------------------
   Main three-column desktop body
   --------------------------------------------------------- */

.trajectory-body {
  position: relative;
  z-index: 2;

  width: 100%;
  min-width: 0;
  min-height: 0;
  height: 100%;

  display: grid;
  grid-template-columns:
    minmax(0, 1.05fr)
    minmax(0, 0.98fr)
    minmax(230px, 0.68fr);

  align-items: stretch;

  gap: clamp(24px, 3vw, 52px);
}

/* ---------------------------------------------------------
   Left vision column
   --------------------------------------------------------- */

.trajectory-vision {
  position: relative;

  min-width: 0;
  min-height: 0;

  display: flex;
  flex-direction: column;
}

.trajectory-statement {
  margin: 0;

  max-width: 720px;

  font-size: clamp(
    24px,
    2.65vw,
    46px
  );

  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.045em;
}

.trajectory-supporting-copy {
  max-width: 680px;

  margin:
    clamp(18px, 2.6vh, 34px)
    0
    0;

  font-size: clamp(
    10px,
    0.87vw,
    14px
  );

  line-height: 1.72;
}

.trajectory-coordinate {
  position: static !important;
  inset: auto !important;

  width: 100%;

  margin-top: auto;
  padding-top: clamp(12px, 1.8vh, 20px);

  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap:
    8px
    clamp(14px, 1.7vw, 28px);

  border-top: 1px solid
    rgba(113, 149, 220, 0.17);
}

.trajectory-coordinate span {
  white-space: nowrap;

  font-size: clamp(
    5px,
    0.46vw,
    7px
  );

  letter-spacing: 0.12em;
}

/* ---------------------------------------------------------
   Middle trajectory paths
   --------------------------------------------------------- */

.trajectory-paths {
  position: relative;

  min-width: 0;
  min-height: 0;
  height: 100%;

  display: grid;
  grid-template-rows:
    repeat(3, minmax(0, 1fr));
}

.trajectory-path {
  position: relative;

  min-width: 0;
  min-height: 0;

  padding:
    clamp(10px, 1.3vh, 18px)
    0;

  display: grid;
  grid-template-columns:
    clamp(34px, 3.1vw, 54px)
    minmax(0, 1fr);

  align-items: start;

  gap: clamp(13px, 1.5vw, 24px);

  overflow: hidden;

  border-bottom: 1px solid
    rgba(113, 149, 220, 0.15);
}

.trajectory-path:first-child {
  padding-top: 0;
}

.trajectory-path:last-child {
  padding-bottom: 0;
}

.trajectory-path-index {
  min-width: 0;
  min-height: 0;
  height: 100%;

  display: flex;
  flex-direction: column;
}

.trajectory-path-index > span {
  flex: 0 0 auto;
}

.trajectory-path-index > div {
  width: 1px;
  min-height: 0;
  height: auto;
  flex: 1;

  margin-top: 9px;

  background: rgba(
    117,
    153,
    226,
    0.2
  );
}

.trajectory-path-content {
  min-width: 0;
  min-height: 0;

  display: flex;
  flex-direction: column;
}

.trajectory-path-content h3 {
  margin: 0;

  font-size: clamp(
    18px,
    1.75vw,
    29px
  );

  line-height: 1.05;
  letter-spacing: 0.035em;
}

.trajectory-path-content p {
  max-width: 620px;

  margin:
    clamp(8px, 1.25vh, 15px)
    0
    0;

  font-size: clamp(
    9px,
    0.76vw,
    12px
  );

  line-height: 1.55;
}

.trajectory-path-content small {
  display: block;

  margin-top: auto;
  padding-top: clamp(7px, 1vh, 12px);

  font-size: clamp(
    4px,
    0.4vw,
    6px
  );

  letter-spacing: 0.13em;
}

/* ---------------------------------------------------------
   Right mission panel
   --------------------------------------------------------- */

.trajectory-mission-panel {
  position: relative !important;
  inset: auto !important;

  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100% !important;
  max-height: none !important;

  display: grid;
  grid-template-rows:
    auto
    minmax(0, 1fr)
    auto;

  align-self: stretch;

  overflow: hidden !important;
}

.trajectory-panel-header {
  min-width: 0;
  min-height: clamp(
    38px,
    4.8vh,
    54px
  );

  padding:
    0
    clamp(12px, 1.2vw, 18px);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.trajectory-panel-header > div {
  min-width: 0;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trajectory-panel-header > small {
  flex: 0 0 auto;
}

.trajectory-mission-list {
  min-width: 0;
  min-height: 0;
  height: 100%;

  display: grid;
  grid-template-rows:
    repeat(3, minmax(0, 1fr));

  overflow: hidden;
}

.trajectory-mission {
  min-width: 0;
  min-height: 0;
  height: auto;

  padding:
    clamp(11px, 1.4vh, 17px)
    clamp(12px, 1.2vw, 18px);

  display: flex;
  flex-direction: column;
  justify-content: center;

  overflow: hidden;
}

.trajectory-mission-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.trajectory-mission strong {
  margin-top: clamp(
    5px,
    0.7vh,
    8px
  );

  font-size: clamp(
    9px,
    0.8vw,
    13px
  );

  line-height: 1.2;
}

.trajectory-mission p {
  margin:
    clamp(5px, 0.7vh, 8px)
    0
    0;

  font-size: clamp(
    7px,
    0.62vw,
    10px
  );

  line-height: 1.48;
}

.trajectory-panel-footer {
  min-height: clamp(
    40px,
    5vh,
    58px
  );

  padding:
    0
    clamp(12px, 1.2vw, 18px);

  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ---------------------------------------------------------
   Compact desktop footer
   Profile links stay in one horizontal row
   --------------------------------------------------------- */

.trajectory-footer {
  position: relative !important;
  inset: auto !important;
  z-index: 2;

  width: 100%;
  min-width: 0;
  min-height: 0;
  height: auto !important;

  margin: 0;

  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    auto;

  align-items: end;

  gap: clamp(24px, 3vw, 48px);
}

.profile-links {
  position: relative;

  min-width: 0;
  width: 100%;

  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
}

.profile-links a {
  position: relative;

  min-width: 0;
  min-height: clamp(
    47px,
    5.6vh,
    66px
  );

  padding:
    0
    clamp(12px, 1.4vw, 22px);

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  border-top: 1px solid
    rgba(113, 149, 220, 0.17);

  border-bottom: 1px solid
    rgba(113, 149, 220, 0.17);

  border-right: 1px solid
    rgba(113, 149, 220, 0.12);
}

.profile-links a:first-child {
  padding-left: 0;
}

.profile-links a:last-child {
  border-right: 0;
}

.profile-links a span {
  min-width: 0;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: clamp(
    5px,
    0.5vw,
    7px
  );

  line-height: 1.4;
}

.profile-links a svg {
  flex: 0 0 auto;
}

.trajectory-signature {
  position: relative !important;
  inset: auto !important;

  width: auto;
  min-width: clamp(
    210px,
    18vw,
    300px
  );

  margin: 0;

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  gap: clamp(7px, 0.9vh, 11px);

  text-align: right;
}

.trajectory-signature p {
  margin: 0;
}

.trajectory-signature > div {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

/* =========================================================
   SHORT LAPTOPS
   13–16 inch laptop displays with limited vertical height
   ========================================================= */

@media (
  min-width: 1101px
) and (
  max-height: 820px
) {
  .trajectory-section {
    min-height: 640px;

    padding:
      38px
      clamp(26px, 3.2vw, 50px)
      18px;

    gap: 15px;
  }

  .trajectory-header h2 {
    font-size: clamp(
      30px,
      3.15vw,
      48px
    );
  }

  .trajectory-statement {
    font-size: clamp(
      22px,
      2.3vw,
      38px
    );

    line-height: 1.08;
  }

  .trajectory-supporting-copy {
    margin-top: 16px;
    line-height: 1.58;
  }

  .trajectory-path {
    padding: 8px 0;
  }

  .trajectory-path-content h3 {
    font-size: clamp(
      17px,
      1.55vw,
      25px
    );
  }

  .trajectory-path-content p {
    margin-top: 7px;
    line-height: 1.42;
  }

  .trajectory-path-content small {
    padding-top: 6px;
  }

  .trajectory-mission {
    padding:
      8px
      clamp(10px, 1vw, 15px);
  }

  .trajectory-panel-header,
  .trajectory-panel-footer {
    min-height: 38px;
  }

  .profile-links a {
    min-height: 45px;
  }

  .trajectory-signature {
    gap: 5px;
  }
}

/* =========================================================
   MEDIUM DESKTOP / SMALL LAPTOP WIDTH
   Keep it one-screen, but simplify to two body columns
   ========================================================= */

@media (
  min-width: 901px
) and (
  max-width: 1180px
) {
  .trajectory-section {
    height: 100svh;
    min-height: 720px;

    padding:
      50px
      28px
      24px;

    gap: 20px;
  }

  .trajectory-body {
    grid-template-columns:
      minmax(0, 0.9fr)
      minmax(0, 1.1fr);

    gap: 30px;
  }

  .trajectory-vision {
    grid-column: 1;
    grid-row: 1;
  }

  .trajectory-paths {
    grid-column: 2;
    grid-row: 1;
  }

 @media (
  min-width: 901px
) and (
  max-width: 1180px
) {
  .trajectory-section {
    height: auto;
    min-height: 100svh;
    max-height: none;

    padding:
      58px
      28px
      30px;

    gap: 24px;

    overflow: hidden;
  }

  .trajectory-body {
    height: auto;

    grid-template-columns:
      minmax(0, 0.9fr)
      minmax(0, 1.1fr);

    gap: 32px;
  }

  .trajectory-vision {
    grid-column: 1;
  }

  .trajectory-paths {
    grid-column: 2;
  }

  .trajectory-mission-panel {
    grid-column: 1 / -1;

    width: 100%;
    height: auto !important;

    display: grid;

    grid-template-columns:
      minmax(180px, 0.72fr)
      minmax(0, 2.1fr)
      minmax(180px, 0.72fr);

    grid-template-rows: auto;
  }

  .trajectory-mission-list {
    height: auto;

    display: grid;

    grid-template-columns:
      repeat(3, minmax(0, 1fr));

    grid-template-rows: auto;
  }

  .trajectory-mission {
    min-height: 140px;
  }

  .trajectory-panel-header,
  .trajectory-panel-footer {
    height: 100%;
    min-height: 140px;
  }

  .trajectory-footer {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .trajectory-signature {
    min-width: 0;
    width: 100%;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    text-align: left;
  }
}

  .trajectory-statement {
    font-size: clamp(
      26px,
      3.2vw,
      39px
    );
  }

  .trajectory-footer {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .trajectory-signature {
    min-width: 0;
    width: 100%;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    text-align: left;
  }
}

/*
 * IMPORTANT:
 * At this width the mission panel cannot fit legibly inside
 * one laptop screen alongside every other item. Instead of
 * deleting its content, it becomes part of the tablet/mobile
 * flow below 900px.
 */

/* =========================================================
   TABLET AND MOBILE
   Natural height; all content displayed and stacked
   ========================================================= */

@media (max-width: 900px) {
  .trajectory-section {
    width: 100%;

    height: auto;
    min-height: 100svh;
    max-height: none;

    padding:
      82px
      22px
      54px;

    display: flex;
    flex-direction: column;

    gap: 44px;

    overflow: hidden;
  }

  .trajectory-header {
    align-items: flex-start;
    flex-direction: column;

    gap: 22px;
  }

  .trajectory-header h2 {
    font-size: clamp(
      35px,
      8vw,
      58px
    );
  }

  .trajectory-header-status {
    width: 100%;
  }

  .trajectory-body {
    width: 100%;
    height: auto;

    display: flex;
    flex-direction: column;

    gap: 48px;
  }

  .trajectory-vision,
  .trajectory-paths,
  .trajectory-mission-panel {
    width: 100%;
    height: auto !important;
  }

  .trajectory-statement {
    max-width: 720px;

    font-size: clamp(
      30px,
      6.8vw,
      50px
    );

    line-height: 1.12;
  }

  .trajectory-supporting-copy {
    max-width: 700px;

    margin-top: 28px;

    font-size: clamp(
      12px,
      1.8vw,
      16px
    );

    line-height: 1.8;
  }

  .trajectory-coordinate {
    margin-top: 30px;
    padding-top: 18px;

    display: flex;
    flex-wrap: wrap;

    gap: 12px 24px;
  }

  .trajectory-coordinate span {
    font-size: 6px;
  }

  .trajectory-paths {
    display: flex;
    flex-direction: column;
  }

  .trajectory-path {
    min-height: 0;

    padding: 26px 0;

    grid-template-columns:
      42px
      minmax(0, 1fr);

    gap: 18px;

    overflow: visible;
  }

  .trajectory-path:first-child {
    padding-top: 0;
  }

  .trajectory-path-index > div {
    min-height: 70px;
  }

  .trajectory-path-content h3 {
    font-size: clamp(
      22px,
      4.4vw,
      34px
    );
  }

  .trajectory-path-content p {
    max-width: 680px;

    margin-top: 15px;

    font-size: clamp(
      11px,
      1.55vw,
      14px
    );

    line-height: 1.7;
  }

  .trajectory-path-content small {
    margin-top: 18px;
    padding-top: 0;

    font-size: 6px;
  }

  .trajectory-mission-panel {
    display: grid;

    grid-template-rows:
      auto
      auto
      auto;

    overflow: hidden !important;
  }

  .trajectory-mission-list {
    height: auto;

    display: grid;
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
    grid-template-rows: auto;
  }

  .trajectory-mission {
    min-height: 150px;

    padding:
      20px
      17px;

    justify-content: flex-start;
  }

  .trajectory-panel-header,
  .trajectory-panel-footer {
    min-height: 58px;
  }

  .trajectory-footer {
    width: 100%;

    display: flex;
    flex-direction: column;

    gap: 36px;
  }

  .profile-links {
    grid-template-columns: 1fr;
  }

  .profile-links a {
    min-height: 82px;

    padding:
      0
      4px;

    border-right: 0;
    border-bottom: 0;
  }

  .profile-links a:last-child {
    border-bottom: 1px solid
      rgba(113, 149, 220, 0.17);
  }

  .profile-links a span {
    font-size: 7px;
  }

  .trajectory-signature {
    width: 100%;
    min-width: 0;

    align-items: flex-start;

    text-align: left;
  }

  .trajectory-signature > div {
    width: 100%;

    justify-content: space-between;
  }
}

/* =========================================================
   PHONE
   ========================================================= */

@media (max-width: 600px) {
  .trajectory-section {
    min-height: auto;

    padding:
      72px
      16px
      44px;

    gap: 36px;
  }

  .trajectory-header {
    gap: 18px;
  }

  .trajectory-header h2 {
    font-size: clamp(
      33px,
      10vw,
      46px
    );
  }

  .trajectory-body {
    gap: 40px;
  }

  .trajectory-statement {
    font-size: clamp(
      27px,
      8.6vw,
      39px
    );

    line-height: 1.13;
  }

  .trajectory-supporting-copy {
    margin-top: 24px;

    font-size: 12px;
    line-height: 1.72;
  }

  .trajectory-coordinate {
    display: grid;
    grid-template-columns: 1fr;

    gap: 9px;

    margin-top: 26px;
  }

  .trajectory-coordinate span {
    white-space: normal;
  }

  .trajectory-path {
    grid-template-columns:
      31px
      minmax(0, 1fr);

    gap: 13px;

    padding: 25px 0;
  }

  .trajectory-path-index > div {
    min-height: 82px;
  }

  .trajectory-path-content h3 {
    font-size: clamp(
      21px,
      7vw,
      29px
    );
  }

  .trajectory-path-content p {
    margin-top: 13px;

    font-size: 11px;
    line-height: 1.62;
  }

  .trajectory-mission-list {
    grid-template-columns: 1fr;
  }

  .trajectory-mission {
    min-height: 0;

    padding:
      20px
      16px;
  }

  .trajectory-panel-header {
    padding:
      0
      15px;
  }

  .trajectory-panel-footer {
    min-height: 64px;

    padding:
      0
      15px;
  }

  .profile-links a {
    min-height: 76px;

    gap: 16px;
  }

  .profile-links a span {
    max-width: calc(
      100% - 38px
    );

    overflow: visible;
    text-overflow: unset;
    white-space: normal;

    line-height: 1.55;
  }

  .trajectory-signature {
    gap: 18px;
  }

  .trajectory-signature > div {
    flex-wrap: wrap;

    gap: 10px 20px;
  }
}

/* =========================================================
   VERY SMALL PHONE
   ========================================================= */

@media (max-width: 390px) {
  .trajectory-section {
    padding-inline: 12px;
  }

  .trajectory-path {
    grid-template-columns:
      27px
      minmax(0, 1fr);

    gap: 10px;
  }

  .trajectory-header-status {
    min-width: 0;
  }

  .trajectory-panel-header {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;

    gap: 5px;
  }
}
















/* =========================================================
   TRAJECTORY FOOTER OVERRIDE
   Laptop/Desktop first, responsive fallback included
   Paste at the VERY END of globals.css
   ========================================================= */

/* Hide the old coordinate row from its previous location */
.trajectory-coordinate {
  display: none !important;
}

/* Main footer layout */
.trajectory-footer {
  position: relative !important;
  inset: auto !important;

  width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  margin: 0 !important;

  display: grid !important;
  grid-template-columns:
    minmax(0, 1fr)
    minmax(250px, 0.34fr) !important;

  align-items: stretch !important;
  gap: clamp(26px, 3vw, 48px) !important;

  overflow: visible !important;
}

/* Left side: vertically stacked links */
.profile-links {
  position: relative !important;

  width: 100% !important;
  min-width: 0 !important;

  display: flex !important;
  flex-direction: column !important;

  gap: 0 !important;
}

.profile-links a {
  position: relative !important;

  width: 100% !important;
  min-height: clamp(48px, 5.8vh, 68px) !important;

  padding:
    0
    clamp(10px, 1.2vw, 18px) !important;

  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;

  gap: 16px !important;

  border-top: 1px solid
    rgba(113, 149, 220, 0.17) !important;

  border-right: 0 !important;
  border-left: 0 !important;
  border-bottom: 0 !important;

  background: transparent !important;

  transition:
    color 0.18s ease,
    background 0.18s ease,
    padding-left 0.18s ease !important;
}

.profile-links a:last-child {
  border-bottom: 1px solid
    rgba(113, 149, 220, 0.17) !important;
}

.profile-links a:hover {
  color: #ffffff !important;

  padding-left: clamp(
    16px,
    1.5vw,
    24px
  ) !important;

  background:
    linear-gradient(
      90deg,
      rgba(101, 138, 228, 0.08),
      transparent
    ) !important;
}

.profile-links a span {
  min-width: 0 !important;

  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;

  font-size: clamp(
    5px,
    0.5vw,
    7px
  ) !important;

  line-height: 1.4 !important;
  letter-spacing: 0.14em !important;
}

.profile-links a svg {
  flex: 0 0 auto !important;
}

/* Right side */
.trajectory-signature {
  position: relative !important;
  inset: auto !important;

  width: 100% !important;
  min-width: 0 !important;
  margin: 0 !important;

  display: grid !important;
  grid-template-rows:
    minmax(0, 1fr)
    auto !important;

  gap: clamp(14px, 1.7vh, 22px) !important;

  align-items: stretch !important;

  text-align: left !important;
}

/* New telemetry panel */
.trajectory-signature::before {
  content:
    "NAVIGATION TELEMETRY\A\A"
    "DESTINATION // UNKNOWN\A"
    "DIRECTION // FORWARD\A"
    "LIMIT // UNDEFINED";

  white-space: pre-line;

  min-height: 0 !important;

  padding:
    clamp(15px, 1.7vw, 22px) !important;

  display: block !important;

  color: #71819b !important;

  border: 1px solid
    rgba(113, 149, 220, 0.16) !important;

  background:
    linear-gradient(
      135deg,
      rgba(8, 14, 30, 0.72),
      rgba(4, 9, 20, 0.38)
    ) !important;

  font-size: clamp(
    5px,
    0.46vw,
    7px
  ) !important;

  font-weight: 800 !important;
  line-height: 2 !important;
  letter-spacing: 0.16em !important;

  box-shadow:
    inset 0 0 40px
      rgba(73, 104, 205, 0.025) !important;
}

/* Decorative corner */
.trajectory-signature::after {
  content: "";

  position: absolute;
  top: 0;
  right: 0;

  width: 38px;
  height: 38px;

  border-top: 1px solid
    rgba(132, 171, 255, 0.35);

  border-right: 1px solid
    rgba(132, 171, 255, 0.35);

  pointer-events: none;
}

/* Signature text */
.trajectory-signature > p {
  margin: 0 !important;

  color: #697892 !important;

  font-size: clamp(
    5px,
    0.45vw,
    7px
  ) !important;

  line-height: 1.5 !important;
  letter-spacing: 0.13em !important;
}

.trajectory-signature > div {
  width: 100% !important;

  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;

  gap: 16px !important;
}

/* Short laptop screens */
@media (
  min-width: 901px
) and (
  max-height: 820px
) {
  .trajectory-footer {
    gap: 24px !important;
  }

  .profile-links a {
    min-height: 44px !important;
  }

  .trajectory-signature {
    gap: 10px !important;
  }

  .trajectory-signature::before {
    padding:
      12px
      15px !important;

    line-height: 1.72 !important;
  }
}

/* Tablet and mobile fallback */
@media (max-width: 900px) {
  .trajectory-footer {
    grid-template-columns: 1fr !important;

    gap: 30px !important;
  }

  .profile-links a {
    min-height: 72px !important;
  }

  .trajectory-signature::before {
    min-height: 128px !important;

    padding: 20px !important;

    font-size: 6px !important;
    line-height: 2 !important;
  }
}

/* Phone */
@media (max-width: 600px) {
  .trajectory-footer {
    gap: 26px !important;
  }

  .profile-links a {
    min-height: 68px !important;

    padding-inline: 2px !important;
  }

  .profile-links a span {
    max-width: calc(
      100% - 40px
    ) !important;

    white-space: normal !important;
    overflow: visible !important;
    text-overflow: unset !important;

    font-size: 6px !important;
    line-height: 1.5 !important;
  }

  .trajectory-signature::before {
    min-height: 118px !important;

    padding:
      17px
      15px !important;
  }

  .trajectory-signature > div {
    flex-wrap: wrap !important;

    gap:
      8px
      18px !important;
  }
}
      `}</style>
    </main>
  );
}
