"use client";

import {
  Atom,
  Info,
  MousePointer2,
  Move,
  Orbit,
  RotateCcw,
  Satellite,
  Sparkles,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const instructions = [
  {
    icon: Move,
    action: "DRAG SPACE",
    description:
      "Hold and drag anywhere in the scene to rotate and move through the orbital environment.",
  },
  {
    icon: MousePointer2,
    action: "MOVE CURSOR",
    description:
      "Move the cursor around the screen to create camera, planet, satellite and particle parallax.",
  },
  {
    icon: RotateCcw,
    action: "DOUBLE CLICK",
    description:
      "Double-click the space scene to reset the universe view and return the system to its centred position.",
  },
  {
    icon: Orbit,
    action: "SELECT PLANET",
    description:
      "Click the central planet to begin the camera flight and open the interactive project world.",
  },
  {
    icon: Atom,
    action: "QUANTUM CORE",
    description:
      "Click the Quantum Core panel to cycle between Stable, Overdrive and Quantum universe modes.",
  },
  {
    icon: Satellite,
    action: "SIGNAL PANEL",
    description:
      "Click the signal tile to switch the orbital network and activate the satellite swarm.",
  },
  {
    icon: Sparkles,
    action: "PROJECT NODES",
    description:
      "Inside the planet world, select glowing nodes to inspect individual projects and open their records.",
  },
  {
    icon: Move,
    action: "DRAG HUD",
    description:
      "The floating HUD tiles can be dragged and repositioned anywhere within the hero interface.",
  },
];

function isTabletDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent =
    navigator.userAgent.toLowerCase();

  const platform =
    navigator.platform?.toLowerCase() ?? "";

  const touchPoints =
    navigator.maxTouchPoints ?? 0;

  const hasFinePointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

  /*
   * Modern iPads often identify as Macintosh
   * while still exposing multiple touch points.
   */
  const isModernIPad =
    platform.includes("mac") &&
    touchPoints > 1;

  const isClassicIPad =
    userAgent.includes("ipad");

  const isAndroidTablet =
    userAgent.includes("android") &&
    !userAgent.includes("mobile");

  const isAmazonTablet =
    /kindle|silk|kfapwi|kftt|kfthwi|kfthwa|kfapwa|kfsa/i.test(
      userAgent,
    );

  const isTouchOnlyWindowsTablet =
    userAgent.includes("windows") &&
    touchPoints > 1 &&
    !hasFinePointer;

  return (
    isModernIPad ||
    isClassicIPad ||
    isAndroidTablet ||
    isAmazonTablet ||
    isTouchOnlyWindowsTablet
  );
}

export default function DesktopInstructions() {
  const [isDesktop, setIsDesktop] =
    useState(false);

  const [isOpen, setIsOpen] =
    useState(false);

  const hasInitialised =
    useRef(false);

  const previousBodyOverflow =
    useRef("");

  const closeInstructions =
    useCallback(() => {
      setIsOpen(false);
    }, []);

  const toggleInstructions =
    useCallback(() => {
      setIsOpen(
        (currentOpenState) =>
          !currentOpenState,
      );
    }, []);

  useEffect(() => {
    const desktopQuery =
      window.matchMedia(
        [
          "(min-width: 901px)",
          "(hover: hover)",
          "(pointer: fine)",
        ].join(" and "),
      );

    const updateDesktopState = () => {
      const desktop =
        desktopQuery.matches &&
        !isTabletDevice();

      setIsDesktop(desktop);

      /*
       * Open automatically once after every
       * page load or reload on laptop/desktop.
       */
      if (
        desktop &&
        !hasInitialised.current
      ) {
        hasInitialised.current = true;
        setIsOpen(true);
      }

      /*
       * Remove the panel and blur immediately
       * when switching to tablet/mobile.
       */
      if (!desktop) {
        setIsOpen(false);

        document.body.classList.remove(
          "desktop-instructions-open",
        );

        document.documentElement.classList.remove(
          "desktop-instructions-open",
        );
      }
    };

    updateDesktopState();

    desktopQuery.addEventListener(
      "change",
      updateDesktopState,
    );

    window.addEventListener(
      "resize",
      updateDesktopState,
    );

    window.addEventListener(
      "orientationchange",
      updateDesktopState,
    );

    return () => {
      desktopQuery.removeEventListener(
        "change",
        updateDesktopState,
      );

      window.removeEventListener(
        "resize",
        updateDesktopState,
      );

      window.removeEventListener(
        "orientationchange",
        updateDesktopState,
      );

      document.body.classList.remove(
        "desktop-instructions-open",
      );

      document.documentElement.classList.remove(
        "desktop-instructions-open",
      );
    };
  }, []);

  /*
   * Important:
   * This restores your original blur class name.
   */
  useEffect(() => {
    const shouldBlurBackground =
      isDesktop && isOpen;

    document.body.classList.toggle(
      "desktop-instructions-open",
      shouldBlurBackground,
    );

    document.documentElement.classList.toggle(
      "desktop-instructions-open",
      shouldBlurBackground,
    );

    return () => {
      document.body.classList.remove(
        "desktop-instructions-open",
      );

      document.documentElement.classList.remove(
        "desktop-instructions-open",
      );
    };
  }, [isDesktop, isOpen]);

  /*
   * Keep the page fixed while the guide is open.
   */
  useEffect(() => {
    if (!isDesktop || !isOpen) {
      return;
    }

    previousBodyOverflow.current =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousBodyOverflow.current;
    };
  }, [isDesktop, isOpen]);

  /*
   * Close with Escape.
   */
  useEffect(() => {
    if (!isDesktop || !isOpen) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        closeInstructions();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [
    closeInstructions,
    isDesktop,
    isOpen,
  ]);

  if (!isDesktop) {
    return null;
  }

  return (
    <div
      className={[
        "desktop-instructions",
        isOpen
          ? "desktop-instructions-open"
          : "desktop-instructions-closed",
      ].join(" ")}
    >
      <button
        type="button"
        className="desktop-instruction-backdrop"
        aria-label="Close interaction guide"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        onClick={closeInstructions}
      />

      <section
        id="desktop-instruction-panel"
        className="desktop-instruction-bubble"
        role="dialog"
        aria-modal="true"
        aria-label="Universe interaction guide"
        aria-hidden={!isOpen}
      >
        <div
          className="desktop-instruction-glow"
          aria-hidden="true"
        />

        <div
          className="desktop-instruction-grid"
          aria-hidden="true"
        />

        <header className="desktop-instruction-header">
          <div className="desktop-instruction-heading">
            <span className="desktop-instruction-heading-icon">
              <Info
                size={14}
                strokeWidth={1.8}
              />
            </span>

            <div>
              <small>
                UDAYA.SYS / INTERFACE GUIDE
              </small>

              <strong>
                UNIVERSE CONTROLS
              </strong>
            </div>
          </div>

          <span className="desktop-instruction-status">
            <i />
            ACTIVE
          </span>
        </header>

        <p className="desktop-instruction-intro">
          Explore the interface using
          your mouse. Every major visual
          system is interactive.
        </p>

        <div className="desktop-instruction-list">
          {instructions.map(
            ({
              icon: InstructionIcon,
              action,
              description,
            }) => (
              <article
                className="desktop-instruction-row"
                key={action}
              >
                <span className="desktop-instruction-row-icon">
                  <InstructionIcon
                    size={13}
                    strokeWidth={1.65}
                  />
                </span>

                <div className="desktop-instruction-row-copy">
                  <strong>
                    {action}
                  </strong>

                  <p>
                    {description}
                  </p>
                </div>
              </article>
            ),
          )}
        </div>

        <footer className="desktop-instruction-footer">
          <span>
            PRESS ESC TO CLOSE
          </span>

          <span>
            INTERFACE // ONLINE
          </span>
        </footer>
      </section>

      <button
        type="button"
        className="desktop-instruction-toggle"
        aria-label={
          isOpen
            ? "Close interaction guide"
            : "Open interaction guide"
        }
        aria-expanded={isOpen}
        aria-controls="desktop-instruction-panel"
        onClick={toggleInstructions}
      >
        <span
          className="desktop-instruction-toggle-ring"
          aria-hidden="true"
        />

        <span className="desktop-instruction-toggle-icon">
          {isOpen ? (
            <X
              size={19}
              strokeWidth={1.8}
            />
          ) : (
            <Info
              size={18}
              strokeWidth={1.8}
            />
          )}
        </span>
      </button>
    </div>
  );
}