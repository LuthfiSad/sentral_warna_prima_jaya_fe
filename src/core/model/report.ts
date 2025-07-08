import { EmployeeModel } from "./employee";

export interface ReportModel {
  id: number;
  date: string;
  report: string;
  customer_name: string;
  vehicle_type: string;
  total_repairs: number;
  cost: number;
  status: "pending" | "approved" | "rejected";
  image_url: string | null;
  employee_id: number;
  created_at: string;
  updated_at: string | null;
  employee: EmployeeModel;
}