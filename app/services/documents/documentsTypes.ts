// documentClassification.types.ts

export interface DocumentSubType {
    id: string;
    name: string;
    description: string;
}

export interface DocumentType {
    id: string;
    name: string;
    description: string;
    DocumentSubTypes: DocumentSubType[];
}

export interface DocumentCategory {
    id: string;
    name: string;
    description: string;
    DocumentTypes: DocumentType[];
}

export interface GetDocumentClassificationResponse {
    success: boolean;
    data: DocumentCategory[];
}

export interface UploadDocumentRequest {
    patientId: string;
    categoryId: string;
    typeId: string;
    subTypeId?: string;
    files: File[];
    originalName?: string;
    dateOfStudy?: string;
    uploadedBy?: string;
    notes?: string;
}

export interface UploadDocumentResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: {
        document: {
            id: string;
            patientId: string;
            categoryId: string;
            typeId: string;
            subTypeId?: string;
            originalName: string;
            storedName: string;
            mimeType: string;
            fileSize: number;
            filePath: string;
            dateOfStudy?: string;
            uploadedBy?: string;
            notes?: string;
            status: string;
            createdAt: string;
            updatedAt: string;
        };
    };
}

export interface DocumentItem {
    id: string;
    patientId: string;
    categoryId: string;
    typeId: string;
    subTypeId?: string;
    originalName: string;
    storedName: string;
    mimeType: string;
    fileSize: number;
    filePath: string;
    dateOfStudy?: string;
    uploadedBy?: string;
    notes?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetDocumentsByPatientResponse {
    success: boolean;
    statusCode: number;
    data: {
        documents: DocumentItem[];
    };
}
