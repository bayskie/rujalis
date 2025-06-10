import { PieChart, Pie } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Distribution } from "@/types/analytic";
import { useSettingStore } from "@/stores/setting-store";

export function AnalyticChartCard({
  title,
  subttitle,
  data,
  type,
}: {
  title: string;
  subttitle: string;
  data: Distribution[];
  type: "roadCondition" | "roadMaterial" | "roadType";
}) {
  const setting = useSettingStore();

  const styleMap =
    type === "roadMaterial"
      ? setting.roadMaterialStyle
      : type === "roadCondition"
        ? setting.roadConditionStyle
        : setting.roadTypeStyle;

  const dataWithColor = data.map((d) => ({
    ...d,
    fill: styleMap[d.id]?.color ?? "#999",
  }));

  const config: ChartConfig = dataWithColor.reduce((acc, d) => {
    acc[d.name] = { label: d.name, color: d.fill };
    return acc;
  }, {} as ChartConfig);

  const isLoading = !data || data.length === 0;

  return (
    <Card className="h-full w-full gap-2">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{subttitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[240px] items-center justify-center">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
        ) : (
          <ChartContainer
            className="mx-auto aspect-square max-h-[300px]"
            config={config}
          >
            <PieChart>
              <Pie
                data={dataWithColor}
                dataKey="count"
                nameKey="name"
                outerRadius={80}
                isAnimationActive={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent nameKey="name" hideLabel />}
              />
              <ChartLegend
                content={
                  <ChartLegendContent
                    nameKey="name"
                    className="-translate-y-2 flex-wrap gap-2 *:basis-1/5 *:justify-center"
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
