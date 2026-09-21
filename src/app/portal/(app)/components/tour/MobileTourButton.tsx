"use client";

import { HelpCircle } from "lucide-react";
import { useTour } from "./TourProvider";

export default function MobileTourButton() {
  const { start } = useTour();

  return (
    <button
      onClick={start}
      data-tour-id="tour-help-button"
      aria-label="Take a tour"
      className="text-slate-500 hover:text-slate-700"
    >
      <HelpCircle className="w-5 h-5" />
    </button>
  );
}
