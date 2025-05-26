import { getUserFn } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";

export const useGetUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUserFn,
  });
};
