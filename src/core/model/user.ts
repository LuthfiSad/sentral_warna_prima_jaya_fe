export interface UserModel {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UserDTO {
  email?: string;
  name?: string;
  password?: string;
  role?: string;
}

export interface ChangePasswordDTO {
  password?: string;
  newPassword?: string;
}