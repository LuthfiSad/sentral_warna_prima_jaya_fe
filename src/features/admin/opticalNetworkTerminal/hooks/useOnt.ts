import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { OntDTO } from "@core/model/ont";
import { ontService } from "@core/services/ont";
import useDebounce from "@features/_global/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

interface Options {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  locationId?: string;
}

type PayloadType = "create" | "update" | "delete";

interface OntCreation {
  type: PayloadType;
  data?: OntDTO;
  id?: string;
}

export const useOnt = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const status = options?.status || searchParams.get("status") || undefined;
  const locationId =
    options?.locationId || searchParams.get("locationId") || undefined;
  const searchQuery =
    options?.search || searchParams.get("search") || undefined;

  const search = useDebounce(searchQuery as string, 500);
  const query = useQuery({
    queryKey: ["onts", { page, perPage, search, status, locationId }],
    queryFn: () =>
      ontService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          status,
          locationId,
          search,
        },
      }),
  });
  return query;
};

export function useOntCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: OntCreation) => {
      switch (type) {
        case "create":
          return ontService.post(data);
        case "update":
          return ontService.put(data, {
            path: id,
          });
        case "delete":
          return ontService.delete({
            path: id,
          });
        default:
          return ontService.post(data);
      }
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate(-1);

      queryClient.removeQueries({ queryKey: ["histories"] });
      queryClient.removeQueries({ queryKey: ["onts"] });
      queryClient.removeQueries({ queryKey: ["ontsById"] });
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

export function useOntById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["ontsById", id],
    queryFn: () => ontService.getById({ path: id }),
    enabled: !!id,
  });
}
