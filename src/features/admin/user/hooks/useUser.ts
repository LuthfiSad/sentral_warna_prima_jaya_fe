import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { ChangePasswordDTO, UserDTO } from "@core/model/user";
import { userService } from "@core/services/user";
import useDebounce from "@features/_global/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

interface Options {
  page?: number;
  perPage?: number;
  search?: string;
  role?: string;
}

type PayloadType = "create" | "update" | "delete" | "change";

interface UserCreation {
  type: PayloadType;
  data?: UserDTO | ChangePasswordDTO;
  id?: string;
}

export const useUser = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const role = options?.role || searchParams.get("status") || undefined;
  const searchQuery =
    options?.search || searchParams.get("search") || undefined;

  const search = useDebounce(searchQuery as string, 500);
  const query = useQuery({
    queryKey: ["users", { page, perPage, search, role }],
    queryFn: () =>
      userService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          role,
          search,
        },
      }),
  });
  return query;
};

export function useUserCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: UserCreation) => {
      switch (type) {
        case "create":
          return userService.post(data);
        case "update":
          return userService.put(data, {
            path: id,
          });
        case "delete":
          return userService.delete({
            path: id,
          });
        case "change":
          return userService.changePassword(data, { path: id });
        default:
          return userService.post(data);
      }
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/user");

      queryClient.removeQueries({ queryKey: ["users"] });
      queryClient.removeQueries({ queryKey: ["usersById"] });
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

export function useUserById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["usersById", id],
    queryFn: () => userService.getById({ path: id }),
    enabled: !!id,
  });
}
