import type { User } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  needsReauth: boolean;
  setUser: (user: User | null, needsReauth?: boolean) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      needsReauth: false,
      setUser: (user, needsReauth = false) => set({ user, needsReauth }),
      setToken: (token) => set({ token }),
      logout: () => set({ token: null, user: null, needsReauth: true }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
