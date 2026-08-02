"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type QualityLevel = "high" | "balanced" | "low";

type PerformanceContextValue = {
  quality: QualityLevel;
  isPageVisible: boolean;
  reducedMotion: boolean;
  isCoarsePointer: boolean;
};

const PerformanceContext =
  createContext<PerformanceContextValue | null>(null);

function detectInitialQuality(): QualityLevel {
  if (typeof window === "undefined") {
    return "balanced";
  }

  const memory =
    "deviceMemory" in navigator
      ? Number(
          (
            navigator as Navigator & {
              deviceMemory?: number;
            }
          ).deviceMemory ?? 4,
        )
      : 4;

  const cores = navigator.hardwareConcurrency ?? 4;

  const isMobile =
    window.matchMedia("(pointer: coarse)").matches ||
    window.innerWidth < 768;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion || isMobile || memory <= 4 || cores <= 4) {
    return "low";
  }

  if (memory >= 8 && cores >= 8 && window.innerWidth >= 1280) {
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

  const [isCoarsePointer, setIsCoarsePointer] =
    useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const pointerQuery = window.matchMedia(
      "(pointer: coarse)",
    );

    const updateEnvironment = () => {
      setReducedMotion(motionQuery.matches);
      setIsCoarsePointer(pointerQuery.matches);
      setQuality(detectInitialQuality());
    };

    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
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
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);

  if (!context) {
    throw new Error(
      "usePerformance must be used inside PerformanceProvider",
    );
  }

  return context;
}