import { authClient } from "@/lib/http-client";
import type {
  GetAllProvincesResponse,
  GetAllRegenciesByProvinceIdResponse,
  GetAllSubdistrictsByRegencyIdResponse,
  GetAllVillagesBySubdistrictIdResponse,
  GetProvinceByIdResponse,
} from "@/types/region";

export const getAllProvincesFn = (): Promise<GetAllProvincesResponse> =>
  authClient.get(`/mregion`).then((res) => res.data);

export const getProvinceByProvinceIdFn = (
  provinceId: string,
): Promise<GetProvinceByIdResponse> =>
  authClient.get(`/provinsi/${provinceId}`).then((res) => res.data);

export const getAllRegenciesByProvinceIdFn = (
  provinceId: string,
): Promise<GetAllRegenciesByProvinceIdResponse> =>
  authClient.get(`/kabupaten/${provinceId}`).then((res) => res.data);

export const getAllSubdistrictsByRegencyIdFn = (
  regencyId: string,
): Promise<GetAllSubdistrictsByRegencyIdResponse> =>
  authClient.get(`/kecamatan/${regencyId}`).then((res) => res.data);

export const getAllVillagesBySubdistrictIdFn = (
  subdistrictId: string,
): Promise<GetAllVillagesBySubdistrictIdResponse> =>
  authClient.get(`/desa/${subdistrictId}`).then((res) => res.data);
