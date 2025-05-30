import type { Meta } from "@/types/meta";

export interface GetMasterRoadMaterialsResponse extends Meta {
  eksisting: {
    id: string;
    eksisting: string;
  }[];
}

export interface GetMasterRoadTypesResponse extends Meta {
  eksisting: {
    id: string;
    jenisjalan: string;
  }[];
}

export interface GetMasterRoadConditionsResponse extends Meta {
  eksisting: {
    id: string;
    kondisi: string;
  }[];
}
