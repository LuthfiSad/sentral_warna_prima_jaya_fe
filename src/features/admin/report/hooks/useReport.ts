import { ApiErrorResponse, ApiResponse } from "@core/libs/api/types";
import { ReportModel } from "@core/model/report";
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
}

type PayloadType = "create" | "delete" | "changeStatus";

interface ReportCreation {
  type: PayloadType;
  data?: FormData | { status: string };
  id?: string;
}

export const useReport = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const searchQuery =
    options?.search || searchParams.get("search") || undefined;

  const search = useDebounce(searchQuery as string, 500);
  const query = useQuery({
    queryKey: ["reports", { page, perPage, search }],
    queryFn: () =>
      reportService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          search,
        },
      }),
  });
  return query;
};

export function useReportCreation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ data, type, id }: ReportCreation) => {
      switch (type) {
        case "create":
          return reportService.post(data, { contentType: "form-data" });
        case "changeStatus":
          return reportService.patch(data, {
            path: `${id}/status`
          });
        case "delete":
          return reportService.delete({
            path: id,
          });
        default:
          return reportService.post(data);
      }
    },
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/report");

      queryClient.removeQueries({ queryKey: ["reports"] });
      queryClient.removeQueries({ queryKey: ["reportsById"] });
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

export function useReportById() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["reportsById", id],
    queryFn: () => reportService.getById({ path: id }),
    enabled: !!id,
  });
}

export function useReportExport() {
  const mutation = useMutation({
    mutationFn: async () => {
      return reportService.get();
    },
    onSuccess: (res) => {
      // Create and download CSV file
      const csvContent = convertToCSV(res.data as ReportModel[]);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reports_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
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

// Helper function to convert data to CSV
function convertToCSV(data: ReportModel[]): string {
  if (!data || data.length === 0) return '';
  
  const headers = ['Date', 'Employee Name', 'Report', 'Status'];
  const csvRows = [headers.join(',')];
  
  data.forEach(item => {
    const row = [
      item.date,
      `"${item.employee.name}"`,
      `"${item.report.replace(/"/g, '""')}"`,
      item.status
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
}