import {
  ApiErrorResponse,
  ApiResponse,
  QueryParams,
} from "@core/libs/api/types";
import { acaraService } from "@core/services/acara";
import { useAuth } from "@features/auth/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useDebounce from "./useDebounce";

interface Options extends QueryParams {
  page?: number;
  perPage?: number;
  name?: string;
}

type PayloadType = "create" | "update" | "delete";

interface AcaraCreation {
  type: PayloadType;
  data?: FormData;
  id?: string;
}

export function useAcara(options?: Options) {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const searchQuery =
    options?.search || searchParams.get("search") || undefined;
  const search = useDebounce(searchQuery as string, 500);

  const query = useQuery({
    queryKey: ["acaras", { page, perPage, search }],
    queryFn: () =>
      acaraService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          name: search,
        } as Options,
      }),
  });
  return query;
}

export function useAcaraCreation() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: AcaraCreation) => {
      switch (type) {
        case "create":
          return acaraService.post(data, {
            contentType: "form-data",
            bearerToken: auth?.token,
          });
        case "update":
          return acaraService.put(data, {
            contentType: "form-data",
            path: id,
            bearerToken: auth?.token,
          });
        case "delete":
          return acaraService.delete({ path: id, bearerToken: auth?.token });
        default:
          return acaraService.post(data, {
            contentType: "form-data",
            bearerToken: auth?.token,
          });
      }
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 2500,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/admin/acara");

      queryClient.removeQueries({ queryKey: ["acaras"] });
      queryClient.removeQueries({ queryKey: ["acarasById"] });
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

export function useAcaraById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["acarasById", id],
    queryFn: () => acaraService.getById({ path: id }),
    enabled: !!id,
  });
}
