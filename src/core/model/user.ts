import { EmployeeModel } from "./employee";

export interface UserModel {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  karyawan_id?: number | null;
  employee?: EmployeeModel | null;
}

export interface ChangePasswordDTO {
  password?: string;
  confirm_password?: string;
}