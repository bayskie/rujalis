import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

export const authClient = axios.create({
  baseURL: API_BASE_URL,
});

authClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export const guestClient = axios.create({
  baseURL: API_BASE_URL,
});

export const nominatimClient = axios.create({
  baseURL: NOMINATIM_BASE_URL,
  headers: {
    "Accept-Language": "id",
  },
});
