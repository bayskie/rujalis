import {
  getMasterRoadConditionsFn,
  getMasterRoadMaterialsFn,
  getMasterRoadTypesFn,
} from "@/api/master-data";
import { useQuery } from "@tanstack/react-query";

export const useMasterRoadMaterialsQuery = () => {
  return useQuery({
    queryKey: ["master-road-materials"],
    queryFn: getMasterRoadMaterialsFn,
    staleTime: 1000 * 60 * 10,
  });
};

export const useMasterRoadTypesQuery = () => {
  return useQuery({
    queryKey: ["master-road-types"],
    queryFn: getMasterRoadTypesFn,
    staleTime: 1000 * 60 * 10,
  });
};

export const useMasterRoadConditionsQuery = () => {
  return useQuery({
    queryKey: ["master-road-conditions"],
    queryFn: getMasterRoadConditionsFn,
    staleTime: 1000 * 60 * 10,
  });
};
