import {
  getAllProvincesFn,
  getAllRegenciesByProvinceIdFn,
  getAllSubdistrictsByRegencyIdFn,
  getAllVillagesBySubdistrictIdFn,
  getProvinceByProvinceIdFn,
  getVillageByIdFn,
} from "@/api/region";
import { useQuery } from "@tanstack/react-query";

export const useAllProvincesQuery = () => {
  return useQuery({
    queryKey: ["all-provinces"],
    queryFn: getAllProvincesFn,
    staleTime: 1000 * 60 * 10,
  });
};

export const useProvinceByProvinceIdQuery = (provinceId: string) => {
  return useQuery({
    queryKey: ["province", provinceId],
    queryFn: () => getProvinceByProvinceIdFn(provinceId),
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 10,
  });
};

export const useAllRegenciesByProvinceIdQuery = (provinceId: string) => {
  return useQuery({
    queryKey: ["regencies", provinceId],
    queryFn: () => getAllRegenciesByProvinceIdFn(provinceId),
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 10,
  });
};

export const useAllSubdistrictsByRegencyIdQuery = (regencyId: string) => {
  return useQuery({
    queryKey: ["subdistricts", regencyId],
    queryFn: () => getAllSubdistrictsByRegencyIdFn(regencyId),
    enabled: !!regencyId,
    staleTime: 1000 * 60 * 10,
  });
};

export const useAllVillagesBySubdistrictIdQuery = (subdistrictId: string) => {
  return useQuery({
    queryKey: ["villages", subdistrictId],
    queryFn: () => getAllVillagesBySubdistrictIdFn(subdistrictId),
    enabled: !!subdistrictId,
    staleTime: 1000 * 60 * 10,
  });
};

export const useVillageByIdQuery = (villageId: string) => {
  return useQuery({
    queryKey: ["village", villageId],
    queryFn: () => getVillageByIdFn(villageId),
    enabled: !!villageId,
    staleTime: 1000 * 60 * 10,
  });
};
