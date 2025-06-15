import { Separator } from "@/components/ui/separator";
import DefaultLayout from "@/layout/default";
import { useState } from "react";
import { RoadSegmentForm } from "@/components/road-segment-form";
import { MapComponent } from "@/components/map";
import { useSearchParams } from "react-router";

export default function AddRoadSegment() {
  const [roadSegmentEncoded, setRoadSegmentEncoded] = useState("");
  const [roadSegmentLength, setRoadSegmentLength] = useState(0);

  const [searchParams] = useSearchParams();
  const center = [
    parseFloat(searchParams.get("lat") || "0"),
    parseFloat(searchParams.get("lng") || "0"),
  ] as [number, number];

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
          center={center}
        />
      </div>
    </DefaultLayout>
  );
}
