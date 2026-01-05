/* ======================
   SHARED
====================== */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  statusCode: number;
  data: T;
}

/* ======================
   PAGINATION
====================== */

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

/* ======================
   BASIC PROVIDER (LIST VIEW)
====================== */

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialityId: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface GetProvidersResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    providers: Provider[];
    pagination: Pagination;
  };
}

/* ======================
   PROVIDER DETAILS
====================== */

export interface ProviderLicense {
  licenseNumber: string;
  state: string;
  expirationDate: string;
  issueDate: string;
}

export interface AgeRestriction {
  min: number;
  max: number;
  requiresConfirmation?: boolean;
  note?: string;
}

export interface CapacitySetting {
  fullDayCapacity: number;
  morningCapacity: number;
  afternoonCapacity: number;
}

export interface ProviderDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  npi: string;
  specialities: string[];
  locationIds: string[];
  licenses: ProviderLicense[];
  ageRestrictions: AgeRestriction[];
  preferences: string[];
  serviceTypeIds: string[];
  capacitySetting?: CapacitySetting | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

/* ======================
   REQUESTS
====================== */

export interface CreateProviderRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  npi: string;
  specialities: string[];
  location_ids: string[];
  licenses?: Partial<ProviderLicense>[];
  age_restrictions?: Partial<AgeRestriction>[];
  preferences: string[];
  service_type_ids?: string[];
  capacity_setting?: Partial<CapacitySetting>;
}

/* ======================
   RESPONSES
====================== */

export interface ProviderResponse {
  provider: ProviderDetails;
  capacitySetting?: CapacitySetting | null;
}

export interface CapacitySettingResponse {
  capacitySetting: CapacitySetting;
}
