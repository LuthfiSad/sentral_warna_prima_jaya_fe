import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";

export const exportService = {
  postOnt: HTTP_REQUEST.post<ApiResponse | Blob>(API_ENDPOINT.export + "/ont"),
  postStb: HTTP_REQUEST.post<ApiResponse | Blob>(API_ENDPOINT.export + "/stb"),
};
