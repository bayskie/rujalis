import { useAllRoadSegmentsQuery } from "@/hooks/use-road-segment-query";

export const useGenerateRoadSegmentCode = (): string => {
  const { data } = useAllRoadSegmentsQuery();
  let maxCodeNumber = 0;

  if (data?.ruasjalan) {
    maxCodeNumber = data.ruasjalan.reduce((currentMax, segment) => {
      const codeNumber = parseInt(segment.kode_ruas.split("-")[1] ?? "0", 10);
      return Math.max(codeNumber, currentMax);
    }, 0);
  }

  const nextCode = (maxCodeNumber + 1).toString().padStart(4, "0");

  return `RJ-${nextCode}`;
};
