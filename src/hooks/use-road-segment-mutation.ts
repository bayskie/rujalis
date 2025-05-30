import { addRoadSegment, editRoadSegmentById } from "@/api/road-segment";
import type { RoadSegmentFormRequest } from "@/types/road-segment";
import { useMutation } from "@tanstack/react-query";

export const useAddRoadSegmentMutation = () => {
  return useMutation({
    mutationFn: (data: RoadSegmentFormRequest) => addRoadSegment(data),
  });
};

export const useEditRoadSegmentMutation = () => {
  return useMutation({
    mutationFn: ({
      segmentId,
      data,
    }: {
      segmentId: string;
      data: RoadSegmentFormRequest;
    }) => editRoadSegmentById(segmentId, data),
  });
};
