// @core/services/transaction.ts
import { API_ENDPOINT } from "@core/configs/app";
import { HTTP_REQUEST } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { HistoryModel } from "@core/model/history";
import { TransactionModel } from "@core/model/transaction";

export const transactionService = {
  get: HTTP_REQUEST.get<ApiResponse<TransactionModel[]>>(API_ENDPOINT.transaction),
  getById: HTTP_REQUEST.get<ApiResponse<TransactionModel>>(API_ENDPOINT.transaction),
  post: HTTP_REQUEST.post<ApiResponse<TransactionModel>>(API_ENDPOINT.transaction),
  put: HTTP_REQUEST.put<ApiResponse<TransactionModel>>(API_ENDPOINT.transaction),
  delete: HTTP_REQUEST.delete<ApiResponse<void>>(API_ENDPOINT.transaction),
  updateStatus: HTTP_REQUEST.patch<ApiResponse<TransactionModel>>(
    API_ENDPOINT.transaction
  ),
  startWork: HTTP_REQUEST.post<ApiResponse<TransactionModel>>(
    API_ENDPOINT.transaction
  ),
  calculateCost: HTTP_REQUEST.post<ApiResponse<TransactionModel>>(
    API_ENDPOINT.transaction
  ),
  finalize: HTTP_REQUEST.post<ApiResponse<TransactionModel>>(
    API_ENDPOINT.transaction
  ),
  markPaid: HTTP_REQUEST.post<ApiResponse<TransactionModel>>(
    API_ENDPOINT.transaction
  ),
  getHistory: HTTP_REQUEST.get<ApiResponse<HistoryModel[]>>(
    API_ENDPOINT.transaction
  ),
};