// @features/customer/hooks/useCustomer.ts
import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { CustomerCreateDTO, CustomerUpdateDTO } from "@core/model/customer";
import { customerService } from "@core/services/customer";
import useDebounce from "@features/_global/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

interface Options {
  page?: number;
  perPage?: number;
  search?: string;
}

type PayloadType = "create" | "update" | "delete";

interface CustomerMutation {
  type: PayloadType;
  data?: CustomerCreateDTO | CustomerUpdateDTO;
  id?: string;
}

export const useCustomer = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const searchQuery = options?.search || searchParams.get("search") || undefined;

  const search = useDebounce(searchQuery as string, 500);
  
  const query = useQuery({
    queryKey: ["customers", { page, perPage, search }],
    queryFn: () =>
      customerService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          search,
        },
      }),
  });
  return query;
};

export function useCustomerCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: CustomerMutation) => {
      switch (type) {
        case "create":
          return customerService.post(data);
        case "update":
          return customerService.put(data, { path: id });
        case "delete":
          return customerService.delete({ path: id });
        default:
          return customerService.post(data);
      }
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/dashboard/customer");
      
      queryClient.removeQueries({ queryKey: ["customers"] });
      queryClient.removeQueries({ queryKey: ["customersById"] });
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

export function useCustomerById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["customersById", id],
    queryFn: () => customerService.getById({ path: id }),
    enabled: !!id,
  });
}

export function useCustomerSearch() {
  const mutation = useMutation({
    mutationFn: async (plateNumber: string) => {
      return customerService.searchByPlate({ path: plateNumber });
    },
    onError: (err: ApiErrorResponse<ApiResponse>) => {
      toast.error(err.message || "Customer tidak ditemukan", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
    },
  });
  return mutation;
}

export function useCustomerTransactionHistory() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["customerTransactions", id],
    queryFn: () => customerService.getTransactionHistory({ path: `${id}/transactions` }),
    enabled: !!id,
  });
}