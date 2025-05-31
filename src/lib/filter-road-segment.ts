import type { RoadSegment } from "@/types/road-segment";
import type { RoadSegmentFilterOptions } from "@/types/road-segment";

export function filterRoadSegments(
  segments: RoadSegment[],
  options?: RoadSegmentFilterOptions,
): RoadSegment[] {
  if (!options) return segments;

  return segments.filter((segment) => {
    if (
      options.roadName &&
      !segment.nama_ruas.toLowerCase().includes(options.roadName.toLowerCase())
    ) {
      return false;
    }

    if (
      options.minLength !== undefined &&
      segment.panjang < options.minLength
    ) {
      return false;
    }

    if (
      options.maxLength !== undefined &&
      segment.panjang > options.maxLength
    ) {
      return false;
    }

    if (options.minWidth !== undefined && segment.lebar < options.minWidth) {
      return false;
    }

    if (options.maxWidth !== undefined && segment.lebar > options.maxWidth) {
      return false;
    }

    if (
      options.materialId?.length &&
      !options.materialId.includes(segment.eksisting_id)
    ) {
      return false;
    }

    if (
      options.conditionId?.length &&
      !options.conditionId.includes(segment.kondisi_id)
    ) {
      return false;
    }

    if (
      options.typeId?.length &&
      !options.typeId.includes(segment.jenisjalan_id)
    ) {
      return false;
    }

    if (options.villageId && segment.desa_id !== options.villageId) {
      return false;
    }

    return true;
  });
}
