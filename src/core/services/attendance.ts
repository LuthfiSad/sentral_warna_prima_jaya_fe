import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { AttendanceModel } from "@core/model/attendance";

export const attendanceService = {
  get: HTTP_REQUEST.get<ApiResponse<AttendanceModel[]>>(API_ENDPOINT.attendance),
  getById: HTTP_REQUEST.get<ApiResponse<AttendanceModel>>(API_ENDPOINT.attendance),
  post: HTTP_REQUEST.post<ApiResponse<AttendanceModel>>(API_ENDPOINT.attendance),
  put: HTTP_REQUEST.put<ApiResponse<AttendanceModel>>(API_ENDPOINT.attendance),
  checkin: HTTP_REQUEST.post<ApiResponse<AttendanceModel>>(API_ENDPOINT.attendance + "/checkin"),
  checkout: HTTP_REQUEST.post<ApiResponse<AttendanceModel>>(API_ENDPOINT.attendance + "/checkout"),
  delete: HTTP_REQUEST.delete<ApiResponse<void>>(API_ENDPOINT.attendance),
};
