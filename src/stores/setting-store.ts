import {
  MapPinCheckInside,
  MapPinMinusInside,
  MapPinXInside,
  type LucideIcon,
} from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SettingState {
  theme: "light" | "dark" | "system";
  roadMaterialStyle: {
    [key: string]: {
      color: string;
    };
  };
  roadConditionStyle: {
    [key: string]: {
      color: string;
      icon: LucideIcon;
    };
  };
  roadTypeStyle: {
    [key: string]: {
      color: string;
      pattern: "solid" | "dashed" | "dotted" | "dashed-dotted";
      weight: number;
    };
  };

  setTheme: (theme: "light" | "dark" | "system") => void;
  setRoadMaterialStyle: (material: {
    [key: string]: {
      color: string;
    };
  }) => void;
  setRoadConditionStyle: (condition: {
    [key: string]: {
      color: string;
      icon: LucideIcon;
    };
  }) => void;
  setRoadTypeStyle: (type: {
    [key: string]: {
      color: string;
      pattern: "solid" | "dashed" | "dotted" | "dashed-dotted";
      weight: number;
    };
  }) => void;
}

const DEFAULT_SETTINGS: Omit<
  SettingState,
  | "setTheme"
  | "setRoadMaterialStyle"
  | "setRoadConditionStyle"
  | "setRoadTypeStyle"
> = {
  theme: "system",
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
    "1": { color: "#00FF00", icon: MapPinCheckInside },
    "2": { color: "#FFFF00", icon: MapPinMinusInside },
    "3": { color: "#FF0000", icon: MapPinXInside },
  },

  roadTypeStyle: {
    "1": { color: "#FF0000", pattern: "dotted", weight: 4 },
    "2": { color: "#00BFFF", pattern: "dashed", weight: 4 },
    "3": { color: "#32CD32", pattern: "solid", weight: 4 },
  },
};

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setTheme: (theme) => set({ theme }),
      setRoadMaterialStyle: (material) => set({ roadMaterialStyle: material }),
      setRoadConditionStyle: (condition) =>
        set({ roadConditionStyle: condition }),
      setRoadTypeStyle: (type) => set({ roadTypeStyle: type }),
    }),
    {
      name: "setting-storage",
    },
  ),
);
