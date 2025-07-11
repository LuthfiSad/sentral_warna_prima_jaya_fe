// @core/services/customer.ts
import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { CustomerModel, CustomerSearchResult } from "@core/model/customer";
import { TransactionModel } from "@core/model/transaction";

export const customerService = {
  get: HTTP_REQUEST.get<ApiResponse<CustomerModel[]>>(API_ENDPOINT.customer),
  getById: HTTP_REQUEST.get<ApiResponse<CustomerModel>>(API_ENDPOINT.customer),
  post: HTTP_REQUEST.post<ApiResponse<CustomerModel>>(API_ENDPOINT.customer),
  put: HTTP_REQUEST.put<ApiResponse<CustomerModel>>(API_ENDPOINT.customer),
  delete: HTTP_REQUEST.delete<ApiResponse<void>>(API_ENDPOINT.customer),
  searchByPlate: HTTP_REQUEST.get<ApiResponse<CustomerSearchResult>>(
    `${API_ENDPOINT.customer}/search/plate`
  ),
  getTransactionHistory: HTTP_REQUEST.get<ApiResponse<TransactionModel[]>>(
    API_ENDPOINT.customer
  ),
};