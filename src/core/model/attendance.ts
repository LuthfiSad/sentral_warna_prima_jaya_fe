import { EmployeeModel } from "./employee";

export type AttendanceToday = {
  checkin: string;
  checkout: string | null;
} | null;

export interface AttendanceModel {
  id: string;
  employee_id: string;
  date: string; // Format: YYYY-MM-DD
  checkin_time: string | null; // ISO 8601 datetime string
  checkout_time: string | null;
  checkin_latitude: number | null;
  checkin_longitude: number | null;
  checkout_latitude: number | null;
  checkout_longitude: number | null;
  checkin_image_url: string | null;
  checkout_image_url: string | null;
  created_at: string | null; // ISO 8601 datetime string
  updated_at: string | null;

  // Optional: Include employee if joined from backend
  employee?: EmployeeModel | null;
}
