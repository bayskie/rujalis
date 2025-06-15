import { DEFAULT_SETTINGS } from "@/constants/default-settings";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SettingState {
  theme: "light" | "dark" | "system";
  scheme: "material" | "condition" | "type";
  roadMaterialStyle: {
    [key: string]: {
      color: string;
    };
  };
  roadConditionStyle: {
    [key: string]: {
      color: string;
      icon: string;
    };
  };
  roadTypeStyle: {
    [key: string]: {
      color: string;
      pattern: "solid" | "dashed" | "dotted";
      weight: number;
    };
  };

  setTheme: (theme: "light" | "dark" | "system") => void;
  setScheme: (scheme: "material" | "condition" | "type") => void;
  setRoadMaterialColor: (id: string, color: string) => void;
  setRoadConditionColor: (id: string, color: string) => void;
  setRoadConditionIcon: (id: string, icon: string) => void;
  setRoadTypeColor: (id: string, color: string) => void;
  setRoadTypePattern: (
    id: string,
    pattern: "solid" | "dashed" | "dotted",
  ) => void;
  setRoadTypeWeight: (id: string, weight: number) => void;
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setTheme: (theme) => set({ theme }),
      setScheme: (scheme) => set({ scheme }),

      setRoadMaterialColor: (id, color) =>
        set((state) => ({
          roadMaterialStyle: {
            ...state.roadMaterialStyle,
            [id]: { ...state.roadMaterialStyle[id], color },
          },
        })),

      setRoadConditionColor: (id, color) =>
        set((state) => ({
          roadConditionStyle: {
            ...state.roadConditionStyle,
            [id]: { ...state.roadConditionStyle[id], color },
          },
        })),

      setRoadConditionIcon: (id, icon) =>
        set((state) => ({
          roadConditionStyle: {
            ...state.roadConditionStyle,
            [id]: { ...state.roadConditionStyle[id], icon },
          },
        })),

      setRoadTypeColor: (id, color) =>
        set((state) => ({
          roadTypeStyle: {
            ...state.roadTypeStyle,
            [id]: { ...state.roadTypeStyle[id], color },
          },
        })),

      setRoadTypePattern: (id, pattern) =>
        set((state) => ({
          roadTypeStyle: {
            ...state.roadTypeStyle,
            [id]: { ...state.roadTypeStyle[id], pattern },
          },
        })),

      setRoadTypeWeight: (id, weight) =>
        set((state) => ({
          roadTypeStyle: {
            ...state.roadTypeStyle,
            [id]: { ...state.roadTypeStyle[id], weight },
          },
        })),
    }),
    {
      name: "setting-storage",
    },
  ),
);
