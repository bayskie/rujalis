import {
  useMasterRoadConditionsQuery,
  useMasterRoadMaterialsQuery,
  useMasterRoadTypesQuery,
} from "@/hooks/use-master-data-query";
import { useAllRoadSegmentsQuery } from "@/hooks/use-road-segment-query";
import { useSettingStore } from "@/stores/setting-store";
import type { Analytic } from "@/types/analytic";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { useGeminiGenerateContentMutation } from "@/hooks/use-generate-content-with-gemini";

const buildDistribution = <
  T extends { id: string },
  Segment extends { [key in Key]: string },
  Key extends keyof Segment,
>(
  masterData: T[],
  segments: Segment[],
  key: Key,
  getName: (item: T) => string,
  getFill: (item: T) => string,
) =>
  masterData.map((item) => {
    const count = segments.filter((segment) => segment[key] === item.id).length;
    return {
      name: getName(item),
      count,
      fill: getFill(item),
    };
  });

export const useAnalyticQuery = () => {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["analytic"], []);
  const hasGenerated = useRef(false);
  const { mutateAsync: generateInsight } = useGeminiGenerateContentMutation();

  const { data: roadSegments } = useAllRoadSegmentsQuery();
  const { data: roadConditions } = useMasterRoadConditionsQuery();
  const { data: roadTypes } = useMasterRoadTypesQuery();
  const { data: roadMaterials } = useMasterRoadMaterialsQuery();
  const setting = useSettingStore();

  useEffect(() => {
    const generate = async () => {
      if (
        !roadSegments ||
        !roadConditions ||
        !roadTypes ||
        !roadMaterials ||
        !setting ||
        hasGenerated.current
      )
        return;

      hasGenerated.current = true;

      const ruas = roadSegments.ruasjalan;
      const roadCount = ruas.length;
      const roadLengthTotal = ruas.reduce((sum, r) => sum + r.panjang, 0);
      const roadLengthAvg = roadLengthTotal / roadCount;
      const roadWidthTotal = ruas.reduce((sum, r) => sum + r.lebar, 0);
      const roadWidthAvg = roadWidthTotal / roadCount;

      const roadConditionDistribution = buildDistribution(
        roadConditions.eksisting,
        ruas,
        "kondisi_id",
        (c) => c.kondisi,
        (c) => setting.roadConditionStyle[c.id].color,
      );

      const roadTypeDistribution = buildDistribution(
        roadTypes.eksisting,
        ruas,
        "jenisjalan_id",
        (t) => t.jenisjalan,
        (t) => setting.roadTypeStyle[t.id].color,
      );

      const roadMaterialDistribution = buildDistribution(
        roadMaterials.eksisting,
        ruas,
        "eksisting_id",
        (m) => m.eksisting,
        (m) => setting.roadMaterialStyle[m.id].color,
      );

      const prompt = `
Berikut adalah data analitik ruas jalan:

- Jumlah ruas jalan: ${roadCount}
- Panjang total: ${roadLengthTotal.toFixed(2)} m
- Panjang rata-rata: ${roadLengthAvg.toFixed(2)} m
- Lebar total: ${roadWidthTotal.toFixed(2)} m
- Lebar rata-rata: ${roadWidthAvg.toFixed(2)} m

Distribusi kondisi jalan:
${roadConditionDistribution.map((d) => `- ${d.name}: ${d.count}`).join("\n")}

Distribusi jenis jalan:
${roadTypeDistribution.map((d) => `- ${d.name}: ${d.count}`).join("\n")}

Distribusi material jalan:
${roadMaterialDistribution.map((d) => `- ${d.name}: ${d.count}`).join("\n")}

Buatkan ringkasan analisis dari data di atas dalam 1-2 kalimat berbahasa Indonesia.
`;

      const insight =
        (await generateInsight(prompt)).candidates?.[0].content?.parts?.[0]
          .text ?? "";

      queryClient.setQueryData<Analytic>(queryKey, {
        roadCount,
        roadLengthTotal,
        roadLengthAvg,
        roadWidthTotal,
        roadWidthAvg,
        roadConditionDistribution,
        roadTypeDistribution,
        roadMaterialDistribution,
        insight,
      });
    };

    generate();
  }, [
    queryClient,
    queryKey,
    roadSegments,
    roadConditions,
    roadTypes,
    roadMaterials,
    setting,
    generateInsight,
  ]);

  return useQuery<Analytic>({
    queryKey,
    enabled: false,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });
};
