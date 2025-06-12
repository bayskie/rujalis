import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";

export default function ProtectedRoute() {
  const { token, needsReauth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (needsReauth) {
      navigate("/login");
    }
  }, [needsReauth, navigate]);

  return token ? <Outlet /> : <Navigate to="/login" />;
}
