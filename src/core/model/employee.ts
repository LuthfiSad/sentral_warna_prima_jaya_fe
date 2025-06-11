export interface EmployeeModel {
  id: string;
  name: string;
  email: string;
  date_of_birth: string;
  divisi: string;
  address: string;
  image_url?: string | null;
  created_at: string;
  updated_at?: string | null;
}