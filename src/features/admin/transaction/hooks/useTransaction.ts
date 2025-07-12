// @features/transaction/hooks/useTransaction.ts
import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { TransactionCreateDTO, TransactionUpdateDTO } from "@core/model/transaction";
import { transactionService } from "@core/services/transaction";
import useDebounce from "@features/_global/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

interface Options {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
}

type PayloadType = 
  | "create" 
  | "update" 
  | "delete" 
  | "updateStatus" 
  | "startWork" 
  | "calculateCost" 
  | "finalize" 
  | "markPaid";

interface TransactionMutation {
  type: PayloadType;
  data?: TransactionCreateDTO | TransactionUpdateDTO | { status: string };
  id?: string;
}

export const useTransaction = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const searchQuery = options?.search || searchParams.get("search") || undefined;
  const status = options?.status || searchParams.get("status") || undefined;

  const search = useDebounce(searchQuery as string, 500);
  
  const query = useQuery({
    queryKey: ["transactions", { page, perPage, search, status }],
    queryFn: () =>
      transactionService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          search,
          status,
        },
      }),
  });
  return query;
};

export function useTransactionCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: TransactionMutation) => {
      switch (type) {
        case "create":
          return transactionService.post(data);
        case "update":
          return transactionService.put(data, { path: id });
        case "delete":
          return transactionService.delete({ path: id });
        case "updateStatus":
          return transactionService.updateStatus(data, { path: `${id}/status` });
        case "startWork":
          return transactionService.startWork(undefined, { path: `${id}/start-work` });
        case "calculateCost":
          return transactionService.calculateCost(data, { path: `${id}/calculate-cost` });
        case "finalize":
          return transactionService.finalize(undefined, { path: `${id}/finalize` });
        case "markPaid":
          return transactionService.markPaid(undefined, { path: `${id}/mark-paid` });
        default:
          return transactionService.post(data);
      }
    },
    onSuccess: (res, variables) => {
      const successMessages = {
        create: "Transaksi berhasil dibuat",
        update: "Transaksi berhasil diperbarui",
        delete: "Transaksi berhasil dihapus",
        updateStatus: "Status transaksi berhasil diperbarui",
        startWork: "Pekerjaan berhasil dimulai",
        calculateCost: "Biaya berhasil dihitung",
        finalize: "Transaksi berhasil diSELESAIkan",
        markPaid: "Transaksi berhasil ditandai sebagai DIBAYAR",
      };

      toast.success(successMessages[variables.type] || res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });

      if (variables.type === "create") {
        navigate("/dashboard/transaction");
      }
      
      queryClient.removeQueries({ queryKey: ["transactions"] });
      queryClient.removeQueries({ queryKey: ["transactionsById"] });
      queryClient.removeQueries({ queryKey: ["transactionHistory"] });
    },
    onError: (err: ApiErrorResponse<ApiResponse>) => {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
    },
  });
  return mutation;
}

export function useTransactionById(option?: { id?: string }) {
  const { id } = useParams();
  const transaction_id = option?.id || id;
  return useQuery({
    queryKey: ["transactionsById", transaction_id],
    queryFn: () => transactionService.getById({ path: transaction_id }),
    enabled: !!transaction_id,
  });
}

export function useTransactionHistory() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["transactionHistory", id],
    queryFn: () => transactionService.getHistory({ path: `${id}/history` }),
    enabled: !!id,
  });
}