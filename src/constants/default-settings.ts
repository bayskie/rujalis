import type { SettingState } from "@/stores/setting-store";

export const DEFAULT_SETTINGS: Omit<
  SettingState,
  | "setTheme"
  | "setScheme"
  | "setRoadMaterialColor"
  | "setRoadConditionColor"
  | "setRoadConditionIcon"
  | "setRoadTypeColor"
  | "setRoadTypePattern"
  | "setRoadTypeWeight"
> = {
  theme: "system",
  scheme: "condition",
  roadMaterialStyle: {
    "1": { color: "#FF0000" },
    "2": { color: "#00BFFF" },
    "3": { color: "#32CD32" },
    "4": { color: "#FFD700" },
    "5": { color: "#FF69B4" },
    "6": { color: "#8A2BE2" },
    "7": { color: "#FFA500" },
    "8": { color: "#00FFFF" },
    "9": { color: "#FF1493" },
  },

  roadConditionStyle: {
    "1": { color: "#00FF00", icon: "MapPinCheckInside" },
    "2": { color: "#FFFF00", icon: "MapPinMinusInside" },
    "3": { color: "#FF0000", icon: "MapPinXInside" },
  },

  roadTypeStyle: {
    "1": { color: "#FF0000", pattern: "dotted", weight: 4 },
    "2": { color: "#00BFFF", pattern: "dashed", weight: 4 },
    "3": { color: "#32CD32", pattern: "solid", weight: 4 },
  },
};
