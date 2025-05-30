import type { Meta } from "@/types/meta";
import type { roadSegmentFormSchema } from "@/validators/road-segment";
import { z } from "zod";

export interface RoadSegment {
  id: string;
  paths: string;
  desa_id: string;
  kode_ruas: string;
  nama_ruas: string;
  panjang: number;
  lebar: number;
  eksisting_id: string;
  kondisi_id: string;
  jenisjalan_id: string;
  keterangan: string;
}

export interface GetAllRoadSegmentsResponse extends Meta {
  ruasjalan: RoadSegment[];
}

export type RoadSegmentFormRequest = z.infer<typeof roadSegmentFormSchema>;

export interface RoadSegmentFormResponse extends Meta {
  ruasjalan: RoadSegment;
}

export interface GetRoadSegmentByIdResponse extends Meta {
  ruasjalan: RoadSegment;
}
