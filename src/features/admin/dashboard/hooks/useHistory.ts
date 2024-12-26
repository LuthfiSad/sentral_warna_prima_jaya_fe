import { historyService } from "@core/services/history";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

interface Options {
  page?: number;
  perPage?: number;
  type?: "Ont" | "Stb";
}

export const useHistory = (options?: Options) => {
  const [searchParams] = useSearchParams();
  const page = options?.page || searchParams.get("page") || 1;
  const perPage = options?.perPage || searchParams.get("perPage") || 10;
  const type = options?.type || searchParams.get("type") || undefined;

  const query = useQuery({
    queryKey: ["histories", { page, perPage, type }],
    queryFn: () =>
      historyService.get({
        queryParams: {
          perPage: perPage ? Number(perPage) : undefined,
          page: page ? Number(page) : undefined,
          type,
        },
      }),
  });
  return query;
};
