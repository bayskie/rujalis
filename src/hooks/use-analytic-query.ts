import {
  useMasterRoadConditionsQuery,
  useMasterRoadMaterialsQuery,
  useMasterRoadTypesQuery,
} from "@/hooks/use-master-data-query";
import { useAllRoadSegmentsQuery } from "@/hooks/use-road-segment-query";
import { useSettingStore } from "@/stores/setting-store";
import type { Analytic } from "@/types/analytic";
import { useQuery } from "@tanstack/react-query";
import { useGenerateContentWithGeminiMutation } from "@/hooks/use-generate-content-with-gemini";
import type { RoadSegment } from "@/types/road-segment";

const buildDistribution = <
  T extends { id: string },
  K extends keyof RoadSegment,
>(
  masterData: T[],
  segments: RoadSegment[],
  key: K,
  getName: (item: T) => string,
  getFill: (item: T) => string,
) => {
  return masterData.map((item) => {
    const count = segments.filter((segment) => segment[key] === item.id).length;
    return {
      name: getName(item),
      count,
      fill: getFill(item),
    };
  });
};

const calculateStatistics = (segments: RoadSegment[]) => {
  const roadCount = segments.length;
  const roadLengthTotal = segments.reduce((sum, r) => sum + r.panjang, 0);
  const roadLengthAvg = roadCount > 0 ? roadLengthTotal / roadCount : 0;
  const roadWidthTotal = segments.reduce((sum, r) => sum + r.lebar, 0);
  const roadWidthAvg = roadCount > 0 ? roadWidthTotal / roadCount : 0;

  return {
    roadCount,
    roadLengthTotal,
    roadLengthAvg,
    roadWidthTotal,
    roadWidthAvg,
  };
};

const buildPrompt = (
  stats: ReturnType<typeof calculateStatistics>,
  conditionDist: ReturnType<typeof buildDistribution>,
  typeDist: ReturnType<typeof buildDistribution>,
  materialDist: ReturnType<typeof buildDistribution>,
) => {
  return `
Berikut adalah data analitik ruas jalan:

- Jumlah ruas jalan: ${stats.roadCount}
- Panjang total: ${stats.roadLengthTotal.toFixed(2)} m
- Panjang rata-rata: ${stats.roadLengthAvg.toFixed(2)} m
- Lebar total: ${stats.roadWidthTotal.toFixed(2)} m
- Lebar rata-rata: ${stats.roadWidthAvg.toFixed(2)} m

Distribusi kondisi jalan:
${conditionDist.map((d) => `- ${d.name}: ${d.count}`).join("\n")}

Distribusi jenis jalan:
${typeDist.map((d) => `- ${d.name}: ${d.count}`).join("\n")}

Distribusi material jalan:
${materialDist.map((d) => `- ${d.name}: ${d.count}`).join("\n")}

Buatkan ringkasan analisis dari data di atas dalam 1-2 kalimat berbahasa Indonesia.
`;
};

export const useAnalyticQuery = () => {
  const { data: roadSegments } = useAllRoadSegmentsQuery();
  const { data: roadConditions } = useMasterRoadConditionsQuery();
  const { data: roadTypes } = useMasterRoadTypesQuery();
  const { data: roadMaterials } = useMasterRoadMaterialsQuery();
  const { mutateAsync: generateInsight } =
    useGenerateContentWithGeminiMutation();
  const setting = useSettingStore();

  const segments = roadSegments?.ruasjalan ?? [];
  const isDataReady =
    segments.length > 0 &&
    !!roadConditions?.eksisting &&
    !!roadTypes?.eksisting &&
    !!roadMaterials?.eksisting &&
    !!setting;

  return useQuery<Analytic>({
    queryKey: ["analytic", segments.length],
    queryFn: async () => {
      if (!isDataReady) throw new Error("Road segments data not ready");

      const stats = calculateStatistics(segments);

      const roadConditionDistribution = buildDistribution(
        roadConditions.eksisting,
        segments,
        "kondisi_id",
        (c) => c.kondisi,
        (c) => setting.roadConditionStyle[c.id]?.color ?? "#000000",
      );

      const roadTypeDistribution = buildDistribution(
        roadTypes.eksisting,
        segments,
        "jenisjalan_id",
        (t) => t.jenisjalan,
        (t) => setting.roadTypeStyle[t.id]?.color ?? "#000000",
      );

      const roadMaterialDistribution = buildDistribution(
        roadMaterials.eksisting,
        segments,
        "eksisting_id",
        (m) => m.eksisting,
        (m) => setting.roadMaterialStyle[m.id]?.color ?? "#000000",
      );

      const prompt = buildPrompt(
        stats,
        roadConditionDistribution,
        roadTypeDistribution,
        roadMaterialDistribution,
      );

      let insight = "";
      try {
        const response = await generateInsight(prompt);
        insight = response.candidates?.[0].content?.parts?.[0].text ?? "";
      } catch {
        insight = "Gagal menghasilkan ringkasan analisis.";
      }

      return {
        ...stats,
        roadConditionDistribution,
        roadTypeDistribution,
        roadMaterialDistribution,
        insight,
      };
    },
    enabled: isDataReady,
    staleTime: 1000 * 60 * 10,
  });
};
