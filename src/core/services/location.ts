import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { LocationModel } from "@core/model/location";

export const locationService = {
  get: HTTP_REQUEST.get<ApiResponse<LocationModel[]>>(API_ENDPOINT.location),
  getById: HTTP_REQUEST.get<ApiResponse<LocationModel>>(API_ENDPOINT.location),
  post: HTTP_REQUEST.post<ApiResponse<LocationModel>>(API_ENDPOINT.location),
  put: HTTP_REQUEST.put<ApiResponse<LocationModel>>(API_ENDPOINT.location),
  delete: HTTP_REQUEST.delete<ApiResponse<void>>(API_ENDPOINT.location),
};
