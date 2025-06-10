import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { AuthLoginDTO, AuthLoginModel, AuthRegisterDTO } from "@core/model/auth";
import { UserModel } from "@core/model/user";

export const authService = {
  login: HTTP_REQUEST.post<ApiResponse<AuthLoginModel>, AuthLoginDTO>(
    API_ENDPOINT.login
  ),
  register: HTTP_REQUEST.post<ApiResponse<UserModel>, AuthRegisterDTO>(
    API_ENDPOINT.register
  ),
  check: HTTP_REQUEST.get<ApiResponse<UserModel>>(API_ENDPOINT.check),
};
