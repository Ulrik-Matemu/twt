import type { PortalRole, ReportType } from "./portal-types";

// Pure (client-safe) recipient/filter types and matching logic.

export interface RecipientFilters {
  reportTypes: ReportType[];
  units: string[];
  projects: string[];
  sites: string[];
  observerIds: string[];
  observerRoles: PortalRole[];
}

export interface EmailRecipient {
  id: string;
  email: string;
  label: string;
  active: boolean;
  filters: RecipientFilters;
}

// What a report looks like to the matcher — only routing-relevant fields.
export interface ReportRoutingInfo {
  reportType: ReportType;
  unit?: string;
  project?: string;
  site?: string;
  observerId?: string;
  observerRole?: PortalRole;
}

export const EMPTY_FILTERS: RecipientFilters = {
  reportTypes: [],
  units: [],
  projects: [],
  sites: [],
  observerIds: [],
  observerRoles: [],
};

const norm = (v: string | undefined) => (v ?? "").trim().toLowerCase();

// Empty filter = matches anything; filters are AND-ed; values within one
// filter are OR-ed.
function passes(allowed: string[], actual: string | undefined) {
  return allowed.length === 0 || allowed.some((a) => norm(a) === norm(actual));
}

export function matchesFilters(filters: RecipientFilters, report: ReportRoutingInfo) {
  return (
    passes(filters.reportTypes, report.reportType) &&
    passes(filters.units, report.unit) &&
    passes(filters.projects, report.project) &&
    passes(filters.sites, report.site) &&
    passes(filters.observerIds, report.observerId) &&
    passes(filters.observerRoles, report.observerRole)
  );
}

export function matchRecipients(
  report: ReportRoutingInfo,
  recipients: EmailRecipient[]
): EmailRecipient[] {
  return recipients.filter((r) => r.active && matchesFilters(r.filters, report));
}

export function normalizeFilters(raw: unknown): RecipientFilters {
  const input = (raw ?? {}) as Partial<Record<keyof RecipientFilters, unknown>>;
  const list = (v: unknown, max = 50) =>
    Array.isArray(v)
      ? Array.from(
          new Set(
            v
              .filter((x): x is string => typeof x === "string")
              .map((x) => x.trim())
              .filter(Boolean)
          )
        ).slice(0, max)
      : [];

  const types: ReportType[] = ["capture", "zoo_census", "postmortem"];
  const roles: PortalRole[] = ["admin", "office_manager", "admin_doctor", "zoo_doctor", "field_doctor"];

  return {
    reportTypes: list(input.reportTypes).filter((t): t is ReportType =>
      types.includes(t as ReportType)
    ),
    units: list(input.units),
    projects: list(input.projects),
    sites: list(input.sites),
    observerIds: list(input.observerIds),
    observerRoles: list(input.observerRoles).filter((r): r is PortalRole =>
      roles.includes(r as PortalRole)
    ),
  };
}

export const EMAIL_PATTERN = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;

