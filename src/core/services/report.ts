// @core/services/report.ts - Updated for new flow
import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { ReportModel } from "@core/model/report";

export const reportService = {
  get: HTTP_REQUEST.get<ApiResponse<ReportModel[]>>(API_ENDPOINT.report),
  getById: HTTP_REQUEST.get<ApiResponse<ReportModel>>(API_ENDPOINT.report),
  post: HTTP_REQUEST.post<ApiResponse<ReportModel>>(API_ENDPOINT.report),
  put: HTTP_REQUEST.put<ApiResponse<ReportModel>>(API_ENDPOINT.report),
  delete: HTTP_REQUEST.delete<ApiResponse<void>>(API_ENDPOINT.report),
  
  // New endpoints for approval flow
  submit: HTTP_REQUEST.post<ApiResponse<ReportModel>>(API_ENDPOINT.report),
  approve: HTTP_REQUEST.post<ApiResponse<ReportModel>>(API_ENDPOINT.report),
  reject: HTTP_REQUEST.post<ApiResponse<ReportModel>>(API_ENDPOINT.report),
  
  // Get PENDING report for admin
  getPendingApproval: HTTP_REQUEST.get<ApiResponse<ReportModel[]>>(
    `${API_ENDPOINT.report}/PENDING-approval`
  ),
  
  // Get report by transaction
  getByTransaction: HTTP_REQUEST.get<ApiResponse<ReportModel[]>>(
    API_ENDPOINT.report
  ),
  
  // Export functionality
  exportExcel: HTTP_REQUEST.get<ApiResponse<Blob>>(
    `${API_ENDPOINT.report}/export/excel`
  ),
};