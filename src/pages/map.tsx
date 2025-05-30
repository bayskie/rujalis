import MapLayout from "@/layout/map";
import { MapComponent } from "@/components/map";
import { useAllRoadSegmentsQuery } from "@/hooks/use-road-segment-query";

export default function Map() {
  const allRoadSegments = useAllRoadSegmentsQuery();
  return (
    <MapLayout>
      <div className="relative h-full">
        <MapComponent
          drawable={false}
          roadSegments={allRoadSegments.data?.ruasjalan}
        />
      </div>
    </MapLayout>
  );
}
