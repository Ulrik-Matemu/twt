import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import type { ReportEntryInput, SubUnitEntryInput } from "@/lib/portal-types";

const LOGO_PATH = path.join(process.cwd(), "public", "twt-logo-removebg-preview.png");
const MARGIN = 50;
const PAGE_WIDTH = 595.28; // A4 portrait, points

interface ReportHeader {
  date: string;
  observerName: string;
  status: string;
}

function drawLetterhead(doc: PDFKit.PDFDocument, title: string, header: ReportHeader) {
  const contentWidth = PAGE_WIDTH - MARGIN * 2;
  const top = doc.y;

  if (fs.existsSync(LOGO_PATH)) {
    doc.image(LOGO_PATH, MARGIN, top, { width: 48, height: 48 });
  }

  doc
    .font("Times-Bold")
    .fontSize(13)
    .text("Tanzania Wildlife Trappers", MARGIN + 58, top, { width: contentWidth - 58 });
  doc
    .font("Times-Roman")
    .fontSize(9)
    .fillColor("#555555")
    .text("Arusha, Tanzania, East Africa", MARGIN + 58, doc.y)
    .text("+255 750 151 020  ·  office@twt.co.tz", MARGIN + 58, doc.y)
    .fillColor("#000000");

  doc.moveDown(1.2);
  doc
    .moveTo(MARGIN, doc.y)
    .lineTo(MARGIN + contentWidth, doc.y)
    .lineWidth(1.5)
    .strokeColor("#1a1a1a")
    .stroke();
  doc.moveDown(0.8);

  doc.font("Times-Bold").fontSize(14).text(title, { align: "left" });
  doc
    .font("Times-Roman")
    .fontSize(10)
    .fillColor("#444444")
    .text(
      `Date: ${header.date}    Observer: ${header.observerName}    Status: ${capitalize(header.status)}`
    )
    .fillColor("#000000");
  doc.moveDown(1);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function drawSectionHeading(doc: PDFKit.PDFDocument, text: string) {
  doc.moveDown(0.6);
  doc.font("Times-Bold").fontSize(11).text(text);
  doc.moveDown(0.2);
}

function drawLabeledLine(doc: PDFKit.PDFDocument, label: string, value: string) {
  doc.font("Times-Bold").fontSize(10).text(`${label}: `, { continued: true });
  doc.font("Times-Roman").fontSize(10).text(value || "—");
}

function drawDivider(doc: PDFKit.PDFDocument) {
  const contentWidth = PAGE_WIDTH - MARGIN * 2;
  doc.moveDown(0.5);
  doc
    .moveTo(MARGIN, doc.y)
    .lineTo(MARGIN + contentWidth, doc.y)
    .lineWidth(0.5)
    .strokeColor("#cccccc")
    .stroke();
  doc.moveDown(0.5);
  doc.strokeColor("#000000");
}

function addFooters(doc: PDFKit.PDFDocument) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc
      .font("Times-Roman")
      .fontSize(8)
      .fillColor("#888888")
      .text(
        `Generated from the TWT Animal Monitoring Portal on ${new Date().toLocaleString()} — Page ${i + 1} of ${range.count}`,
        MARGIN,
        doc.page.height - 40,
        { width: PAGE_WIDTH - MARGIN * 2, align: "center" }
      )
      .fillColor("#000000");
  }
}

function newDocument(): PDFKit.PDFDocument {
  return new PDFDocument({
    size: "A4",
    margin: MARGIN,
    bufferPages: true,
    font: "Times-Roman",
  });
}

async function finalize(doc: PDFKit.PDFDocument): Promise<Buffer> {
  addFooters(doc);
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

export async function generateCaptureReportPdf(
  report: { date: string; project: string; site: string; observerName: string; status: string },
  entries: ReportEntryInput[]
): Promise<Buffer> {
  const doc = newDocument();

  drawLetterhead(doc, "Animal Monitoring Report", report);
  drawLabeledLine(doc, "Project", report.project);
  drawLabeledLine(doc, "Site", report.site);
  doc.moveDown(0.5);

  entries.forEach((entry, index) => {
    if (index > 0) drawDivider(doc);

    doc.font("Times-Bold").fontSize(11).text(`${index + 1}. ${entry.animalName}`);
    doc.moveDown(0.2);
    drawLabeledLine(doc, "Type", entry.type);
    drawLabeledLine(doc, "Gender", entry.gender);
    drawLabeledLine(doc, "Quantity", String(entry.quantity));
    drawLabeledLine(doc, "Age group", entry.ageGroup === "juvenile" ? "Juvenile" : "Adult");
    drawLabeledLine(doc, "Site of capture", entry.siteOfCapture);
    drawLabeledLine(doc, "Capture date/time", entry.captureDateTime);
    drawLabeledLine(doc, "Condition", entry.condition);
    drawLabeledLine(doc, "Doctor's summary", entry.doctorSummary);

    if (entry.delivered) {
      const deliveredAt = entry.deliveredAt
        ? ` (marked delivered at ${new Date(entry.deliveredAt).toLocaleString()})`
        : "";
      drawLabeledLine(doc, "Delivered", "Yes" + deliveredAt);
      drawLabeledLine(doc, "Delivery summary", entry.deliverySummary || "—");
    } else {
      drawLabeledLine(doc, "Delivered", "No");
    }
  });

  return finalize(doc);
}

export async function generateZooCensusReportPdf(
  report: { date: string; unit: string; observerName: string; status: string },
  entries: SubUnitEntryInput[]
): Promise<Buffer> {
  const doc = newDocument();

  drawLetterhead(doc, "Daily Animal Monitoring Report", report);
  drawLabeledLine(doc, "Unit", report.unit);
  doc.moveDown(0.5);

  entries.forEach((entry, index) => {
    if (index > 0) drawDivider(doc);

    doc.font("Times-Bold").fontSize(12).text(`Sub Unit ${index + 1}: ${entry.subUnitName.toUpperCase()}`);
    if (entry.animals?.length > 0) {
      doc
        .font("Times-Roman")
        .fontSize(9)
        .fillColor("#555555")
        .text(`Names: ${entry.animals.map((a) => `${a.name} (${a.gender})`).join(", ")}`)
        .fillColor("#000000");
    }

    drawSectionHeading(doc, "1. General Health & Physical Observation");
    drawLabeledLine(doc, "A. Appearance and posture", entry.appearance);
    drawLabeledLine(doc, "B. Behavior and activity level", entry.behavior);
    drawLabeledLine(doc, "C. Respiration and breathing", entry.respiration);
    drawLabeledLine(doc, "D. Faeces and urine", entry.faecesUrine);
    drawLabeledLine(doc, "E. Wounds and lesions", entry.woundsLesions);

    drawSectionHeading(doc, "2. Feed and Water Intake");
    drawLabeledLine(doc, "Remark", entry.feedWaterIntake);

    drawSectionHeading(doc, "3. Training and Adaptability");
    drawLabeledLine(doc, "Remark", entry.trainingAdaptability);

    if (entry.hasIndividualParams) {
      drawSectionHeading(doc, `Today's health parameters for ${entry.individualAnimalName}`);
      drawLabeledLine(doc, "Temperature", entry.individualTemperature || "—");
      drawLabeledLine(doc, "Heart rate", entry.individualHeartRate || "—");
      drawLabeledLine(doc, "Respiratory rate", entry.individualRespiratoryRate || "—");
      if (entry.individualNotes) {
        drawLabeledLine(doc, "Other notes", entry.individualNotes);
      }
    }

    if (entry.hasTreatment) {
      drawSectionHeading(doc, "4. Treatment Undertaken");
      doc.font("Times-Roman").fontSize(10).text(entry.treatmentNotes || "—");
    }
  });

  return finalize(doc);
}
