/* ======================
   SHARED
====================== */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/* ======================
   APPOINTMENT TYPES
====================== */

export interface AppointmentType {
  id: string;
  title: string;
  shortTitle?: string;
  duration: number;
  color?: string;
  serviceTypeId: string;
  createdAt?: string;
  updatedAt?: string;
  ServiceType?: {
    id: string;
    title: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface CreateAppointmentTypeRequest {
  title: string;
  duration: number;
  shortTitle?: string;
  color?: string;
  serviceTypeId: string;
}

export interface UpdateAppointmentTypeRequest {
  title?: string;
  shortTitle?: string;
  duration?: number;
  color?: string;
  serviceTypeId?: string;
}

export interface AppointmentTypeResponse {
  serviceTypeId: string;
  duration: number;
  color: string;
  shortTitle: string;
  title: string;
  appointmentType: AppointmentType;
}

export interface AppointmentTypesResponse {
  appointmentTypes: AppointmentType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

