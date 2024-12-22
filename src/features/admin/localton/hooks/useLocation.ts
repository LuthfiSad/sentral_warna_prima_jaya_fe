import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { LocationDTO } from "@core/model/location";
import { locationService } from "@core/services/location";
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

interface LocationCreation {
  type: PayloadType;
  data?: LocationDTO;
  id?: string;
}

export const useLocation = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const searchQuery =
    options?.search || searchParams.get("search") || undefined;

  const search = useDebounce(searchQuery as string, 500);
  const query = useQuery({
    queryKey: ["locations", { page, perPage, search }],
    queryFn: () =>
      locationService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          search,
        },
      }),
  });
  return query;
};

export function useLocationCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: LocationCreation) => {
      switch (type) {
        case "create":
          return locationService.post(data);
        case "update":
          return locationService.put(data, {
            path: id,
          });
        case "delete":
          return locationService.delete({
            path: id,
          });
        default:
          return locationService.post(data);
      }
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/admin/location");

      queryClient.removeQueries({ queryKey: ["locations"] });
      queryClient.removeQueries({ queryKey: ["locationsById"] });
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

export function useLocationById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["locationsById", id],
    queryFn: () => locationService.getById({ path: id }),
    enabled: !!id,
  });
}
