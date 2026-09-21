"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { PortalRole } from "@/lib/portal-types";
import { getTourSteps, type TourStep } from "./steps";

const SEEN_KEY = "twt_portal_tour_seen_v1";

interface TourContextValue {
  isOpen: boolean;
  step: TourStep | null;
  stepIndex: number;
  stepCount: number;
  start: () => void;
  next: () => void;
  back: () => void;
  skip: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}

export function TourProvider({
  role,
  children,
  stepsOverride,
}: {
  role: PortalRole;
  children: React.ReactNode;
  /** Testing/preview hook only — overrides the role-derived step list. */
  stepsOverride?: TourStep[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const steps = useMemo(() => stepsOverride ?? getTourSteps(role), [role, stepsOverride]);
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Deferred to an effect (rather than a lazy useState initializer) so the
    // client's first render matches the server-rendered HTML before flipping
    // isOpen based on client-only localStorage state.
    try {
      const seen = window.localStorage.getItem(SEEN_KEY);
      if (!seen) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsOpen(true);
      }
    } catch {
      // localStorage unavailable (private browsing, etc.) — skip auto-start.
    }
  }, []);

  const markSeen = useCallback(() => {
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  const step = isOpen ? steps[stepIndex] ?? null : null;

  useEffect(() => {
    if (!step?.path || step.path === pathname) return;
    router.push(step.path);
  }, [step, pathname, router]);

  const start = useCallback(() => {
    setStepIndex(0);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    markSeen();
  }, [markSeen]);

  const next = useCallback(() => {
    setStepIndex((i) => {
      if (i + 1 >= steps.length) {
        close();
        return i;
      }
      return i + 1;
    });
  }, [steps.length, close]);

  const back = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const skip = useCallback(() => {
    close();
  }, [close]);

  const value = useMemo<TourContextValue>(
    () => ({
      isOpen,
      step,
      stepIndex,
      stepCount: steps.length,
      start,
      next,
      back,
      skip,
    }),
    [isOpen, step, stepIndex, steps.length, start, next, back, skip]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}
