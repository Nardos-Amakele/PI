// src/features/service-types/types.ts
export interface ServiceType {
  id?: string;
  title: string;
  shortTitle: string;
  duration: number;
  color: string;
}

export interface PaginatedServiceTypes {
  success: boolean;
  message: string;
  data: {
    serviceTypes: ServiceType[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
}
