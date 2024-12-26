import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { HistoryModel } from "@core/model/history";

export const historyService = {
  get: HTTP_REQUEST.get<ApiResponse<HistoryModel[]>>(API_ENDPOINT.history),
};
