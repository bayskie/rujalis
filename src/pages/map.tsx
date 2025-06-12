import MapLayout from "@/layout/map";
import { MapComponent } from "@/components/map";
import { useAllRoadSegmentsQuery } from "@/hooks/use-road-segment-query";
import { RoadSegmentToolbar } from "@/components/road-segment-toolbar";
import { useFilterMapper } from "@/hooks/use-filter-mapper";
import { useState } from "react";
import { TILE_LAYERS } from "@/constants/tile-layers";
import { RoadSegmentLegend } from "@/components/road-segment-legend";

export default function Map() {
  const filter = useFilterMapper();
  const { data } = useAllRoadSegmentsQuery(filter);
  const [activeTileLayer, setActiveTileLayer] = useState(TILE_LAYERS[0]);

  return (
    <MapLayout>
      <div className="relative h-full">
        <RoadSegmentToolbar onTileLayerChange={setActiveTileLayer} />
        <MapComponent
          drawable={false}
          roadSegments={data?.ruasjalan}
          activeTileLayer={activeTileLayer}
        />
        <RoadSegmentLegend />
      </div>
    </MapLayout>
  );
}
