// @core/model/transaction.ts
import { CustomerModel } from "./customer";
import { HistoryModel } from "./history";
import { ReportModel } from "./report";

export type TransactionStatus = 
  | "PENDING" 
  | "PROSES" 
  | "PENDING" 
  | "SELESAI" 
  | "DIBAYAR";

// export interface TransactionExport {
//     id: number;
//     complaint: string;
//     status: string;
//     created_at: string;
//     updated_at: string;
//     total_cost: number;
//     customer: CustomerModel;
//     reports: ReportModel[];
//   }
  
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
  total_cost: number;
}

export interface TransactionUpdateDTO {
  complaint?: string;
  status?: TransactionStatus;
  total_cost?: number;
  start_time?: string;
  end_time?: string;
}