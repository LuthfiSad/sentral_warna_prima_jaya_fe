// @core/model/transaction.ts
import { CustomerModel } from "./customer";
import { HistoryModel } from "./history";
import { ReportModel } from "./report";

export type TransactionStatus = 
  | "PENDING" 
  | "PROSES" 
  | "MENUNGGU_APPROVAL" 
  | "SELESAI" 
  | "DIBAYAR";

export interface TransactionModel {
  id: number;
  customer_id: number;
  complaint: string;
  status: TransactionStatus;
  total_cost?: number;
  start_time?: string;
  end_time?: string;
  created_at: string;
  updated_at: string;
  customer: CustomerModel;
  reports?: ReportModel[];
  histories?: HistoryModel[];
}

export interface TransactionCreateDTO {
  customer_id: number;
  complaint: string;
}

export interface TransactionUpdateDTO {
  complaint?: string;
  status?: TransactionStatus;
  total_cost?: number;
  start_time?: string;
  end_time?: string;
}