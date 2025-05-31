import {
  getAllRoadSegmentsFn,
  getRoadSegmentBySegmentIdFn,
} from "@/api/road-segment";
import {
  useMasterRoadConditionsQuery,
  useMasterRoadMaterialsQuery,
  useMasterRoadTypesQuery,
} from "@/hooks/use-master-data-query";
import { useVillageByIdQuery } from "@/hooks/use-region-query";
import { filterRoadSegments } from "@/lib/filter-road-segment";
import type {
  EnrichedRoadSegment,
  GetEnrichedRoadSegmentByIdResponse,
  RoadSegmentFilterOptions,
} from "@/types/road-segment";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useAllRoadSegmentsQuery = (filter?: RoadSegmentFilterOptions) => {
  return useQuery({
    queryKey: ["all-road-segments"],
    queryFn: getAllRoadSegmentsFn,
    staleTime: 1000 * 60 * 10,
    select: (data) => ({
      ...data,
      ruasjalan: filterRoadSegments(data.ruasjalan, filter),
    }),
  });
};

export const useRoadSegmentByIdQuery = (roadSegmentId: string) => {
  return useQuery({
    queryKey: ["road-segment", roadSegmentId],
    queryFn: () => getRoadSegmentBySegmentIdFn(roadSegmentId),
    enabled: !!roadSegmentId,
    staleTime: 1000 * 60 * 10,
  });
};

export const useEnrichedRoadSegmentByIdQuery = (roadSegmentId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["enriched-road-segment", roadSegmentId];

  const { data: roadSegment } = useRoadSegmentByIdQuery(roadSegmentId);
  const { data: roadConditions } = useMasterRoadConditionsQuery();
  const { data: roadTypes } = useMasterRoadTypesQuery();
  const { data: roadMaterials } = useMasterRoadMaterialsQuery();
  const { data: region } = useVillageByIdQuery(
    roadSegment?.ruasjalan.desa_id || "",
  );

  useEffect(() => {
    if (
      !roadSegment ||
      !roadConditions ||
      !roadTypes ||
      !roadMaterials ||
      !region
    )
      return;

    const enriched: EnrichedRoadSegment = {
      ...roadSegment.ruasjalan,
      desa: region?.desa.desa || "",
      kecamatan_id: region?.kecamatan.id || "",
      kecamatan: region?.kecamatan.kecamatan || "",
      kabupaten_id: region?.kabupaten.id || "",
      kabupaten: region?.kabupaten.kabupaten || "",
      provinsi_id: region?.provinsi.id || "",
      provinsi: region?.provinsi.provinsi || "",
      kondisi:
        roadConditions.eksisting.find(
          (c) => c.id === roadSegment.ruasjalan.kondisi_id,
        )?.kondisi || "",
      jenisjalan:
        roadTypes.eksisting.find(
          (t) => t.id === roadSegment.ruasjalan.jenisjalan_id,
        )?.jenisjalan || "",
      eksisting:
        roadMaterials.eksisting.find(
          (m) => m.id === roadSegment.ruasjalan.eksisting_id,
        )?.eksisting || "",
    };

    queryClient.setQueryData<GetEnrichedRoadSegmentByIdResponse>(
      ["enriched-road-segment", roadSegmentId],
      {
        ...roadSegment,
        ruasjalan: enriched,
      },
    );
  }, [
    roadSegmentId,
    roadSegment,
    roadConditions,
    roadTypes,
    roadMaterials,
    region,
    queryClient,
  ]);

  return useQuery<GetEnrichedRoadSegmentByIdResponse>({
    queryKey: queryKey,
    queryFn: () => {
      const data =
        queryClient.getQueryData<GetEnrichedRoadSegmentByIdResponse>(queryKey);

      if (data) {
        return data;
      } else {
        throw new Error("Road segment not found");
      }
    },
    enabled: !!roadSegmentId,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
