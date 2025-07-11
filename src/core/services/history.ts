// @core/services/history.ts
import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { HistoryModel, RecentActivityModel } from "@core/model/history";

export const historyService = {
  get: HTTP_REQUEST.get<ApiResponse<HistoryModel[]>>(API_ENDPOINT.history),
  getById: HTTP_REQUEST.get<ApiResponse<HistoryModel>>(API_ENDPOINT.history),
  getRecentActivities: HTTP_REQUEST.get<ApiResponse<RecentActivityModel[]>>(
    `${API_ENDPOINT.history}/recent`
  ),
  getTransactionHistory: HTTP_REQUEST.get<ApiResponse<HistoryModel[]>>(
    API_ENDPOINT.history
  ),
  getEmployeeActivities: HTTP_REQUEST.get<ApiResponse<HistoryModel[]>>(
    API_ENDPOINT.history
  ),
};