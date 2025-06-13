import { AttendanceToday } from "./attendance";

export interface EmployeeModel {
  id: string;
  name: string;
  email: string;
  date_of_birth: string;
  divisi: string;
  address: string;
  confidence?: number;
  image_url?: string | null;
  attendance_today?: AttendanceToday;
  created_at: string;
  updated_at?: string | null;
}