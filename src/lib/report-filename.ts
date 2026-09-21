function sanitizeSegment(value: string): string {
  return value.trim().replace(/[/\\:*?"<>|]/g, "-");
}

export function buildReportFilename(report: {
  reportType?: "capture" | "zoo_census";
  date: string;
  observerName: string;
  unit?: string;
  project?: string;
  site?: string;
}): string {
  const title = "Monitoring Report";
  const locationSegment =
    report.reportType === "zoo_census"
      ? report.unit || "Zoo"
      : [report.project, report.site].filter(Boolean).join(" - ") || "Field";

  const parts = [title, report.date, report.observerName, locationSegment]
    .map(sanitizeSegment)
    .filter(Boolean);

  return parts.join(" - ");
}
