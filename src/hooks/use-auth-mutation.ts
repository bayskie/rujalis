import { loginFn, registerFn } from "@/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useLoginMutation = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginFn,

    onSuccess: (data) => {
      if (data.meta.token) {
        authStore.setToken(data.meta.token);
      }

      navigate("/dashboard");
    },
  });
};

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: registerFn,
    onSuccess: () => {
      navigate("/login");
    },
  });
};
