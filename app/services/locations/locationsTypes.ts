// Types for Locations API

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

export interface Address {
  office_address: string;
  city?: string | null;
  state?: string | null;
  fax?: string | null;
  postal_code?: string | null;
  phone_number?: string | null;
}

export interface Location {
  id: string;
  name: string;
  address: Address;
  npiNumber: string | null;
  serviceCode: number | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface LocationsData {
  locations: Location[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalItems?: number;
    totalPages: number;
  };
}

export interface LocationData {
  location: Location;
}

export type CreateLocationRequest = {
  name: string;
  address: Partial<Address> & { office_address: string };
  npiNumber?: string | null;
  serviceCode?: number | null;
  status?: "active" | "inactive";
};
