// @core/model/history.ts
import { TransactionStatus } from "./transaction";

export interface HistoryModel {
  id: number;
  transaction_id: number;
  status: TransactionStatus;
  note?: string;
  created_at: string;
  transaction?: {
    id: number;
    customer: {
      name: string;
      plate_number: string;
      vehicle_type: string;
    };
    complaint: string;
  };
}

export interface RecentActivityModel {
  id: number;
  type: "transaction" | "report" | "status_change";
  description: string;
  user_name: string;
  created_at: string;
  related_id?: number;
}