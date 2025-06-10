import { queryClient } from "@core/libs/query/query";
import { AuthLoginDTO, AuthRegisterDTO } from "@core/model/auth";
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
      queryClient.removeQueries({ queryKey: ["checkToken"] });
      navigate("/");
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

export function useAuthRegister() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (body: AuthRegisterDTO) => authService.register(body),
    onSuccess: (res) => {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
      navigate("/login");
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
