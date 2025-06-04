import {
  MapPinCheckInside,
  MapPinMinusInside,
  MapPinXInside,
  type LucideIcon,
} from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingState {
  theme: "light" | "dark" | "system";
  roadMaterialStyle: {
    [key: string]: {
      color: string;
    };
  };
  roadConditionStyle: {
    [key: string]: {
      icon: LucideIcon;
      color: string;
    };
  };
  roadTypeStyle: {
    [key: string]: {
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
      icon: LucideIcon;
      color: string;
    };
  }) => void;
  setRoadTypeStyle: (type: {
    [key: string]: {
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
    "1": { icon: MapPinCheckInside, color: "green" },
    "2": { icon: MapPinMinusInside, color: "orange" },
    "3": { icon: MapPinXInside, color: "red" },
  },

  roadTypeStyle: {
    "1": { pattern: "dotted", weight: 4 },
    "2": { pattern: "dashed", weight: 4 },
    "3": { pattern: "solid", weight: 4 },
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
