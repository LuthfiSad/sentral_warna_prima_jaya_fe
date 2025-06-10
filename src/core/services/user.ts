import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { UserModel } from "@core/model/user";

export const userService = {
  get: HTTP_REQUEST.get<ApiResponse<UserModel[]>>(API_ENDPOINT.user),
  getById: HTTP_REQUEST.get<ApiResponse<UserModel>>(API_ENDPOINT.user),
  post: HTTP_REQUEST.post<ApiResponse<UserModel>>(API_ENDPOINT.user),
  put: HTTP_REQUEST.put<ApiResponse<UserModel>>(API_ENDPOINT.user),
  changePassword: HTTP_REQUEST.post<ApiResponse<UserModel>>(
    API_ENDPOINT.user + "/reset-password"
  ),
  delete: HTTP_REQUEST.delete<ApiResponse<void>>(API_ENDPOINT.user),
};
