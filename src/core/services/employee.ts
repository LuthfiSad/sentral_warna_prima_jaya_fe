import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { EmployeeModel } from "@core/model/employee";

export const employeeService = {
  get: HTTP_REQUEST.get<ApiResponse<EmployeeModel[]>>(API_ENDPOINT.employee),
  getById: HTTP_REQUEST.get<ApiResponse<EmployeeModel>>(API_ENDPOINT.employee),
  post: HTTP_REQUEST.post<ApiResponse<EmployeeModel>>(API_ENDPOINT.employee),
  put: HTTP_REQUEST.put<ApiResponse<EmployeeModel>>(API_ENDPOINT.employee),
  delete: HTTP_REQUEST.delete<ApiResponse<void>>(API_ENDPOINT.employee),
};
