import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { InventoryModel } from "@core/model/inventory";

export const inventoryService = {
  get: HTTP_REQUEST.get<ApiResponse<InventoryModel[]>>(API_ENDPOINT.inventory),
  getById: HTTP_REQUEST.get<ApiResponse<InventoryModel>>(
    API_ENDPOINT.inventory
  ),
  post: HTTP_REQUEST.post<ApiResponse<InventoryModel>>(API_ENDPOINT.inventory),
  put: HTTP_REQUEST.put<ApiResponse<InventoryModel>>(API_ENDPOINT.inventory),
  delete: HTTP_REQUEST.delete<ApiResponse<void>>(API_ENDPOINT.inventory),
};
