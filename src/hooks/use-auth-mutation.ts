import { getUserFn, loginFn, registerFn } from "@/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useLoginMutation = () => {
  const { setUser, setToken } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginFn,

    onSuccess: async (data) => {
      if (data.meta.token) {
        setToken(data.meta.token);
      }

      const { data: userData } = await queryClient.fetchQuery({
        queryKey: ["user"],
        queryFn: getUserFn,
      });

      if (userData?.user) {
        setUser(userData.user);
      } else {
        setUser(null);
      }

      navigate("/");
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
