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

export default function SidebarSettingDialog() {
  const setting = useSettingStore();

  const { data: roadMaterials } = useMasterRoadMaterialsQuery();
  const { data: roadConditions } = useMasterRoadConditionsQuery();
  const { data: roadTypes } = useMasterRoadTypesQuery();

  const themes: { label: string; value: string; icon: LucideIcon }[] = [
    { label: "Sistem", value: "system", icon: Monitor },
    { label: "Terang", value: "light", icon: Sun },
    { label: "Gelap", value: "dark", icon: Moon },
  ];

  const roadConditionIcons: Record<string, string[]> = {
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
            {/* Theme */}
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm">Tema</h3>
              <ToggleGroup
                type="single"
                variant="outline"
                value={setting.theme}
                onValueChange={(val) => {
                  if (val) setting.setTheme(val as "light" | "dark" | "system");
                }}
              >
                {themes.map((theme) => {
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

            {/* Road Material Color */}
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm">
                Warna Material Jalan
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {roadMaterials?.eksisting.map((material) => {
                  const materialColor =
                    setting.roadMaterialStyle[material.id]?.color;

                  return (
                    <div className="flex items-center gap-2">
                      <ColorPicker
                        key={material.id}
                        value={materialColor}
                        onChange={(newColor) =>
                          setting.setRoadMaterialColor(material.id, newColor)
                        }
                        className="h-4 w-4 rounded-sm"
                      />
                      <span>{material.eksisting}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Road Condition Color */}
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm">
                Warna Kondisi Jalan
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {roadConditions?.eksisting.map((conditions) => {
                  const conditionsColor =
                    setting.roadConditionStyle[conditions.id]?.color;

                  return (
                    <div className="flex items-center gap-2">
                      <ColorPicker
                        key={conditions.id}
                        value={conditionsColor}
                        onChange={(newColor) =>
                          setting.setRoadConditionColor(conditions.id, newColor)
                        }
                        className="h-4 w-4 rounded-sm"
                      />
                      <span>{conditions.kondisi}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Road Condition Icon */}
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm">
                Ikon Kondisi Jalan
              </h3>
              <div className="space-y-4">
                {roadConditions?.eksisting.map((condition) => {
                  const currentId = condition.id;
                  const currentIconName =
                    setting.roadConditionStyle[currentId]?.icon;

                  return (
                    <div key={currentId}>
                      <p className="text-muted-foreground mb-1 text-sm">
                        {condition.kondisi}
                      </p>
                      <ToggleGroup
                        type="single"
                        variant="outline"
                        value={currentIconName}
                        onValueChange={(val) => {
                          if (val) {
                            setting.setRoadConditionIcon(currentId, val);
                          }
                        }}
                      >
                        {roadConditionIcons[currentId] &&
                          roadConditionIcons[currentId].map((iconName) => {
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

            {/* Road Type Color */}
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm">
                Warna Jenis Jalan
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {roadTypes?.eksisting.map((types) => {
                  const typesColor = setting.roadTypeStyle[types.id]?.color;

                  return (
                    <div className="flex items-center gap-2">
                      <ColorPicker
                        key={types.id}
                        value={typesColor}
                        onChange={(newColor) =>
                          setting.setRoadTypeColor(types.id, newColor)
                        }
                        className="h-4 w-4 rounded-sm"
                      />
                      <span>{types.jenisjalan}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Road Type Pattern */}
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm">
                Pola Jenis Jalan
              </h3>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                {roadTypes?.eksisting.map((types) => {
                  const typesPattern = setting.roadTypeStyle[types.id]?.pattern;

                  return (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm">
                        {types.jenisjalan}
                      </p>
                      <ToggleGroup
                        type="single"
                        variant="outline"
                        value={typesPattern}
                        onValueChange={(val) => {
                          if (val) {
                            setting.setRoadTypePattern(
                              types.id,
                              val as "solid" | "dashed" | "dotted",
                            );
                          }
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

            {/* Road Weight by Type */}
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm">
                Lebar Jenis Jalan
              </h3>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                {roadTypes?.eksisting.map((types) => {
                  const typesWidth = setting.roadTypeStyle[types.id]?.weight;

                  return (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm">
                        {types.jenisjalan}
                      </p>
                      <Input
                        type="number"
                        defaultValue={typesWidth}
                        className="w-20"
                        max={100}
                        min={1}
                        onChange={(e) =>
                          setting.setRoadTypeWeight(
                            types.id,
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
