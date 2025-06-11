import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { ReportModel } from "@core/model/report";

export const reportService = {
  get: HTTP_REQUEST.get<ApiResponse<ReportModel[]>>(API_ENDPOINT.report),
  getById: HTTP_REQUEST.get<ApiResponse<ReportModel>>(API_ENDPOINT.report),
  patch: HTTP_REQUEST.patch<ApiResponse<ReportModel>>(API_ENDPOINT.report),
  post: HTTP_REQUEST.post<ApiResponse<ReportModel>>(API_ENDPOINT.report),
  delete: HTTP_REQUEST.delete<ApiResponse<void>>(API_ENDPOINT.report),
  export: HTTP_REQUEST.get<ApiResponse<Blob>>(API_ENDPOINT.report + "/export/excel"),
};
