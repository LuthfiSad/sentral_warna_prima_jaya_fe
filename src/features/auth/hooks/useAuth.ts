import { AuthLoginDTO } from "@core/model/auth";
import { authService } from "@core/services/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useAuthLogin() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (body: AuthLoginDTO) => authService.login(body),
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      localStorage.setItem("token", res?.data?.access_token as string);
      navigate("/admin/ont");
    },
    onError: (err) => {
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

export function useCheckToken() {
  const query = useQuery({
    queryKey: ["checkToken"],
    queryFn: () => authService.check(),
  });
  return query;
}

export function useAuth() {
  const token = localStorage.getItem("token") || "";
  const { data, isLoading } = useCheckToken();

  if (!token) {
    return undefined;
  }

  if (isLoading) {
    return {
      isLoading,
    };
  }

  if (data?.code === "UNAUTHORIZED" || data?.status === 401) {
    localStorage.removeItem("token");
    return undefined;
  }
  return {
    data,
  };
}
