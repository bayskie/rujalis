import { MapComponent } from "@/components/map";
import { RoadSegmentForm } from "@/components/road-segment-form";
import { Separator } from "@/components/ui/separator";
import { useEnrichedRoadSegmentByIdQuery } from "@/hooks/use-road-segment-query";
import DefaultLayout from "@/layout/default";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

export default function EditRoadSegment() {
  const params = useParams();
  const segmentId = params.segmentId;

  const { data, isLoading } = useEnrichedRoadSegmentByIdQuery(segmentId || "");

  const [roadSegmentEncoded, setRoadSegmentEncoded] = useState("");
  const [roadSegmentLength, setRoadSegmentLength] = useState(0);

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="text-muted-foreground flex h-full animate-spin items-center justify-center">
          <Loader2 />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex h-full flex-row gap-4">
        <RoadSegmentForm
          formType="edit"
          roadSegmentId={segmentId}
          values={{
            ...data?.ruasjalan,
            paths: roadSegmentEncoded,
            panjang: roadSegmentLength,
          }}
        />
        <Separator orientation="vertical" />
        <MapComponent
          activeRoadSegment={data?.ruasjalan}
          onEncodedChange={setRoadSegmentEncoded}
          onLengthChange={setRoadSegmentLength}
        />
      </div>
    </DefaultLayout>
  );
}
