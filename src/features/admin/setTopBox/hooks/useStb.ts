import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { StbDTO } from "@core/model/stb";
import { stbService } from "@core/services/stb";
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
  deviceLocation?: string;
}

type PayloadType = "create" | "update" | "delete";

interface StbCreation {
  type: PayloadType;
  data?: StbDTO;
  id?: string;
}

export const useStb = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const status = options?.status || searchParams.get("status") || undefined;
  const locationId =
    options?.locationId || searchParams.get("locationId") || undefined;
  const deviceLocation =
    options?.deviceLocation || searchParams.get("deviceLocation") || undefined;
  const searchQuery =
    options?.search || searchParams.get("search") || undefined;

  const search = useDebounce(searchQuery as string, 500);
  const query = useQuery({
    queryKey: [
      "stbs",
      { page, perPage, search, status, locationId, deviceLocation },
    ],
    queryFn: () =>
      stbService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          status,
          locationId,
          search,
          deviceLocation,
        },
      }),
  });
  return query;
};

export function useStbCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: StbCreation) => {
      switch (type) {
        case "create":
          return stbService.post(data);
        case "update":
          return stbService.put(data, {
            path: id,
          });
        case "delete":
          return stbService.delete({
            path: id,
          });
        default:
          return stbService.post(data);
      }
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/stb");

      queryClient.removeQueries({ queryKey: ["histories"] });
      queryClient.removeQueries({ queryKey: ["stbs"] });
      queryClient.removeQueries({ queryKey: ["stbsById"] });
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

export function useStbById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["stbsById", id],
    queryFn: () => stbService.getById({ path: id }),
    enabled: !!id,
  });
}
