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

export interface EnrichedRoadSegment extends RoadSegment {
  eksisting: string;
  kondisi: string;
  jenisjalan: string;
  desa: string;
  kecamatan_id: string;
  kecamatan: string;
  kabupaten_id: string;
  kabupaten: string;
  provinsi_id: string;
  provinsi: string;
}

export interface RoadSegmentFilterOptions {
  road_name?: string;
  min_length?: number;
  max_length?: number;
  min_width?: number;
  max_width?: number;
  material_ids?: string[];
  condition_ids?: string[];
  type_ids?: string[];
  village_id?: string;
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

export interface GetEnrichedRoadSegmentByIdResponse extends Meta {
  ruasjalan: EnrichedRoadSegment;
}
