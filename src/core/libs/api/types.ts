export interface QueryParams {
  page?: number;
  limit?: number;
  perPage?: number;
  search?: string;
  status?: string;
  locationId?: string;
  deviceLocation?: string;
  role?: string;
  type?: string;
  transaction_id?: number;
  employee_id?: number;
}

export interface ApiOption {
  contentType?: "json" | "form-data" | "url-encoded";
  bearerToken?: string;
  headers?: HeadersInit;
  path?: string;
  queryParams?: QueryParams;
  responseType?: "json" | "blob";
}

export interface MetaResponse {
  page?: number;
  perPage?: number;
  totalData?: number;
  totalPages?: number;
}

export interface ApiResponse<Res = unknown> {
  status?: number;
  code?: string;
  message?: string;
  data?: Res;
  meta?: MetaResponse;
}

export type ApiErrorResponse<Res = unknown> = Res;

export const getContentType = (type?: ApiOption["contentType"]) => {
  switch (type) {
    case "form-data":
      return undefined;
    case "url-encoded":
      return "application/x-www-form-urlencoded";
    default:
      return "application/json";
  }
};

export type MethodTypes = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
