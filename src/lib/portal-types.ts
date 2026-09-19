export type PortalRole =
  | "admin"
  | "office_manager"
  | "admin_doctor"
  | "zoo_doctor"
  | "field_doctor";

export const DOCTOR_ROLES: PortalRole[] = ["admin_doctor", "zoo_doctor", "field_doctor"];
export const REPORT_AUTHOR_ROLES: PortalRole[] = ["zoo_doctor", "field_doctor"];
export const REVIEWER_ROLES: PortalRole[] = ["admin", "office_manager", "admin_doctor"];
export const CATALOG_MANAGER_ROLES: PortalRole[] = ["admin", "office_manager"];
export const USER_MANAGER_ROLES: PortalRole[] = ["admin"];

export const PORTAL_ROLE_LABELS: Record<PortalRole, string> = {
  admin: "Admin",
  office_manager: "Office Manager",
  admin_doctor: "Admin Doctor",
  zoo_doctor: "Zoo Doctor",
  field_doctor: "Field Doctor",
};

export interface PortalSessionUser {
  uid: string;
  email: string;
  name: string;
  role: PortalRole;
}

export type AgeGroup = "juvenile" | "adult";

export interface ReportEntryInput {
  animalId: string;
  animalName: string;
  type: string;
  gender: string;
  quantity: number;
  ageGroup: AgeGroup;
  siteOfCapture: string;
  captureDateTime: string;
  condition: string;
  doctorSummary: string;
  imageUrls: string[];
  delivered: boolean;
  deliverySummary?: string;
  deliveryImageUrl?: string;
  // ISO datetime captured automatically the moment "delivered" is checked —
  // never user-editable.
  deliveredAt?: string;
}

// Draft entries can be partially filled in (a doctor may not have every
// detail yet), so only the animal identity is guaranteed present.
export type ReportEntryDraftInput = Partial<ReportEntryInput> & {
  animalId: string;
  animalName: string;
};

export interface ReportInput {
  date: string;
  project: string;
  site: string;
  status?: "draft" | "submitted";
  entries: ReportEntryInput[] | ReportEntryDraftInput[];
}

export type ReportStatus = "draft" | "submitted" | "reviewed" | "flagged";

export type ReportType = "capture" | "zoo_census";

export interface ZooSubUnitAnimal {
  name: string;
  gender: string;
}

export interface SubUnitEntryInput {
  subUnitId: string;
  subUnitName: string;
  animals: ZooSubUnitAnimal[];
  appearance: string;
  behavior: string;
  respiration: string;
  faecesUrine: string;
  woundsLesions: string;
  feedWaterIntake: string;
  trainingAdaptability: string;
  hasIndividualParams: boolean;
  individualAnimalName?: string;
  individualTemperature?: string;
  individualHeartRate?: string;
  individualRespiratoryRate?: string;
  individualNotes?: string;
  hasTreatment: boolean;
  treatmentNotes?: string;
}

// Draft sub-unit entries can be partially filled in — only the sub-unit
// identity and its roster snapshot are guaranteed present.
export type SubUnitEntryDraftInput = Partial<SubUnitEntryInput> & {
  subUnitId: string;
  subUnitName: string;
  animals: ZooSubUnitAnimal[];
};

export interface ZooCensusReportInput {
  date: string;
  unit: string;
  status?: "draft" | "submitted";
  subUnitEntries: SubUnitEntryInput[] | SubUnitEntryDraftInput[];
}
