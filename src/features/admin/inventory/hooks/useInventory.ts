import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { InventoryDTO } from "@core/model/inventory";
import { inventoryService } from "@core/services/inventory";
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

interface InventoryCreation {
  type: PayloadType;
  data?: InventoryDTO;
  id?: string;
}

export const useInventory = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const searchQuery =
    options?.search || searchParams.get("search") || undefined;

  const search = useDebounce(searchQuery as string, 500);
  const query = useQuery({
    queryKey: ["inventoryes", { page, perPage, search }],
    queryFn: () =>
      inventoryService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          search,
        },
      }),
  });
  return query;
};

export function useInventoryCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: InventoryCreation) => {
      switch (type) {
        case "create":
          return inventoryService.post(data);
        case "update":
          return inventoryService.put(data, {
            path: id,
          });
        case "delete":
          return inventoryService.delete({
            path: id,
          });
        default:
          return inventoryService.post(data);
      }
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/inventory");

      queryClient.removeQueries({ queryKey: ["inventoryes"] });
      queryClient.removeQueries({ queryKey: ["inventoryesById"] });
      return;
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

export function useInventoryById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["inventoryesById", id],
    queryFn: () => inventoryService.getById({ path: id }),
    enabled: !!id,
  });
}
