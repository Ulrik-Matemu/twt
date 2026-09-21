"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTour } from "./TourProvider";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Bounds {
  top: number;
  bottom: number;
}

const CARD_MAX_WIDTH = 320;
const CARD_MARGIN = 16;
const CARD_ESTIMATED_HEIGHT = 170;

function findVisibleTarget(id: string): HTMLElement | null {
  const candidates = document.querySelectorAll<HTMLElement>(`[data-tour-id="${id}"]`);
  for (const el of candidates) {
    if (el.offsetParent !== null || el === document.body) return el;
  }
  return null;
}

function measureRect(el: HTMLElement): Rect {
  const box = el.getBoundingClientRect();
  return { top: box.top, left: box.left, width: box.width, height: box.height };
}

// Reserves space for the fixed mobile header/bottom-nav (tagged with
// data-tour-chrome) so the tooltip never renders underneath them — measured
// from the real DOM rather than hardcoded, so it tracks any future redesign
// and is a no-op on desktop where that chrome is hidden.
function getViewportBounds(): Bounds {
  let top = 0;
  let bottom = 0;

  const topChrome = document.querySelector<HTMLElement>('[data-tour-chrome="top"]');
  if (topChrome && topChrome.offsetParent !== null) {
    top = topChrome.getBoundingClientRect().bottom;
  }

  const bottomChrome = document.querySelector<HTMLElement>('[data-tour-chrome="bottom"]');
  if (bottomChrome && bottomChrome.offsetParent !== null) {
    bottom = window.innerHeight - bottomChrome.getBoundingClientRect().top;
  }

  return { top, bottom };
}

export default function TourOverlay() {
  const { isOpen, step, stepIndex, stepCount, next, back, skip } = useTour();
  const [rect, setRect] = useState<Rect | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!isOpen || !step) return;

    let attempts = 0;
    let cancelled = false;
    let settleTimeout: ReturnType<typeof setTimeout> | undefined;

    function locate() {
      if (cancelled) return;
      const el = findVisibleTarget(step!.target);
      if (el) {
        setRect(measureRect(el));
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        setSearched(true);
        // scrollIntoView's smooth animation finishes after this point, so
        // the rect captured above goes stale — re-measure once it's likely
        // settled rather than relying solely on the scroll listener below,
        // which mobile browsers can fire too coarsely to catch.
        settleTimeout = setTimeout(() => {
          if (cancelled) return;
          const settledEl = findVisibleTarget(step!.target);
          if (settledEl) setRect(measureRect(settledEl));
        }, 450);
        return;
      }
      attempts += 1;
      // Up to ~40 attempts (~2s) to allow for slower page transitions and
      // data fetches on mobile connections after the tour navigates.
      if (attempts < 40) {
        requestAnimationFrame(() => setTimeout(locate, 50));
      } else {
        setRect(null);
        setSearched(true);
      }
    }

    // Deferred one frame so the reset + search happen outside the effect's
    // synchronous call stack.
    const raf = requestAnimationFrame(() => {
      setSearched(false);
      locate();
    });

    function onViewportChange() {
      const el = findVisibleTarget(step!.target);
      if (el) setRect(measureRect(el));
    }
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("orientationchange", onViewportChange);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (settleTimeout) clearTimeout(settleTimeout);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("orientationchange", onViewportChange);
    };
  }, [isOpen, step]);

  if (!isOpen || !step) return null;

  const padding = 8;
  const spotlight = rect
    ? {
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      }
    : null;

  return (
    <div className="fixed inset-0 z-[100]">
      <AnimatePresence>
        {searched && (
          <motion.div
            key={step.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60"
            onClick={skip}
          />
        )}
      </AnimatePresence>

      {spotlight && (
        <motion.div
          key={`${step.id}-spot`}
          initial={false}
          animate={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
          }}
          transition={{ type: "tween", duration: 0.25 }}
          className="fixed rounded-xl pointer-events-none ring-4 ring-[#d6852b]"
          style={{ boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)" }}
        />
      )}

      {searched && (
        <TourCard
          spotlight={spotlight}
          title={step.title}
          body={step.body}
          index={stepIndex}
          count={stepCount}
          onNext={next}
          onBack={back}
          onSkip={skip}
        />
      )}
    </div>
  );
}

function TourCard({
  spotlight,
  title,
  body,
  index,
  count,
  onNext,
  onBack,
  onSkip,
}: {
  spotlight: Rect | null;
  title: string;
  body: string;
  index: number;
  count: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const isLast = index + 1 >= count;

  const cardWidth = Math.min(CARD_MAX_WIDTH, window.innerWidth - CARD_MARGIN * 2);
  const { top: topInset, bottom: bottomInset } = getViewportBounds();
  const usableTop = topInset + CARD_MARGIN;
  const usableBottom = window.innerHeight - bottomInset - CARD_MARGIN;
  const maxLeft = window.innerWidth - cardWidth - CARD_MARGIN;

  let cardStyle: React.CSSProperties;
  if (spotlight) {
    const spaceBelow = usableBottom - (spotlight.top + spotlight.height);
    const placeBelow = spaceBelow > CARD_ESTIMATED_HEIGHT;
    const top = placeBelow
      ? Math.min(spotlight.top + spotlight.height + 16, usableBottom - CARD_ESTIMATED_HEIGHT)
      : Math.max(usableTop, spotlight.top - CARD_ESTIMATED_HEIGHT - 16);
    const left = Math.max(CARD_MARGIN, Math.min(spotlight.left, maxLeft));
    cardStyle = { top, left, width: cardWidth };
  } else {
    cardStyle = {
      top: Math.max(usableTop, Math.min((usableTop + usableBottom) / 2, usableBottom)),
      left: window.innerWidth / 2,
      width: cardWidth,
      transform: "translate(-50%, -50%)",
    };
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="fixed bg-white rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3"
      style={cardStyle}
    >
      <p className="text-xs font-medium text-slate-400">
        Step {index + 1} of {count}
      </p>
      <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
      <p className="text-sm text-slate-600">{body}</p>
      <div className="flex items-center justify-between pt-1">
        <button onClick={onSkip} className="text-xs text-slate-400 hover:text-slate-600">
          Skip tour
        </button>
        <div className="flex gap-2">
          {index > 0 && (
            <button
              onClick={onBack}
              className="text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50"
            >
              Back
            </button>
          )}
          <button
            onClick={onNext}
            className="text-sm bg-[#d6852b] text-white rounded-lg px-3 py-1.5 hover:bg-[#c07724]"
          >
            {isLast ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
