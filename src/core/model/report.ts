// @core/model/report.ts - Updated for new flow
export type ReportStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface ReportModel {
  id: number;
  transaction_id: number;
  description: string;
  start_time: string;
  end_time: string;
  status: ReportStatus;
  rejection_reason?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  employee: {
    id: number;
    name: string;
  };
  transaction: {
    id: number;
    customer: {
      name: string;
      plate_number: string;
      vehicle_type: string;
      vehicle_model: string;
    };
    complaint: string;
    status: string;
  };
  user: {
    id: number;
    username: string;
  };
}

export interface ReportCreateDTO {
  transaction_id: number;
  description: string;
  start_time: string;
  end_time: string;
  image?: File;
}

export interface ReportUpdateDTO {
  description?: string;
  start_time?: string;
  end_time?: string;
  image?: File;
}