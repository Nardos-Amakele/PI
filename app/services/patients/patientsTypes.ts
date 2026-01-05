export interface Patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  dateOfBirth: string;
  email: string;

  languages: string[] | null;
  address: string | null;
  referralSource: string | null;
  initialReferralSpecialty: string | null;
  referralId: string | null;

  assignedDoctors: string[] | null;
  caseIds: string[] | null;

  alerts: PatientAlert[] | null;
  notes: PatientNote[] | null;

  extractedData: any;
  imagingStudies: any;

  approvedBy: string | null;
  approvedAt: string | null;

  createdAt: string;
  updatedAt: string;
}
export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
export interface GetPatientsResponse {
  success: boolean;
  message: string;
  data: {
    patients: Patient[];
    pagination: Pagination;
  };
}


export interface PaginatedPatients {
  data: any;
  patients: Patient[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface PatientAlert {
  text: string;
  uploadedBy: string;
  uploadedDate: string;
}

export interface PatientAlertsResponse {
  success: boolean;
  data: {
    alerts: PatientAlert[];
  };
}

export interface PatientNote {
  text: string;
  uploadedBy: string;
  uploadedDate?: string;
  createdAt?: string;
}

export interface PatientNotesResponse {
  success: boolean;
  data: {
    notes: PatientNote[];
  };
}

export interface GetPatientByIdResponse {
  success: boolean;
  data: Patient;
}
