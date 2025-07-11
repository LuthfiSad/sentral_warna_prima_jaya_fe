// @features/history/hooks/useHistory.ts
import { historyService } from "@core/services/history";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";

interface Options {
  page?: number;
  perPage?: number;
  transaction_id?: number;
  employee_id?: number;
}

export const useHistory = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const transaction_id = options?.transaction_id || searchParams.get("transaction_id") || undefined;
  const employee_id = options?.employee_id || searchParams.get("employee_id") || undefined;

  const query = useQuery({
    queryKey: ["histories", { page, perPage, transaction_id, employee_id }],
    queryFn: () =>
      historyService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          transaction_id: transaction_id ? Number(transaction_id) : undefined,
          employee_id: employee_id ? Number(employee_id) : undefined,
        },
      }),
  });
  return query;
};

export function useHistoryById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["historiesById", id],
    queryFn: () => historyService.getById({ path: id }),
    enabled: !!id,
  });
}

export function useRecentActivities(limit: number = 10) {
  return useQuery({
    queryKey: ["recentActivities", limit],
    queryFn: () =>
      historyService.getRecentActivities({
        queryParams: { limit },
      }),
  });
}

export function useTransactionHistory() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["transactionHistory", id],
    queryFn: () => historyService.getTransactionHistory({ path: `transaction/${id}` }),
    enabled: !!id,
  });
}

export function useEmployeeActivities() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || 10;

  return useQuery({
    queryKey: ["employeeActivities", id, page, perPage],
    queryFn: () =>
      historyService.getEmployeeActivities({
        path: `employee/${id}`,
        queryParams: {
          page: Number(page),
          perPage: Number(perPage),
        },
      }),
    enabled: !!id,
  });
}