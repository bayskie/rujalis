import { authClient } from "@/lib/http-client";
import type {
  RoadSegmentFormRequest,
  RoadSegmentFormResponse,
  GetAllRoadSegmentsResponse,
  GetRoadSegmentByIdResponse,
} from "@/types/road-segment";

export const getAllRoadSegmentsFn = (): Promise<GetAllRoadSegmentsResponse> =>
  authClient.get(`/ruasjalan`).then((res) => res.data);

export const getRoadSegmentBySegmentIdFn = (
  roadSegmentId: string,
): Promise<GetRoadSegmentByIdResponse> =>
  authClient.get(`/ruasjalan/${roadSegmentId}`).then((res) => res.data);

export const addRoadSegment = (
  data: RoadSegmentFormRequest,
): Promise<RoadSegmentFormResponse> =>
  authClient.post("/ruasjalan", data).then((res) => res.data);

export const editRoadSegmentById = (
  roadSegmentId: string,
  data: RoadSegmentFormRequest,
): Promise<RoadSegmentFormResponse> =>
  authClient.put(`/ruasjalan/${roadSegmentId}`, data).then((res) => res.data);
