function sanitizeSegment(value: string): string {
  return value.trim().replace(/[/\\:*?"<>|]/g, "-");
}

export function buildReportFilename(report: {
  reportType?: "capture" | "zoo_census" | "postmortem";
  date: string;
  observerName: string;
  unit?: string;
  project?: string;
  site?: string;
  animalCommonName?: string;
}): string {
  const title = report.reportType === "postmortem" ? "Postmortem Report" : "Monitoring Report";
  const locationSegment =
    report.reportType === "zoo_census"
      ? report.unit || "Zoo"
      : report.reportType === "postmortem"
        ? report.animalCommonName || "Animal"
        : [report.project, report.site].filter(Boolean).join(" - ") || "Field";

  const parts = [title, report.date, report.observerName, locationSegment]
    .map(sanitizeSegment)
    .filter(Boolean);

  return parts.join(" - ");
}
