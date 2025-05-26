import { useAuthStore } from "@/stores/auth-store";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const authStore = useAuthStore();

  return authStore.token ? <Outlet /> : <Navigate to="/login" />;
}
