export interface Meta {
  code: number;
  message?: string;
  status?: "success" | "failed";
  "token-expired"?: number;
}
