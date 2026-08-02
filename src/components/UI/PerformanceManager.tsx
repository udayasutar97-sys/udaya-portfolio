"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type QualityLevel =
  | "high"
  | "balanced"
  | "low";

type PerformanceContextValue = {
  quality: QualityLevel;
  isPageVisible: boolean;
  reducedMotion: boolean;
  isCoarsePointer: boolean;
};

const PerformanceContext =
  createContext<PerformanceContextValue | null>(
    null,
  );

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
};

function detectInitialQuality(): QualityLevel {
  if (typeof window === "undefined") {
    return "balanced";
  }

  const navigatorWithMemory =
    navigator as NavigatorWithMemory;

  /*
   * Do not assume missing deviceMemory means 4 GB.
   * Safari and some privacy-focused browsers do not
   * expose this property at all.
   */
  const memory =
    typeof navigatorWithMemory.deviceMemory ===
    "number"
      ? navigatorWithMemory.deviceMemory
      : null;

  const cores =
    typeof navigator.hardwareConcurrency ===
    "number"
      ? navigator.hardwareConcurrency
      : null;

  const coarsePointer = window.matchMedia(
    "(pointer: coarse)",
  ).matches;

  const narrowScreen =
    window.innerWidth < 768;

  const tabletWidth =
    window.innerWidth < 1100;

  /*
   * Phones should use the lightweight scene.
   * A touch-enabled laptop is not automatically
   * treated as a low-performance device.
   */
  if (narrowScreen) {
    return "low";
  }

  /*
   * Tablets receive balanced quality.
   */
  if (coarsePointer || tabletWidth) {
    return "balanced";
  }

  /*
   * Only classify a desktop as low quality when
   * the browser provides actual hardware values
   * and both indicate genuinely limited hardware.
   */
  if (
    memory !== null &&
    cores !== null &&
    memory <= 4 &&
    cores <= 4
  ) {
    return "low";
  }

  /*
   * Normal desktop and laptop screens receive
   * full visual quality.
   */
  if (window.innerWidth >= 1100) {
    return "high";
  }

  return "balanced";
}

export function PerformanceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [quality, setQuality] =
    useState<QualityLevel>("balanced");

  const [isPageVisible, setIsPageVisible] =
    useState(true);

  const [reducedMotion, setReducedMotion] =
    useState(false);

  const [
    isCoarsePointer,
    setIsCoarsePointer,
  ] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const pointerQuery = window.matchMedia(
      "(pointer: coarse)",
    );

    const updateEnvironment = () => {
      setReducedMotion(
        motionQuery.matches,
      );

      setIsCoarsePointer(
        pointerQuery.matches,
      );

      setQuality(
        detectInitialQuality(),
      );
    };

    const handleVisibilityChange = () => {
      setIsPageVisible(
        !document.hidden,
      );
    };

    updateEnvironment();
    handleVisibilityChange();

    motionQuery.addEventListener(
      "change",
      updateEnvironment,
    );

    pointerQuery.addEventListener(
      "change",
      updateEnvironment,
    );

    window.addEventListener(
      "resize",
      updateEnvironment,
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      motionQuery.removeEventListener(
        "change",
        updateEnvironment,
      );

      pointerQuery.removeEventListener(
        "change",
        updateEnvironment,
      );

      window.removeEventListener(
        "resize",
        updateEnvironment,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);

  const value = useMemo(
    () => ({
      quality,
      isPageVisible,
      reducedMotion,
      isCoarsePointer,
    }),
    [
      quality,
      isPageVisible,
      reducedMotion,
      isCoarsePointer,
    ],
  );

  return (
    <PerformanceContext.Provider
      value={value}
    >
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(
    PerformanceContext,
  );

  if (!context) {
    throw new Error(
      "usePerformance must be used inside PerformanceProvider",
    );
  }

  return context;
}