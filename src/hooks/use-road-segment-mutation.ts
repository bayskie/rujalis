import {
  addRoadSegment,
  deleteRoadSegmentById,
  editRoadSegmentById,
} from "@/api/road-segment";
import type { RoadSegmentFormRequest } from "@/types/road-segment";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useAddRoadSegmentMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RoadSegmentFormRequest) => addRoadSegment(data),
    onSuccess: () => {
      navigate("/road-segments");
      toast.info("Berhasil menambahkan ruas jalan");
    },
  });
};

export const useEditRoadSegmentMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      segmentId,
      data,
    }: {
      segmentId: string;
      data: RoadSegmentFormRequest;
    }) => editRoadSegmentById(segmentId, data),
    onSuccess: () => {
      navigate("/road-segments");
      toast.info("Berhasil mengedit ruas jalan");
    },
  });
};

export const useDeleteRoadSegmentMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (segmentId: string) => deleteRoadSegmentById(segmentId),
    onSuccess: () => {
      navigate("/road-segments");
      toast.info("Berhasil menghapus ruas jalan");
    },
  });
};
