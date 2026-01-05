// types.ts

export interface BlockReason {
  id: any;
  title: string;
  description: string;
  color: string;
  status: boolean;
}

export interface BlockReasonResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    blockReason: BlockReason;
  };
}

export interface BlockReasonsListResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    blockReasons: BlockReason[];
  };
}
