import {
  getAllRoadSegmentsFn,
  getRoadSegmentBySegmentIdFn,
} from "@/api/road-segment";
import { useQuery } from "@tanstack/react-query";

export const useAllRoadSegmentsQuery = () => {
  return useQuery({
    queryKey: ["all-road-segments"],
    queryFn: getAllRoadSegmentsFn,
    staleTime: 1000 * 60 * 10,
  });
};

export const useRoadSegmentByIdQuery = (roadSegmentId: string) => {
  return useQuery({
    queryKey: ["road-segment", roadSegmentId],
    queryFn: () => getRoadSegmentBySegmentIdFn(roadSegmentId),
    enabled: !!roadSegmentId,
    staleTime: 1000 * 60 * 10,
  });
};
