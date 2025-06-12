import { useState } from "react";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROAD_CONDITION_ICONS } from "@/constants/road-condition-icons";
import { ROAD_TYPE_PATTERNS } from "@/constants/road-type-patterns";
import {
  useMasterRoadConditionsQuery,
  useMasterRoadMaterialsQuery,
  useMasterRoadTypesQuery,
} from "@/hooks/use-master-data-query";
import { useSettingStore } from "@/stores/setting-store";

type LegendItemBase = {
  id: string;
  name: string;
};

type RoadMaterialLegendItem = LegendItemBase & {
  color: string;
};

type RoadConditionLegendItem = LegendItemBase & {
  color: string;
  icon: string;
};

type RoadTypeLegendItem = LegendItemBase & {
  color: string;
  pattern: string;
};

type LegendSectionProps<T extends LegendItemBase> = {
  title: string;
  items: T[];
  renderSymbol: (item: T) => React.ReactNode;
};

function LegendSection<T extends LegendItemBase>({
  title,
  items,
  renderSymbol,
}: LegendSectionProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            {renderSymbol(item)}
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RoadSegmentLegend() {
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const { roadConditionStyle, roadTypeStyle, roadMaterialStyle } =
    useSettingStore();

  const { data: roadMaterials } = useMasterRoadMaterialsQuery();
  const { data: roadConditions } = useMasterRoadConditionsQuery();
  const { data: roadTypes } = useMasterRoadTypesQuery();

  const roadMaterialLegend: RoadMaterialLegendItem[] =
    roadMaterials?.eksisting.map((m) => ({
      id: m.id,
      name: m.eksisting,
      color: roadMaterialStyle[m.id]?.color,
    })) ?? [];

  const roadConditionLegend: RoadConditionLegendItem[] =
    roadConditions?.eksisting.map((c) => ({
      id: c.id,
      name: c.kondisi,
      color: roadConditionStyle[c.id]?.color,
      icon: roadConditionStyle[c.id]?.icon,
    })) ?? [];

  const roadTypeLegend: RoadTypeLegendItem[] =
    roadTypes?.eksisting.map((t) => ({
      id: t.id,
      name: t.jenisjalan,
      color: roadTypeStyle[t.id]?.color,
      pattern: roadTypeStyle[t.id]?.pattern,
    })) ?? [];

  if (!isLegendOpen) {
    return (
      <Button
        className="bg-background hover:bg-background/90 text-foreground absolute top-2 right-2 z-30 border shadow"
        onClick={() => setIsLegendOpen(true)}
        size="icon"
      >
        <Info />
      </Button>
    );
  }

  return (
    <Card className="absolute top-2 right-2 z-30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info /> Legenda
          </div>
        </CardTitle>
        <CardDescription>Legenda untuk peta</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {roadMaterialLegend.length > 0 && (
            <LegendSection
              title="Warna Material Jalan"
              items={roadMaterialLegend}
              renderSymbol={(m) => (
                <div
                  className="h-4 w-4 rounded-sm"
                  style={{ backgroundColor: m.color }}
                />
              )}
            />
          )}

          {roadConditionLegend.length > 0 && (
            <LegendSection
              title="Warna Kondisi Jalan"
              items={roadConditionLegend}
              renderSymbol={(c) => (
                <div
                  className="h-4 w-4 rounded-sm"
                  style={{ backgroundColor: c.color }}
                />
              )}
            />
          )}

          {roadTypeLegend.length > 0 && (
            <LegendSection
              title="Warna Jenis Jalan"
              items={roadTypeLegend}
              renderSymbol={(t) => (
                <div
                  className="h-4 w-4 rounded-sm"
                  style={{ backgroundColor: t.color }}
                />
              )}
            />
          )}

          {roadConditionLegend.length > 0 && (
            <LegendSection
              title="Icon Kondisi Jalan"
              items={roadConditionLegend}
              renderSymbol={(c) => {
                const Icon = ROAD_CONDITION_ICONS[c.icon];
                return (
                  <div className="rounded border p-1">
                    <Icon className="!size-4" />
                  </div>
                );
              }}
            />
          )}

          {roadTypeLegend.length > 0 && (
            <LegendSection
              title="Pola Jenis Jalan"
              items={roadTypeLegend}
              renderSymbol={(t) => (
                <div className="rounded border p-1">
                  {ROAD_TYPE_PATTERNS[t.pattern]?.icon}
                </div>
              )}
            />
          )}
        </div>
      </CardContent>

      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 size-6"
        onClick={() => setIsLegendOpen(false)}
      >
        <X />
      </Button>
    </Card>
  );
}
