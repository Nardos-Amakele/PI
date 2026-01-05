// cases.types.ts

/* ---------- Shared ---------- */
export type CaseStatus = "active" | "inactive" | "closed";

export interface CaseContact {
  name: string;
  address: string;
  phone: string;
}

/* ---------- Request ---------- */
export interface CreateCaseRequest {
  patientId: string;
  dateOfLoss: string; // YYYY-MM-DD
  bodyPartsInjured: string[];
  lawOffice: CaseContact;
  caseManager: CaseContact & {
    email: string;
  };
  status: CaseStatus;
}

/* ---------- Response Models ---------- */
export interface Case {
  id: string;
  patientId: string;
  dateOfLoss: string;
  bodyPartsInjured: string[];
  lawOffice: CaseContact;
  caseManager: CaseContact & {
    email: string;
  };
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetCasesByPatientResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    cases: Case[];
  };
}

export interface CreateCaseResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    case: Case;
  };
}
