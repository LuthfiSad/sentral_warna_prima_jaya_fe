import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { attendanceService } from "@core/services/attendance";
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

type PayloadType = "create" | "delete";

interface AttendanceCreation {
  type: PayloadType;
  data?: {
    attendance_ids?: string[];
  };
}

export const useAttendance = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const searchQuery =
    options?.search || searchParams.get("search") || undefined;

  const search = useDebounce(searchQuery as string, 500);
  const query = useQuery({
    queryKey: ["attendances", { page, perPage, search }],
    queryFn: () =>
      attendanceService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          search,
        },
      }),
  });
  return query;
};

export function useAttendanceCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ data, type }: AttendanceCreation) => {
      switch (type) {
        case "delete":
          return attendanceService.post(data);
        default:
          return attendanceService.post(data);
      }
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/dashboard/attendance");

      queryClient.removeQueries({ queryKey: ["attendances"] });
      queryClient.removeQueries({ queryKey: ["attendancesById"] });
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

export function useAttendanceCheck() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({
      data,
      type,
    }: {
      data: FormData;
      type: "checkin" | "checkout";
    }) => {
      switch (type) {
        case "checkout":
          return attendanceService.checkout(data, {
            contentType: "form-data",
          });
        case "checkin":
          return attendanceService.checkin(data, {
            contentType: "form-data",
          })
        default:
          return attendanceService.checkin(data, {
            contentType: "form-data",
          });
      }
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/login");

      queryClient.removeQueries({ queryKey: ["attendances"] });
      queryClient.removeQueries({ queryKey: ["attendancesById"] });
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

// export function useAttendanceCheckout() {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   return useMutation({
//     mutationFn: async (data: FormData) => {
//       return attendanceService.checkout(data, {
//         contentType: "form-data",
//       });
//     },
//     onSuccess: (res) => {
//       toast.success(res.message, {
//         position: "top-right",
//         autoClose: 3000,
//         pauseOnHover: true,
//         theme: "dark",
//       });
//       navigate("/login");

//       queryClient.removeQueries({ queryKey: ["attendances"] });
//       queryClient.removeQueries({ queryKey: ["attendancesById"] });
//     },
//     onError: (err: ApiErrorResponse<ApiResponse>) => {
//       toast.error(err.message, {
//         position: "top-right",
//         autoClose: 3000,
//         pauseOnHover: true,
//         theme: "dark",
//       });
//     },
//   });
// }

export function useAttendanceById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["attendancesById", id],
    queryFn: () => attendanceService.getById({ path: id }),
    enabled: !!id,
  });
}
