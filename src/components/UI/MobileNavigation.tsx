"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

const navigation = [
  {
    number: "01",
    label: "HOME",
    target: "home",
  },
  {
    number: "02",
    label: "PROJECTS",
    target: "projects",
  },
  {
    number: "03",
    label: "ABOUT",
    target: "about",
  },
  {
    number: "04",
    label: "ACHIEVEMENTS",
    target: "achievements",
  },
  {
    number: "05",
    label: "TRAJECTORY",
    target: "trajectory",
  },
];

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function navigate(id: string) {
    setOpen(false);

    setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 320);
  }

  return (
    <>
      {}

      <div className="mobile-navigation">
        <AnimatePresence>
  {!open && (
    <motion.button
      className="mobile-navigation-button"
      whileTap={{ scale: 0.94 }}
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      onClick={() => setOpen(true)}
    >
      <Menu size={22} />
    </motion.button>
  )}
</AnimatePresence>

        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="mobile-navigation-overlay"
                initial={{
                  clipPath:
                    "circle(34px at calc(100% - 36px) 36px)",
                }}
                animate={{
                  clipPath:
                    "circle(170% at calc(100% - 36px) 36px)",
                }}
                exit={{
                  clipPath:
                    "circle(34px at calc(100% - 36px) 36px)",
                }}
                transition={{
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <button
                  className="mobile-navigation-close"
                  onClick={() => setOpen(false)}
                >
                  <X size={24} />
                </button>

                <motion.div
                  className="mobile-navigation-content"
                  initial={{
                    opacity: 0,
                    y: 24,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 24,
                  }}
                  transition={{
                    delay: 0.15,
                    duration: 0.45,
                  }}
                >
                  <p>
                    UDAYA.SYS 
                  </p>

                  {navigation.map(
                    (item, index) => (
                      <motion.button
                        key={item.target}
                        onClick={() =>
                          navigate(item.target)
                        }
                        initial={{
                          opacity: 0,
                          x: -25,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        transition={{
                          delay:
                            0.2 +
                            index * 0.06,
                        }}
                      >
                        <span>
                          {item.number}
                        </span>

                        <strong>
                          {item.label}
                        </strong>
                      </motion.button>
                    ),
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}