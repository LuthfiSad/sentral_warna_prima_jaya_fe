import { EmployeeModel } from "./employee";

export interface ReportModel {
  id: number;
  date: string;
  report: string;
  status: "pending" | "approved" | "rejected";
  image_url: string | null;
  employee_id: number;
  created_at: string;
  updated_at: string | null;
  employee: EmployeeModel;
}