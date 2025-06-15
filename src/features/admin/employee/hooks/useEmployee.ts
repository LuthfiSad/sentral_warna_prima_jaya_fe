import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { employeeService } from "@core/services/employee";
import useDebounce from "@features/_global/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

interface Options {
  page?: number;
  perPage?: number;
  search?: string;
  divisi?: string;
}

type PayloadType = "create" | "update" | "delete";

interface EmployeeCreation {
  type: PayloadType;
  data?: FormData;
  id?: string;
}

export const useEmployee = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const searchQuery =
    options?.search || searchParams.get("search") || undefined;

  const search = useDebounce(searchQuery as string, 500);
  const query = useQuery({
    queryKey: ["employees", { page, perPage, search }],
    queryFn: () =>
      employeeService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          search,
        },
      }),
  });
  return query;
};

export function useEmployeeCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: EmployeeCreation) => {
      switch (type) {
        case "create":
          return employeeService.post(data, { contentType: "form-data" });
        case "update":
          return employeeService.put(data, {
            path: id,
            contentType: "form-data",
          });
        case "delete":
          return employeeService.delete({
            path: id,
          });
        default:
          return employeeService.post(data);
      }
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/dashboard/employee");

      queryClient.removeQueries({ queryKey: ["employees"] });
      queryClient.removeQueries({ queryKey: ["employeesById"] });
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

export function useEmployeeVerify() {
  return useMutation({
    mutationFn: async (data: FormData) => {
      return employeeService.verify(data, {
        contentType: "form-data",
      });
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
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
}

export function useEmployeeById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["employeesById", id],
    queryFn: () => employeeService.getById({ path: id }),
    enabled: !!id,
  });
}
