import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { exportService } from "@core/services/export";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface Options {
  type: "stb" | "ont";
  locationId?: string;
}

export function useExport() {
  const mutation = useMutation({
    mutationFn: async ({ type, locationId }: Options) => {
      const response =
        type === "stb"
          ? await exportService.postStb(undefined, {
              queryParams: { locationId },
            })
          : await exportService.postOnt(undefined, {
              queryParams: { locationId },
            });

      const url = window.URL.createObjectURL(response as Blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${type}-export-${new Date(Date.now()).toLocaleDateString()}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { message: "File berhasil diunduh!" };
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
      toast.error(err?.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
    },
  });
  return mutation;
}
