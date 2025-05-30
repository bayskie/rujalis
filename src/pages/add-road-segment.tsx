import { Separator } from "@/components/ui/separator";
import DefaultLayout from "@/layout/default";
import { useState } from "react";
import { RoadSegmentForm } from "@/components/road-segment-form";
import { MapComponent } from "@/components/map";

export default function AddRoadSegment() {
  const [roadSegmentEncoded, setRoadSegmentEncoded] = useState("");
  const [roadSegmentLength, setRoadSegmentLength] = useState(0);

  return (
    <DefaultLayout>
      <div className="flex h-full flex-row gap-4">
        <RoadSegmentForm
          values={{
            paths: roadSegmentEncoded,
            panjang: roadSegmentLength,
          }}
        />
        <Separator orientation="vertical" />
        <MapComponent
          onEncodedChange={setRoadSegmentEncoded}
          onLengthChange={setRoadSegmentLength}
        />
      </div>
    </DefaultLayout>
  );
}
