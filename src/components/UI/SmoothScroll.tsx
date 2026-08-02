"use client";

import Lenis from "lenis";
import {
  type ReactNode,
  useEffect,
} from "react";
import { usePerformance } from "@/components/UI/PerformanceManager";

type SmoothScrollProps = {
  children: ReactNode;
};

const SECTION_IDS = [
  "home",
  "projects",
  "about",
  "achievements",
  "trajectory",
] as const;


const WHEEL_THRESHOLD = 34;


const GESTURE_RESET_DELAY = 180;


const HIGH_QUALITY_DURATION = 1.55;
const MEDIUM_QUALITY_DURATION = 1.3;

const sectionEase = (value: number) => {
  return 1 - Math.pow(1 - value, 4);
};

function isEditableTarget(
  target: EventTarget | null,
) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'input, textarea, select, button, [contenteditable="true"]',
    ),
  );
}

function canScrollInsideElement(
  target: EventTarget | null,
  direction: number,
) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  let element: HTMLElement | null = target;

  while (
    element &&
    element !== document.body &&
    element !== document.documentElement
  ) {
    const styles =
      window.getComputedStyle(element);

    const scrollableOverflow =
      styles.overflowY === "auto" ||
      styles.overflowY === "scroll";

    const hasOverflow =
      element.scrollHeight >
      element.clientHeight + 2;

    if (
      scrollableOverflow &&
      hasOverflow
    ) {
      const canMoveDown =
        direction > 0 &&
        element.scrollTop +
          element.clientHeight <
          element.scrollHeight - 2;

      const canMoveUp =
        direction < 0 &&
        element.scrollTop > 2;

      if (canMoveDown || canMoveUp) {
        return true;
      }
    }

    element = element.parentElement;
  }

  return false;
}

export default function SmoothScroll({
  children,
}: SmoothScrollProps) {
  const {
    quality,
    reducedMotion,
    isCoarsePointer,
    isPageVisible,
  } = usePerformance();

  useEffect(() => {
    const shouldUseSectionScrolling =
      quality !== "low" &&
      !reducedMotion &&
      !isCoarsePointer;

    if (!shouldUseSectionScrolling) {
      return;
    }

    const lenis = new Lenis({
      duration:
        quality === "high"
          ? 1.05
          : 0.85,

      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      infinite: false,
    });

    let animationFrameId = 0;

    let isTransitioning = false;
    let accumulatedWheelDelta = 0;
    let gestureResetTimer:
      | number
      | null = null;

    const getSections = () => {
      return SECTION_IDS.map((id) =>
        document.getElementById(id),
      ).filter(
        (
          section,
        ): section is HTMLElement =>
          section !== null,
      );
    };

    const clearGestureResetTimer = () => {
      if (gestureResetTimer !== null) {
        window.clearTimeout(
          gestureResetTimer,
        );

        gestureResetTimer = null;
      }
    };

    const resetWheelGesture = () => {
      accumulatedWheelDelta = 0;
      clearGestureResetTimer();
    };

    const interfaceBlocksScrolling = () => {
      return Boolean(
        document.body.classList.contains(
          "project-experience-active",
        ) ||
          document.querySelector(
            ".planet-portal",
          ) ||
          document.querySelector(
            ".project-experience",
          ),
      );
    };

    const findCurrentSectionIndex = (
      sections: HTMLElement[],
    ) => {
      const viewportReference =
        window.scrollY +
        window.innerHeight * 0.42;

      let currentIndex = 0;
      let smallestDistance =
        Number.POSITIVE_INFINITY;

      sections.forEach(
        (section, index) => {
          const sectionReference =
            section.offsetTop +
            Math.min(
              section.offsetHeight,
              window.innerHeight,
            ) *
              0.42;

          const distance = Math.abs(
            sectionReference -
              viewportReference,
          );

          if (
            distance < smallestDistance
          ) {
            smallestDistance = distance;
            currentIndex = index;
          }
        },
      );

      return currentIndex;
    };

    const scrollToSection = (
      targetIndex: number,
    ) => {
      const sections = getSections();

      if (sections.length === 0) {
        return;
      }

      const boundedIndex = Math.max(
        0,
        Math.min(
          targetIndex,
          sections.length - 1,
        ),
      );

      const targetSection =
        sections[boundedIndex];

      isTransitioning = true;
      resetWheelGesture();

      lenis.scrollTo(targetSection, {
        offset: 0,

        duration:
          quality === "high"
            ? HIGH_QUALITY_DURATION
            : MEDIUM_QUALITY_DURATION,

        easing: sectionEase,

        lock: true,
        force: true,

        onComplete: () => {
          
          window.scrollTo({
            top: targetSection.offsetTop,
            behavior: "auto",
          });

          isTransitioning = false;
          resetWheelGesture();
        },
      });
    };

    const moveByDirection = (
      direction: 1 | -1,
    ) => {
      if (
        isTransitioning ||
        interfaceBlocksScrolling()
      ) {
        return;
      }

      const sections = getSections();

      if (sections.length === 0) {
        return;
      }

      const currentIndex =
        findCurrentSectionIndex(sections);

      const targetIndex =
        currentIndex + direction;

      if (
        targetIndex < 0 ||
        targetIndex >= sections.length
      ) {
        
        scrollToSection(currentIndex);
        return;
      }

      scrollToSection(targetIndex);
    };

    const handleWheel = (
      event: WheelEvent,
    ) => {
      if (
        interfaceBlocksScrolling()
      ) {
        resetWheelGesture();
        return;
      }

      const direction =
        Math.sign(event.deltaY);

      if (direction === 0) {
        return;
      }

      if (
        canScrollInsideElement(
          event.target,
          direction,
        )
      ) {
        resetWheelGesture();
        return;
      }

      
      event.preventDefault();

      if (isTransitioning) {
        return;
      }

      
      if (
        accumulatedWheelDelta !== 0 &&
        Math.sign(
          accumulatedWheelDelta,
        ) !== direction
      ) {
        accumulatedWheelDelta = 0;
      }

      accumulatedWheelDelta +=
        event.deltaY;

      clearGestureResetTimer();

      gestureResetTimer =
        window.setTimeout(() => {
          accumulatedWheelDelta = 0;
          gestureResetTimer = null;
        }, GESTURE_RESET_DELAY);

      if (
        Math.abs(
          accumulatedWheelDelta,
        ) < WHEEL_THRESHOLD
      ) {
        return;
      }

      const movementDirection:
        | 1
        | -1 =
        accumulatedWheelDelta > 0
          ? 1
          : -1;

      resetWheelGesture();
      moveByDirection(
        movementDirection,
      );
    };

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        isEditableTarget(
          event.target,
        ) ||
        interfaceBlocksScrolling()
      ) {
        return;
      }

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        moveByDirection(1);
        return;
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp"
      ) {
        event.preventDefault();
        moveByDirection(-1);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        scrollToSection(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();

        scrollToSection(
          getSections().length - 1,
        );
      }
    };

    const handleAnchorClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target instanceof Element
          ? event.target
          : null;

      const anchor =
        target?.closest<HTMLAnchorElement>(
          'a[href^="#"]',
        );

      if (!anchor) {
        return;
      }

      const href =
        anchor.getAttribute("href");

      if (
        !href ||
        href === "#"
      ) {
        return;
      }

      const destination =
        document.querySelector<HTMLElement>(
          href,
        );

      if (!destination) {
        return;
      }

      const sections = getSections();

      const destinationIndex =
        sections.indexOf(destination);

      if (destinationIndex < 0) {
        return;
      }

      event.preventDefault();

      scrollToSection(
        destinationIndex,
      );

      window.history.replaceState(
        null,
        "",
        href,
      );
    };

    const handleResize = () => {
      if (isTransitioning) {
        return;
      }

      const sections = getSections();

      if (sections.length === 0) {
        return;
      }

      const currentIndex =
        findCurrentSectionIndex(
          sections,
        );

      
      window.scrollTo({
        top:
          sections[currentIndex]
            .offsetTop,
        behavior: "auto",
      });
    };

    const frame = (time: number) => {
      if (isPageVisible) {
        lenis.raf(time);
      }

      animationFrameId =
        window.requestAnimationFrame(
          frame,
        );
    };

    
    window.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
        capture: true,
      },
    );

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    window.addEventListener(
      "resize",
      handleResize,
    );

    document.addEventListener(
      "click",
      handleAnchorClick,
    );

    animationFrameId =
      window.requestAnimationFrame(
        frame,
      );

    return () => {
      resetWheelGesture();

      window.cancelAnimationFrame(
        animationFrameId,
      );

      window.removeEventListener(
        "wheel",
        handleWheel,
        {
          capture: true,
        },
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      window.removeEventListener(
        "resize",
        handleResize,
      );

      document.removeEventListener(
        "click",
        handleAnchorClick,
      );

      lenis.destroy();
    };
  }, [
    quality,
    reducedMotion,
    isCoarsePointer,
    isPageVisible,
  ]);

  return <>{children}</>;
}