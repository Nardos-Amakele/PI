/* ======================
   SHARED
====================== */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  statusCode: number;
  data: T;
}

/* ======================
   BOOKING PREFERENCES
====================== */
export interface BookingPreference {
  id: string;
  providerId: string;
  serviceTypeId: string;

  startTime: string;
  endTime: string;

  capacityPerDay: number;
  capacityPerHour: number;
  morningCapacity: number;
  afternoonCapacity: number;

  daysOfWeek: number[];

  doubleBooking: boolean;
  allowOverlapping: boolean;
}


export interface CreateBookingPreferenceRequest {
  providerId: string;
  serviceTypeId: string;

  startTime: string; // ISO string
  endTime: string;   // ISO string

  capacityPerDay: number;
  capacityPerHour: number;
  morningCapacity: number;
  afternoonCapacity: number;

  daysOfWeek: number[];

  doubleBooking: boolean;
  allowOverlapping: boolean;
}


export interface BookingPreferenceResponse {
  bookingPreference: BookingPreference;
}


export interface BookingPreferencesResponse {
  bookingPreferences: BookingPreference[];
}

/* ======================
   SCHEDULE TEMPLATES
====================== */
export interface Location {
  id: string;
  name: string;
}
export interface AppointmentTypeSlot {
  appointmentTypeId: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleTemplate {
  id: string;
  providerId: string;
  locationId: string;
  name: string;
  description?: string;
  color?: string;
  appointmentTypes: AppointmentTypeSlot[];
  validFrom: string;
  validUntil: string;
  daysOfWeek: number[];
  weekFrequency: number[];
  Location?: Location;

}

export interface CreateScheduleTemplateRequest {
  providerId: string;
  locationId: string;
  name: string;
  description?: string;
  color?: string;
  appointmentTypes: AppointmentTypeSlot[];
  validFrom: string;
  validUntil: string;
  daysOfWeek: number[];
  weekFrequency: number[];
}

export interface UpdateScheduleTemplateRequest
  extends Partial<Omit<CreateScheduleTemplateRequest, "providerId" | "locationId">> {
  // validUntil is required on update per backend contract
  validUntil: string;
  // appointmentTypes must include required fields on update
  appointmentTypes: AppointmentTypeSlot[];
}

export interface ScheduleTemplateResponse {
  scheduleTemplate: ScheduleTemplate;
}

export interface ScheduleTemplatesResponse {
  scheduleTemplates: ScheduleTemplate[];
}
