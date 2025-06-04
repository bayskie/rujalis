import { useMemo } from "react";
import { useSearchParams } from "react-router";

export const useFilterMapper = () => {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const getNumber = (key: string) => {
      const val = searchParams.get(key);
      return val ? Number(val) : undefined;
    };

    return {
      road_name: searchParams.get("road_name") || undefined,
      min_length: getNumber("min_length"),
      max_length: getNumber("max_length"),
      min_width: getNumber("min_width"),
      max_width: getNumber("max_width"),
      material_ids: searchParams.getAll("material_ids") || undefined,
      condition_ids: searchParams.getAll("condition_ids") || undefined,
      type_ids: searchParams.getAll("type_ids") || undefined,
    };
  }, [searchParams]);
};
