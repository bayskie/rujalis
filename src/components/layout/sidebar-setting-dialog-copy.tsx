import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useSettingStore } from "@/stores/setting-store";
import { Monitor, Moon, Settings, Sun, type LucideIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  useMasterRoadConditionsQuery,
  useMasterRoadMaterialsQuery,
  useMasterRoadTypesQuery,
} from "@/hooks/use-master-data-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "@/components/ui/color-picker";
import { ROAD_CONDITION_ICONS } from "@/constants/road-condition-icons";
import { ROAD_TYPE_PATTERNS } from "@/constants/road-type-patterns";
import { Input } from "@/components/ui/input";
import React from "react";

const THEME_OPTIONS: {
  label: string;
  value: "system" | "light" | "dark";
  icon: LucideIcon;
}[] = [
  { label: "Sistem", value: "system", icon: Monitor },
  { label: "Terang", value: "light", icon: Sun },
  { label: "Gelap", value: "dark", icon: Moon },
];

const ROAD_CONDITION_ICON_OPTIONS: Record<string, string[]> = {
  "1": [
    "Check",
    "CircleCheck",
    "ShieldCheck",
    "SquareCheck",
    "MapPinCheck",
    "MapPinCheckInside",
    "BadgeCheck",
  ],
  "2": [
    "Minus",
    "CircleMinus",
    "ShieldMinus",
    "SquareMinus",
    "MapPinMinus",
    "MapPinMinusInside",
    "BadgeMinus",
  ],
  "3": [
    "X",
    "CircleX",
    "ShieldX",
    "SquareX",
    "MapPinX",
    "MapPinXInside",
    "BadgeX",
  ],
};

interface ThemeSettingProps {
  currentTheme: string;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

const ThemeSetting: React.FC<ThemeSettingProps> = ({
  currentTheme,
  setTheme,
}) => (
  <div>
    <h3 className="text-muted-foreground mb-2 text-sm">Tema</h3>
    <ToggleGroup
      type="single"
      variant="outline"
      value={currentTheme}
      onValueChange={(val) => {
        if (val) setTheme(val as "light" | "dark" | "system");
      }}
    >
      {THEME_OPTIONS.map((theme) => {
        const Icon = theme.icon;
        return (
          <ToggleGroupItem
            key={theme.value}
            value={theme.value}
            className="flex min-h-[40px] items-center gap-2 px-3 py-2"
          >
            <Icon className="!size-5" />
            <span>{theme.label}</span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  </div>
);

// const ColorSchemeSetting: React.FC<{ colorScheme: string }> = ({
//   colorScheme,
// }) => (
//   <div>
//     <h3 className="text-muted-foreground mb-2 text-sm">Skema Warna</h3>
//     <ToggleGroup
//       type="single"
//       variant="outline"
//       value={}
//       onValueChange={(val) => {
//         if (val) setRoadConditionIcon(condition.id, val);
//       }}
//     >
//       <ToggleGroupItem value={"roadMaterial"}>Material</ToggleGroupItem>
//       <ToggleGroupItem value={""}>Tipe Jalan</ToggleGroupItem>
//       <ToggleGroupItem value={"roadType"}>Tipe Jalan</ToggleGroupItem>
//     </ToggleGroup>
//   </div>
// );

interface RoadMaterialColorSettingProps {
  roadMaterials: { id: string; eksisting: string }[];
  roadMaterialStyle: Record<string, { color?: string }>;
  setRoadMaterialColor: (id: string, color: string) => void;
}

const RoadMaterialColorSetting: React.FC<RoadMaterialColorSettingProps> = ({
  roadMaterials,
  roadMaterialStyle,
  setRoadMaterialColor,
}) => (
  <div>
    <h3 className="text-muted-foreground mb-2 text-sm">Warna Material Jalan</h3>
    <div className="grid grid-cols-3 gap-2">
      {roadMaterials.map((material) => (
        <div key={material.id} className="flex items-center gap-2">
          <ColorPicker
            value={roadMaterialStyle[material.id]?.color || "#000000"}
            onChange={(newColor) => setRoadMaterialColor(material.id, newColor)}
            className="h-4 w-4 rounded-sm"
          />
          <span>{material.eksisting}</span>
        </div>
      ))}
    </div>
  </div>
);

interface RoadConditionColorSettingProps {
  roadConditions: { id: string; kondisi: string }[];
  roadConditionStyle: Record<string, { color?: string }>;
  setRoadConditionColor: (id: string, color: string) => void;
}

const RoadConditionColorSetting: React.FC<RoadConditionColorSettingProps> = ({
  roadConditions,
  roadConditionStyle,
  setRoadConditionColor,
}) => (
  <div>
    <h3 className="text-muted-foreground mb-2 text-sm">Warna Kondisi Jalan</h3>
    <div className="grid grid-cols-3 gap-2">
      {roadConditions.map((condition) => (
        <div key={condition.id} className="flex items-center gap-2">
          <ColorPicker
            value={roadConditionStyle[condition.id]?.color || "#000000"}
            onChange={(newColor) =>
              setRoadConditionColor(condition.id, newColor)
            }
            className="h-4 w-4 rounded-sm"
          />
          <span>{condition.kondisi}</span>
        </div>
      ))}
    </div>
  </div>
);

interface RoadConditionIconSettingProps {
  roadConditions: { id: string; kondisi: string }[];
  roadConditionStyle: Record<string, { icon?: string }>;
  setRoadConditionIcon: (id: string, icon: string) => void;
}

const RoadConditionIconSetting: React.FC<RoadConditionIconSettingProps> = ({
  roadConditions,
  roadConditionStyle,
  setRoadConditionIcon,
}) => (
  <div>
    <h3 className="text-muted-foreground mb-2 text-sm">Ikon Kondisi Jalan</h3>
    <div className="space-y-4">
      {roadConditions.map((condition) => {
        const currentIconName = roadConditionStyle[condition.id]?.icon;
        const availableIcons = ROAD_CONDITION_ICON_OPTIONS[condition.id] || [];

        return (
          <div key={condition.id}>
            <p className="text-muted-foreground mb-1 text-sm">
              {condition.kondisi}
            </p>
            <ToggleGroup
              type="single"
              variant="outline"
              value={currentIconName}
              onValueChange={(val) => {
                if (val) setRoadConditionIcon(condition.id, val);
              }}
            >
              {availableIcons.map((iconName) => {
                const Icon = ROAD_CONDITION_ICONS[iconName];
                return (
                  <ToggleGroupItem key={iconName} value={iconName}>
                    <Icon className="h-5 w-5" />
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
        );
      })}
    </div>
  </div>
);

interface RoadTypeColorSettingProps {
  roadTypes: { id: string; jenisjalan: string }[];
  roadTypeStyle: Record<string, { color?: string }>;
  setRoadTypeColor: (id: string, color: string) => void;
}

const RoadTypeColorSetting: React.FC<RoadTypeColorSettingProps> = ({
  roadTypes,
  roadTypeStyle,
  setRoadTypeColor,
}) => (
  <div>
    <h3 className="text-muted-foreground mb-2 text-sm">Warna Jenis Jalan</h3>
    <div className="grid grid-cols-3 gap-2">
      {roadTypes.map((type) => (
        <div key={type.id} className="flex items-center gap-2">
          <ColorPicker
            value={roadTypeStyle[type.id]?.color || "#000000"}
            onChange={(newColor) => setRoadTypeColor(type.id, newColor)}
            className="h-4 w-4 rounded-sm"
          />
          <span>{type.jenisjalan}</span>
        </div>
      ))}
    </div>
  </div>
);

interface RoadTypePatternSettingProps {
  roadTypes: { id: string; jenisjalan: string }[];
  roadTypeStyle: Record<string, { pattern?: "solid" | "dashed" | "dotted" }>;
  setRoadTypePattern: (
    id: string,
    pattern: "solid" | "dashed" | "dotted",
  ) => void;
}

const RoadTypePatternSetting: React.FC<RoadTypePatternSettingProps> = ({
  roadTypes,
  roadTypeStyle,
  setRoadTypePattern,
}) => (
  <div>
    <h3 className="text-muted-foreground mb-2 text-sm">Pola Jenis Jalan</h3>
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
      {roadTypes.map((type) => {
        const currentPattern = roadTypeStyle[type.id]?.pattern;
        return (
          <div key={type.id}>
            <p className="text-muted-foreground mb-1 text-sm">
              {type.jenisjalan}
            </p>
            <ToggleGroup
              type="single"
              variant="outline"
              value={currentPattern}
              onValueChange={(val) => {
                if (val)
                  setRoadTypePattern(
                    type.id,
                    val as "solid" | "dashed" | "dotted",
                  );
              }}
            >
              {Object.keys(ROAD_TYPE_PATTERNS).map((pattern) => {
                const icon = ROAD_TYPE_PATTERNS[pattern].icon;
                return (
                  <ToggleGroupItem key={pattern} value={pattern}>
                    {icon}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
        );
      })}
    </div>
  </div>
);

interface RoadTypeWeightSettingProps {
  roadTypes: { id: string; jenisjalan: string }[];
  roadTypeStyle: Record<string, { weight?: number }>;
  setRoadTypeWeight: (id: string, weight: number) => void;
}

const RoadTypeWeightSetting: React.FC<RoadTypeWeightSettingProps> = ({
  roadTypes,
  roadTypeStyle,
  setRoadTypeWeight,
}) => (
  <div>
    <h3 className="text-muted-foreground mb-2 text-sm">Lebar Jenis Jalan</h3>
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
      {roadTypes.map((type) => {
        const currentWidth = roadTypeStyle[type.id]?.weight;
        return (
          <div key={type.id}>
            <p className="text-muted-foreground mb-1 text-sm">
              {type.jenisjalan}
            </p>
            <Input
              type="number"
              defaultValue={currentWidth}
              className="w-20"
              max={100}
              min={1}
              onChange={(e) =>
                setRoadTypeWeight(type.id, Number(e.target.value))
              }
            />
          </div>
        );
      })}
    </div>
  </div>
);

export default function SidebarSettingDialog() {
  const {
    theme,
    roadMaterialStyle,
    roadConditionStyle,
    roadTypeStyle,
    setTheme,
    setRoadMaterialColor,
    setRoadConditionColor,
    setRoadConditionIcon,
    setRoadTypeColor,
    setRoadTypePattern,
    setRoadTypeWeight,
  } = useSettingStore();

  const { data: roadMaterials } = useMasterRoadMaterialsQuery();
  const { data: roadConditions } = useMasterRoadConditionsQuery();
  const { data: roadTypes } = useMasterRoadTypesQuery();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton className="flex min-h-[40px] items-center gap-2 px-3 py-2">
            <Settings className="!size-5" />
            <span>Pengaturan</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pengaturan</DialogTitle>
          <DialogDescription>Atur preferensi dan tampilan</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          <div className="space-y-8 p-2">
            <ThemeSetting currentTheme={theme} setTheme={setTheme} />

            {roadMaterials?.eksisting && (
              <RoadMaterialColorSetting
                roadMaterials={roadMaterials.eksisting}
                roadMaterialStyle={roadMaterialStyle}
                setRoadMaterialColor={setRoadMaterialColor}
              />
            )}

            {roadConditions?.eksisting && (
              <>
                <RoadConditionColorSetting
                  roadConditions={roadConditions.eksisting}
                  roadConditionStyle={roadConditionStyle}
                  setRoadConditionColor={setRoadConditionColor}
                />
                <RoadConditionIconSetting
                  roadConditions={roadConditions.eksisting}
                  roadConditionStyle={roadConditionStyle}
                  setRoadConditionIcon={setRoadConditionIcon}
                />
              </>
            )}

            {roadTypes?.eksisting && (
              <>
                <RoadTypeColorSetting
                  roadTypes={roadTypes.eksisting}
                  roadTypeStyle={roadTypeStyle}
                  setRoadTypeColor={setRoadTypeColor}
                />
                <RoadTypePatternSetting
                  roadTypes={roadTypes.eksisting}
                  roadTypeStyle={roadTypeStyle}
                  setRoadTypePattern={setRoadTypePattern}
                />
                <RoadTypeWeightSetting
                  roadTypes={roadTypes.eksisting}
                  roadTypeStyle={roadTypeStyle}
                  setRoadTypeWeight={setRoadTypeWeight}
                />
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
