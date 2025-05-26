import type { Meta } from "@/types/meta";

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  meta: { token: string } & Meta;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  meta: { data: User } & Meta;
}

export interface GetUserResponse {
  meta: Meta;
  data: {
    user: User;
  };
}

export interface LogoutRequest {
  email: string;
  password: string;
}

export interface LogoutResponse {
  meta: Meta;
  data: unknown[];
}
