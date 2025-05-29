import { authClient } from "@/lib/http-client";
import type {
  GetMasterRoadConditionsResponse,
  GetMasterRoadMaterialsResponse,
  GetMasterRoadTypesResponse,
} from "@/types/master-data";

export const getMasterRoadMaterialsFn =
  (): Promise<GetMasterRoadMaterialsResponse> =>
    authClient.get(`/meksisting`).then((res) => res.data);

export const getMasterRoadTypesFn = (): Promise<GetMasterRoadTypesResponse> =>
  authClient.get(`/mjenisjalan`).then((res) => res.data);

export const getMasterRoadConditionsFn =
  (): Promise<GetMasterRoadConditionsResponse> =>
    authClient.get(`/mkondisi`).then((res) => res.data);
