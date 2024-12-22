import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { OntModel } from "@core/model/ont";

export const ontService = {
  get: HTTP_REQUEST.get<ApiResponse<OntModel[]>>(API_ENDPOINT.ont),
  getById: HTTP_REQUEST.get<ApiResponse<OntModel>>(API_ENDPOINT.ont),
  post: HTTP_REQUEST.post<ApiResponse<OntModel>>(API_ENDPOINT.ont),
  put: HTTP_REQUEST.put<ApiResponse<OntModel>>(API_ENDPOINT.ont),
  delete: HTTP_REQUEST.delete<ApiResponse<void>>(API_ENDPOINT.ont),
};
