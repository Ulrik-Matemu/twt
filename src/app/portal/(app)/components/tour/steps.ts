import type { PortalRole } from "@/lib/portal-types";
import { REPORT_AUTHOR_ROLES } from "@/lib/portal-types";

export interface TourStep {
  id: string;
  target: string;
  path?: string;
  title: string;
  body: string;
}

const BASE_STEPS: TourStep[] = [
  {
    id: "dashboard",
    target: "nav-dashboard",
    path: "/portal",
    title: "Your dashboard",
    body: "This is your home base in the TWT portal — a quick overview whenever you log in.",
  },
  {
    id: "reports-nav",
    target: "nav-reports",
    path: "/portal",
    title: "Reports",
    body: "All monitoring reports — yours, or everyone's if you review them — live here.",
  },
];

const NEW_REPORT_STEP: TourStep = {
  id: "new-report",
  target: "new-report-button",
  path: "/portal/reports",
  title: "Start a new report",
  body: "Tap here whenever you need to log a new observation report.",
};

const ZOO_DOCTOR_STEPS: TourStep[] = [
  {
    id: "zoo-general-details",
    target: "zoo-general-details",
    path: "/portal/reports/new",
    title: "Fill in the basics first",
    body: "Date and Unit are required before you can save or submit — Unit no longer has a default value, so make sure to type it in yourself.",
  },
  {
    id: "zoo-add-subunit",
    target: "zoo-add-subunit",
    path: "/portal/reports/new",
    title: "Add each sub-unit you inspected",
    body: "Pick a sub-unit and fill in all seven observations. Anything left incomplete is flagged in amber and will block submission until it's fixed.",
  },
];

const HELP_STEP: TourStep = {
  id: "help",
  target: "tour-help-button",
  title: "Need a refresher later?",
  body: "Come back to this button anytime to replay this walkthrough.",
};

export function getTourSteps(role: PortalRole): TourStep[] {
  const steps = [...BASE_STEPS];

  if (REPORT_AUTHOR_ROLES.includes(role)) {
    steps.push(NEW_REPORT_STEP);
  }
  if (role === "zoo_doctor") {
    steps.push(...ZOO_DOCTOR_STEPS);
  }

  steps.push(HELP_STEP);
  return steps;
}
