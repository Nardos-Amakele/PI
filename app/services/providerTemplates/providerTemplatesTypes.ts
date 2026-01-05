// providerTemplates.types.ts

export interface ProviderTemplate {
  id: string;
  providerId: string;

  headerOriginalName?: string;
  headerStoredName?: string;
  headerMimeType?: string;
  headerFileSize?: number;
  headerFilePath?: string;

  footerOriginalName?: string;
  footerStoredName?: string;
  footerMimeType?: string;
  footerFileSize?: number;
  footerFilePath?: string;

  signatureOriginalName: string;
  signatureStoredName: string;
  signatureMimeType: string;
  signatureFileSize: number;
  signatureFilePath: string;

  signatureRequired: boolean;
  version: number;
  approved: boolean;

  createdAt: string;
  updatedAt: string;
}

/* ---------- Requests ---------- */

export interface CreateProviderTemplateRequest {
  providerId: string;
  headerFile?: File;
  footerFile?: File;
  signatureFile: File;
  signatureRequired: boolean;
}

export interface UpdateProviderTemplateRequest {
  providerId: string;
  templateId: string;
  headerFile?: File;
  footerFile?: File;
  signatureFile?: File;
  signatureRequired?: boolean;
}

/* ---------- Responses ---------- */

export interface CreateProviderTemplateResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    template: ProviderTemplate;
  };
}

export interface GetProviderTemplatesResponse {
  success: boolean;
  statusCode: number;
  data: {
    templates: ProviderTemplate[];
  };
}

export interface GetProviderTemplateResponse {
  success: boolean;
  statusCode: number;
  data: {
    template: ProviderTemplate;
  };
}

export interface UpdateProviderTemplateResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    template: ProviderTemplate;
  };
}
