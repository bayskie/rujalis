import {
  addRoadSegment,
  deleteRoadSegmentById,
  editRoadSegmentById,
} from "@/api/road-segment";
import type { RoadSegmentFormRequest } from "@/types/road-segment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const QUERY_KEY = "all-road-segments";

export const useAddRoadSegmentMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoadSegmentFormRequest) => addRoadSegment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      navigate("/road-segments");
      toast.info("Berhasil menambahkan ruas jalan");
    },
    onError: () => {
      navigate("/road-segments");
      toast.error("Gagal menambahkan ruas jalan");
    },
  });
};

export const useEditRoadSegmentMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      segmentId,
      data,
    }: {
      segmentId: string;
      data: RoadSegmentFormRequest;
    }) => editRoadSegmentById(segmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      navigate("/road-segments");
      toast.info("Berhasil mengedit ruas jalan");
    },
    onError: () => {
      navigate("/road-segments");
      toast.error("Gagal mengedit ruas jalan");
    },
  });
};

export const useDeleteRoadSegmentMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (segmentId: string) => deleteRoadSegmentById(segmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      navigate("/road-segments");
      toast.info("Berhasil menghapus ruas jalan");
    },
    onError: () => {
      navigate("/road-segments");
      toast.error("Gagal menghapus ruas jalan");
    },
  });
};
