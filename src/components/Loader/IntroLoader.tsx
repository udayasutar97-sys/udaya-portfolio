"use client";

import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  useEffect,
  useState,
} from "react";

const bootMessages = [
  "INITIALIZING UDAYA.SYS",
  "LOADING NEURAL CORE",
  "SYNCING QUANTUM MODULES",
  "ESTABLISHING ORBITAL NETWORK",
  "RENDERING DIGITAL UNIVERSE",
  "SYSTEM READY",
];

export default function IntroLoader() {
  const [messageIndex, setMessageIndex] =
    useState(0);

  const [progress, setProgress] =
    useState(0);

  const [isVisible, setIsVisible] =
    useState(true);

  useEffect(() => {
    document.body.classList.add(
      "loader-active",
    );

    const progressInterval =
      window.setInterval(() => {
        setProgress((current) => {
          const increase =
            Math.random() * 8 + 3;

          return Math.min(
            current + increase,
            100,
          );
        });
      }, 150);

    const messageInterval =
      window.setInterval(() => {
        setMessageIndex((current) =>
          Math.min(
            current + 1,
            bootMessages.length - 1,
          ),
        );
      }, 520);

    const finishTimeout =
      window.setTimeout(() => {
        setProgress(100);

        setMessageIndex(
          bootMessages.length - 1,
        );
      }, 2600);

    const hideTimeout =
      window.setTimeout(() => {
        setIsVisible(false);

        document.body.classList.remove(
          "loader-active",
        );
      }, 3300);

    return () => {
      window.clearInterval(
        progressInterval,
      );

      window.clearInterval(
        messageInterval,
      );

      window.clearTimeout(
        finishTimeout,
      );

      window.clearTimeout(
        hideTimeout,
      );

      document.body.classList.remove(
        "loader-active",
      );
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="intro-loader"
          initial={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(14px)",
          }}
          transition={{
            duration: 0.9,
            ease: [
              0.76,
              0,
              0.24,
              1,
            ],
          }}
        >
          <div className="loader-grid" />
          <div className="loader-scanline" />

          <motion.div
            className="loader-core"
            initial={{
              scale: 0.4,
              opacity: 0,
            }}
            animate={{
              scale: [
                0.4,
                1,
                0.88,
                1,
              ],
              opacity: 1,
            }}
            transition={{
              duration: 1.4,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            <div className="loader-orbit loader-orbit-one" />
            <div className="loader-orbit loader-orbit-two" />
            <div className="loader-orbit loader-orbit-three" />

            <motion.div
              className="loader-energy"
              animate={{
                scale: [
                  0.88,
                  1.12,
                  0.94,
                  1.08,
                  0.88,
                ],
                opacity: [
                  0.55,
                  1,
                  0.72,
                  1,
                  0.55,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          <div className="loader-interface">
            <div className="loader-heading">
              <span>
                UDAYA.SYS
              </span>

              <span>
                BOOT SEQUENCE
              </span>
            </div>

            <div className="loader-message-window">
              <AnimatePresence mode="wait">
                <motion.p
                  key={
                    bootMessages[
                      messageIndex
                    ]
                  }
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                >
                  {
                    bootMessages[
                      messageIndex
                    ]
                  }

                  <motion.span
                    animate={{
                      opacity: [
                        0,
                        1,
                        0,
                      ],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                    }}
                  >
                    _
                  </motion.span>
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="loader-progress-area">
              <div className="loader-progress-meta">
                <span>
                  CORE INITIALISATION
                </span>

                <span>
                  {Math.round(
                    progress,
                  )
                    .toString()
                    .padStart(
                      3,
                      "0",
                    )}
                  %
                </span>
              </div>

              <div className="loader-progress-track">
                <motion.div
                  className="loader-progress-fill"
                  animate={{
                    width: `${progress}%`,
                  }}
                  transition={{
                    duration: 0.18,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>

            <div className="loader-diagnostics">
              <span>
                MEMORY // ONLINE
              </span>

              <span>
                QUANTUM // SYNCED
              </span>

              <span>
                ORBITAL LINK // STABLE
              </span>
            </div>
          </div>

          <div className="loader-corner loader-corner-one" />
          <div className="loader-corner loader-corner-two" />
          <div className="loader-corner loader-corner-three" />
          <div className="loader-corner loader-corner-four" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}