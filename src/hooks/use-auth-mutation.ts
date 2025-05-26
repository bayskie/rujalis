import { loginFn, registerFn } from "@/api/auth";
import { useGetUserQuery } from "@/hooks/use-user-query";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useLoginMutation = () => {
  const { setUser, setToken } = useAuthStore();
  const getUserQuery = useGetUserQuery();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginFn,

    onSuccess: async (data) => {
      if (data.meta.token) {
        setToken(data.meta.token);
      }

      const { data: userData } = await getUserQuery.refetch();

      if (userData?.data?.user) {
        setUser(userData.data.user);
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
