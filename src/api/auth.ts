import { authClient, guestClient } from "@/lib/http-client";
import type {
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

export const loginFn = (data: LoginRequest): Promise<LoginResponse> =>
  guestClient.post("/login", data).then((res) => res.data);

export const registerFn = (data: RegisterRequest): Promise<RegisterResponse> =>
  guestClient.post("/register", data).then((res) => res.data);

export const getUserFn = (): Promise<GetUserResponse> =>
  authClient.get("/user").then((res) => res.data);
