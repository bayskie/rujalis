import type { Meta } from "@/types/meta";

export interface GetMasterRoadMaterialsResponse extends Meta {
  ekisting: {
    id: string;
    value: string;
  }[];
}

export interface GetMasterRoadTypesResponse extends Meta {
  ekisting: {
    id: string;
    value: string;
  }[];
}

export interface GetMasterRoadConditionsResponse extends Meta {
  ekisting: {
    id: string;
    value: string;
  }[];
}
