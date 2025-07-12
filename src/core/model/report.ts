import { EmployeeModel } from "./employee";
import { TransactionModel } from "./transaction";
import { UserModel } from "./user";

// @core/model/report.ts - Updated for new flow
export type ReportStatus = "PENDING" | "APPROVED" | "REJECTED";

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
  employee: EmployeeModel
  transaction: TransactionModel
  user: UserModel
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