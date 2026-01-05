export interface Referral {
  id: number;
  patientName: string;
  dateOfReferral: string;
  referralSource?: string;
  specialty?: string;
  provider?: string;
  notes?: string;
  [key: string]: any;
}

export interface PaginatedReferrals {
  referrals: Referral[];
  total: number;
  page: number;
  limit: number;
}

export interface ProcessEmailRequest {
  emailContent: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}
