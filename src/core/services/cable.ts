import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { CableModel } from "@core/model/cable";

export const cableService = {
  get: HTTP_REQUEST.get<ApiResponse<CableModel[]>>(API_ENDPOINT.cable),
  getById: HTTP_REQUEST.get<ApiResponse<CableModel>>(API_ENDPOINT.cable),
  post: HTTP_REQUEST.post<ApiResponse<CableModel>>(API_ENDPOINT.cable),
  put: HTTP_REQUEST.put<ApiResponse<CableModel>>(API_ENDPOINT.cable),
  delete: HTTP_REQUEST.delete<ApiResponse<void>>(API_ENDPOINT.cable),
};
