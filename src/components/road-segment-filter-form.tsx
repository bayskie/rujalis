import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useMasterRoadConditionsQuery,
  useMasterRoadMaterialsQuery,
  useMasterRoadTypesQuery,
} from "@/hooks/use-master-data-query";
import type { RoadSegmentFilterOptions } from "@/types/road-segment";
import { FormProvider, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function RoadSegmentFilterForm() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: roadMaterials } = useMasterRoadMaterialsQuery();
  const { data: roadConditions } = useMasterRoadConditionsQuery();
  const { data: roadTypes } = useMasterRoadTypesQuery();

  const form = useForm<RoadSegmentFilterOptions>({
    defaultValues: {
      road_name: searchParams.get("road_name") || undefined,
      min_length: Number(searchParams.get("min_length")) || undefined,
      max_length: Number(searchParams.get("max_length")) || undefined,
      min_width: Number(searchParams.get("min_width")) || undefined,
      max_width: Number(searchParams.get("max_width")) || undefined,
      material_ids: searchParams.getAll("material_ids") || undefined,
      condition_ids: searchParams.getAll("condition_ids") || undefined,
      type_ids: searchParams.getAll("type_ids") || undefined,
    },
  });

  const { control, register, reset, handleSubmit } = form;

  const onSubmit = (data: RoadSegmentFilterOptions) => {
    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v) params.append(key, v);
        });
      } else if (value) {
        params.set(key, value.toString());
      }
    });

    setSearchParams(params);
  };

  // TODO: fix reset logic
  const onReset = () => {
    reset({
      road_name: "",
      min_length: 0,
      max_length: 0,
      min_width: 0,
      max_width: 0,
      material_ids: [],
      condition_ids: [],
      type_ids: [],
    });
    setSearchParams(new URLSearchParams());
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="road_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Jalan</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Cari Nama" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={control}
            name="min_length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Panjang Min</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="max_length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Panjang Maks</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={control}
            name="min_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lebar Min</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="max_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lebar Maks</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* TODO: fix checkbox bug */}
        {/* Material Checkbox */}
        {roadMaterials?.eksisting && roadMaterials.eksisting.length > 0 && (
          <div>
            <FormLabel className="mb-2">Bahan</FormLabel>
            {roadMaterials.eksisting.map((material) => (
              <div key={material.id} className="mb-1 flex items-center gap-2">
                <Checkbox
                  value={material.id}
                  {...register("material_ids")}
                  id={`material-${material.id}`}
                />
                <Label htmlFor={`material-${material.id}`}>
                  {material.eksisting}
                </Label>
              </div>
            ))}
          </div>
        )}

        {/* Condition Checkbox */}
        {roadConditions?.eksisting && roadConditions.eksisting.length > 0 && (
          <div>
            <FormLabel className="mb-2">Bahan</FormLabel>
            {roadConditions.eksisting.map((condition) => (
              <div key={condition.id} className="mb-1 flex items-center gap-2">
                <Checkbox
                  value={condition.id}
                  {...register("condition_ids")}
                  id={`condition-${condition.id}`}
                />
                <Label htmlFor={`condition-${condition.id}`}>
                  {condition.kondisi}
                </Label>
              </div>
            ))}
          </div>
        )}

        {/* Type Checkbox */}
        {roadTypes?.eksisting && roadTypes.eksisting.length > 0 && (
          <div>
            <FormLabel className="mb-2">Bahan</FormLabel>
            {roadTypes.eksisting.map((type) => (
              <div key={type.id} className="mb-1 flex items-center gap-2">
                <Checkbox
                  value={type.id}
                  {...register("type_ids")}
                  id={`type-${type.id}`}
                />
                <Label htmlFor={`type-${type.id}`}>{type.jenisjalan}</Label>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col justify-between gap-2 pt-2">
          <Button type="submit" className="w-full">
            Terapkan Filter
          </Button>
          <Button
            type="button"
            onClick={onReset}
            variant="outline"
            className="w-full"
          >
            Reset Filter
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
