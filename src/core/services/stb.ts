import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { StbModel } from "@core/model/stb";

export const stbService = {
  get: HTTP_REQUEST.get<ApiResponse<StbModel[]>>(API_ENDPOINT.stb),
  getById: HTTP_REQUEST.get<ApiResponse<StbModel>>(API_ENDPOINT.stb),
  post: HTTP_REQUEST.post<ApiResponse<StbModel>>(API_ENDPOINT.stb),
  put: HTTP_REQUEST.put<ApiResponse<StbModel>>(API_ENDPOINT.stb),
  delete: HTTP_REQUEST.delete<ApiResponse<void>>(API_ENDPOINT.stb),
};
