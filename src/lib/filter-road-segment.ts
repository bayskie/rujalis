import type { RoadSegment } from "@/types/road-segment";
import type { RoadSegmentFilterOptions } from "@/types/road-segment";

export function filterRoadSegments(
  segments: RoadSegment[],
  options?: RoadSegmentFilterOptions,
): RoadSegment[] {
  if (!options) return segments;

  return segments.filter((segment) => {
    if (
      options.road_name &&
      !segment.nama_ruas.toLowerCase().includes(options.road_name.toLowerCase())
    ) {
      return false;
    }

    if (
      options.min_length !== undefined &&
      segment.panjang < options.min_length
    ) {
      return false;
    }

    if (
      options.max_length !== undefined &&
      segment.panjang > options.max_length
    ) {
      return false;
    }

    if (options.min_width !== undefined && segment.lebar < options.min_width) {
      return false;
    }

    if (options.max_width !== undefined && segment.lebar > options.max_width) {
      return false;
    }

    if (
      options.material_ids?.length &&
      !options.material_ids.includes(segment.eksisting_id)
    ) {
      return false;
    }

    if (
      options.condition_ids?.length &&
      !options.condition_ids.includes(segment.kondisi_id)
    ) {
      return false;
    }

    if (
      options.type_ids?.length &&
      !options.type_ids.includes(segment.jenisjalan_id)
    ) {
      return false;
    }

    if (options.village_id && segment.desa_id !== options.village_id) {
      return false;
    }

    return true;
  });
}
