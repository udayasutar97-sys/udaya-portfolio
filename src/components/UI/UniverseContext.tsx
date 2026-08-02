"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CoreMode =
  | "STABLE"
  | "OVERDRIVE"
  | "QUANTUM";

export type OrbitalMode =
  | "CALM"
  | "ACTIVE"
  | "SWARM";

export type ProjectTransitionSource =
  | "carousel"
  | "planet";

export type ProjectTransitionRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type ProjectTransition = {
  source: ProjectTransitionSource;
  originRect: ProjectTransitionRect;
};

type OpenProjectOptions = {
  source: ProjectTransitionSource;
  originRect: ProjectTransitionRect;
};

type UniverseContextValue = {
  coreMode: CoreMode;
  orbitalMode: OrbitalMode;

  planetPortalOpen: boolean;
  selectedProject: string | null;
  projectTransition: ProjectTransition | null;

  setCoreMode: (mode: CoreMode) => void;
  setOrbitalMode: (mode: OrbitalMode) => void;

  cycleCoreMode: () => void;
  cycleOrbitalMode: () => void;

  openPlanetPortal: () => void;
  closePlanetPortal: () => void;

  openProject: (
    projectId: string,
    options?: OpenProjectOptions,
  ) => void;

  closeProject: () => void;
  clearProjectTransition: () => void;
};

const UniverseContext =
  createContext<UniverseContextValue | null>(
    null,
  );

export function UniverseProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [coreMode, setCoreMode] =
    useState<CoreMode>("STABLE");

  const [orbitalMode, setOrbitalMode] =
    useState<OrbitalMode>("ACTIVE");

  const [
    planetPortalOpen,
    setPlanetPortalOpen,
  ] = useState(false);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState<string | null>(null);

  const [
    projectTransition,
    setProjectTransition,
  ] = useState<ProjectTransition | null>(
    null,
  );

  const cycleCoreMode = useCallback(() => {
    setCoreMode((current) => {
      if (current === "STABLE") {
        return "OVERDRIVE";
      }

      if (current === "OVERDRIVE") {
        return "QUANTUM";
      }

      return "STABLE";
    });
  }, []);

  const cycleOrbitalMode =
    useCallback(() => {
      setOrbitalMode((current) => {
        if (current === "CALM") {
          return "ACTIVE";
        }

        if (current === "ACTIVE") {
          return "SWARM";
        }

        return "CALM";
      });
    }, []);

  const openPlanetPortal =
    useCallback(() => {
      setPlanetPortalOpen(true);
      setSelectedProject(null);
      setProjectTransition(null);

      document.body.classList.add(
        "planet-portal-active",
      );
    }, []);

  const closePlanetPortal =
    useCallback(() => {
      setPlanetPortalOpen(false);
      setSelectedProject(null);
      setProjectTransition(null);

      document.body.classList.remove(
        "planet-portal-active",
      );
    }, []);

  const openProject = useCallback(
    (
      projectId: string,
      options?: OpenProjectOptions,
    ) => {
      
      if (options) {
        setProjectTransition({
          source: options.source,
          originRect: {
            top: options.originRect.top,
            left: options.originRect.left,
            width: options.originRect.width,
            height: options.originRect.height,
          },
        });
      }

      setSelectedProject(projectId);
    },
    [],
  );

  const closeProject = useCallback(() => {
    
    setSelectedProject(null);
  }, []);

  const clearProjectTransition =
    useCallback(() => {
      setProjectTransition(null);
    }, []);

  const value = useMemo(
    () => ({
      coreMode,
      orbitalMode,

      planetPortalOpen,
      selectedProject,
      projectTransition,

      setCoreMode,
      setOrbitalMode,

      cycleCoreMode,
      cycleOrbitalMode,

      openPlanetPortal,
      closePlanetPortal,

      openProject,
      closeProject,
      clearProjectTransition,
    }),
    [
      coreMode,
      orbitalMode,
      planetPortalOpen,
      selectedProject,
      projectTransition,
      cycleCoreMode,
      cycleOrbitalMode,
      openPlanetPortal,
      closePlanetPortal,
      openProject,
      closeProject,
      clearProjectTransition,
    ],
  );

  return (
    <UniverseContext.Provider value={value}>
      {children}
    </UniverseContext.Provider>
  );
}

export function useUniverse() {
  const context = useContext(
    UniverseContext,
  );

  if (!context) {
    throw new Error(
      "useUniverse must be used inside UniverseProvider",
    );
  }

  return context;
}
