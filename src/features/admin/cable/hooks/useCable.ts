import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { CableDTO } from "@core/model/cable";
import { cableService } from "@core/services/cable";
import useDebounce from "@features/_global/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

interface Options {
  page?: number;
  perPage?: number;
  search?: string;
  type?: "Adaptor" | "Patchcord";
  locationId?: string;
}

type PayloadType = "create" | "update" | "delete";

interface CableCreation {
  type: PayloadType;
  data?: CableDTO;
  id?: string;
}

export const useCable = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const type = options?.type || searchParams.get("type") || undefined;
  const locationId =
    options?.locationId || searchParams.get("locationId") || undefined;
  const searchQuery =
    options?.search || searchParams.get("search") || undefined;

  const search = useDebounce(searchQuery as string, 500);
  const query = useQuery({
    queryKey: ["cables", { page, perPage, search, type, locationId }],
    queryFn: () =>
      cableService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          search,
          type,
          locationId,
        },
      }),
  });
  return query;
};

export function useCableCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: CableCreation) => {
      switch (type) {
        case "create":
          return cableService.post(data);
        case "update":
          return cableService.put(data, {
            path: id,
          });
        case "delete":
          return cableService.delete({
            path: id,
          });
        default:
          return cableService.post(data);
      }
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/cable");

      queryClient.removeQueries({ queryKey: ["cables"] });
      queryClient.removeQueries({ queryKey: ["cablesById"] });
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

export function useCableById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["cablesById", id],
    queryFn: () => cableService.getById({ path: id }),
    enabled: !!id,
  });
}
