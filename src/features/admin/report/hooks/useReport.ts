// @features/report/hooks/useReport.ts - Updated for new flow
import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { reportService } from "@core/services/report";
import useDebounce from "@features/_global/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

interface Options {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  transaction_id?: number;
}

type PayloadType = 
  | "create" 
  | "update" 
  | "delete" 
  | "submit" 
  | "approve" 
  | "reject";

interface ReportMutation {
  type: PayloadType;
  data?: FormData | { reason?: string };
  id?: string;
}

export const useReport = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const searchQuery = options?.search || searchParams.get("search") || undefined;
  const status = options?.status || searchParams.get("status") || undefined;
  const transaction_id = options?.transaction_id || searchParams.get("transaction_id") || undefined;

  const search = useDebounce(searchQuery as string, 500);
  
  const query = useQuery({
    queryKey: ["reports", { page, perPage, search, status, transaction_id }],
    queryFn: () =>
      reportService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          search,
          status,
          transaction_id: transaction_id ? Number(transaction_id) : undefined,
        },
      }),
  });
  return query;
};

export function useReportCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: ReportMutation) => {
      switch (type) {
        case "create":
          return reportService.post(data, { contentType: "form-data" });
        case "update":
          return reportService.put(data, {
            path: id,
            contentType: "form-data",
          });
        case "delete":
          return reportService.delete({ path: id });
        case "submit":
          return reportService.submit(undefined, { path: `${id}/submit` });
        case "approve":
          return reportService.approve(undefined, { path: `${id}/approve` });
        case "reject":
          return reportService.reject(data, { path: `${id}/reject` });
        default:
          return reportService.post(data);
      }
    },
    onSuccess: (res, variables) => {
      const successMessages = {
        create: "Draft laporan berhasil dibuat",
        update: "Laporan berhasil diperbarui",
        delete: "Laporan berhasil dihapus",
        submit: "Laporan berhasil disubmit untuk approval",
        approve: "Laporan berhasil disetujui",
        reject: "Laporan berhasil ditolak",
      };

      toast.success(successMessages[variables.type] || res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });

      if (variables.type === "create") {
        navigate("/dashboard/report");
      }
      
      queryClient.removeQueries({ queryKey: ["reports"] });
      queryClient.removeQueries({ queryKey: ["reportsById"] });
      queryClient.removeQueries({ queryKey: ["PENDINGReports"] });
      queryClient.removeQueries({ queryKey: ["transactions"] });
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

export function useReportById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["reportsById", id],
    queryFn: () => reportService.getById({ path: id }),
    enabled: !!id,
  });
}

export function usePendingReports() {
  return useQuery({
    queryKey: ["PENDINGReports"],
    queryFn: () => reportService.getPendingApproval(),
  });
}

export function useReportsByTransaction(transactionId: number) {
  return useQuery({
    queryKey: ["reportsByTransaction", transactionId],
    queryFn: () => reportService.getByTransaction({ path: `transaction/${transactionId}` }),
    enabled: !!transactionId,
  });
}

export function useReportExport() {
  const mutation = useMutation({
    mutationFn: async () => {
      return reportService.exportExcel();
    },
    onSuccess: (res) => {
      // Handle file download
      const blob = new Blob([res.data as Blob], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `reports_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data berhasil diekspor", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
    },
    onError: (err: ApiErrorResponse<ApiResponse>) => {
      toast.error(err.message || "Gagal mengekspor data", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
    },
  });
  return mutation;
}