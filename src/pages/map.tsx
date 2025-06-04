import MapLayout from "@/layout/map";
import { MapComponent } from "@/components/map";
import { useAllRoadSegmentsQuery } from "@/hooks/use-road-segment-query";
import { RoadSegmentToolbar } from "@/components/road-segment-toolbar";
import { useFilterMapper } from "@/hooks/use-filter-mapper";

export default function Map() {
  const filter = useFilterMapper();
  const { data } = useAllRoadSegmentsQuery(filter);

  return (
    <MapLayout>
      <div className="relative h-full">
        <RoadSegmentToolbar />
        <MapComponent drawable={false} roadSegments={data?.ruasjalan} />
      </div>
    </MapLayout>
  );
}
