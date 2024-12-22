import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useAuth } from "@features/auth/hooks/useAuth";
import { subAcaraService } from "@core/services/subAcara";
import { toast } from "react-toastify";

// interface Options {
//   page?: number,
//   perPage?: number,
//   subAcaraId?: string
// }

type PayloadType = "create" | "update" | "delete";

interface SubAcaraCreation {
  type: PayloadType;
  data?: FormData;
  id?: string;
}

export function useSubAcaraCreation() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: SubAcaraCreation) => {
      switch (type) {
        case "create":
          return subAcaraService.post(data, {
            contentType: "form-data",
            bearerToken: auth?.token,
          });
        case "update":
          return subAcaraService.put(data, {
            contentType: "form-data",
            path: id,
            bearerToken: auth?.token,
          });
        case "delete":
          return subAcaraService.delete({ path: id, bearerToken: auth?.token });
        default:
          return subAcaraService.post(data, {
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
      navigate("/admin/subacara");

      queryClient.removeQueries({ queryKey: ["acarasById"] });
      queryClient.removeQueries({ queryKey: ["absensis"] });
      queryClient.removeQueries({ queryKey: ["subacarasById"] });
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

export function useSubAcaraById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["subacarasById", id],
    queryFn: () => subAcaraService.getById({ path: id }),
    enabled: !!id,
  });
}

// export function useAbsensi(options?: Options) {
export function useAbsensi() {
  const { id } = useParams();
  // const [searchParams] = useSearchParams()
  // const page = options?.page || searchParams.get("page") || 1;
  // const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const query = useQuery({
    // queryKey: ['subacaras', { page, perPage }],
    queryKey: ["absensis", { id }],
    queryFn: () =>
      subAcaraService.getAbsensi({
        queryParams: {
          // perPage: perPage ? Number(perPage) : undefined,
          // page: page ? Number(page) : undefined
          subAcaraId: id,
        },
      }),
    enabled: !!id,
  });
  return query;
}
