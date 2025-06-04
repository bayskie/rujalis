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
import { FormProvider, useForm, type Control } from "react-hook-form";
import { useSearchParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

function CheckboxGroupField({
  control,
  name,
  options,
  label,
}: {
  control: Control;
  name: string;
  options: { id: string | number; label: string }[];
  label: string;
}) {
  return (
    <div>
      <FormLabel className="mb-2">{label}</FormLabel>
      {options.map((option) => (
        <FormField
          key={option.id}
          control={control}
          name={name}
          render={({ field }) => {
            const valueStr = String(option.id);
            const isChecked = field.value?.includes(valueStr);

            return (
              <div className="mb-1 flex items-center gap-2">
                <Checkbox
                  id={`${name}-${valueStr}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...(field.value || []), valueStr]
                      : (field.value || []).filter(
                          (id: string | number) => id != valueStr,
                        );
                    field.onChange(newValue);
                  }}
                />
                <Label htmlFor={`${name}-${valueStr}`}>{option.label}</Label>
              </div>
            );
          }}
        />
      ))}
    </div>
  );
}

export function RoadSegmentFilterForm({
  height = "100%",
}: {
  height?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: roadMaterials } = useMasterRoadMaterialsQuery();
  const { data: roadConditions } = useMasterRoadConditionsQuery();
  const { data: roadTypes } = useMasterRoadTypesQuery();

  const form = useForm<RoadSegmentFilterOptions>({
    defaultValues: {
      road_name: searchParams.get("road_name") || "",
      min_length: Number(searchParams.get("min_length")) || Number(""),
      max_length: Number(searchParams.get("max_length")) || Number(""),
      min_width: Number(searchParams.get("min_width")) || Number(""),
      max_width: Number(searchParams.get("max_width")) || Number(""),
      material_ids: searchParams.getAll("material_ids") || [],
      condition_ids: searchParams.getAll("condition_ids") || [],
      type_ids: searchParams.getAll("type_ids") || [],
    },
  });

  const { control, reset, handleSubmit } = form;

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

  const onReset = () => {
    reset();
    setSearchParams(new URLSearchParams());
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
        <ScrollArea className="overflow-y-auto" style={{ height }}>
          <div className="space-y-4 p-2">
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

            {roadMaterials?.eksisting && (
              <CheckboxGroupField
                control={control}
                name="material_ids"
                label="Material"
                options={roadMaterials.eksisting.map((m) => ({
                  id: m.id,
                  label: m.eksisting,
                }))}
              />
            )}

            {roadConditions?.eksisting && (
              <CheckboxGroupField
                control={control}
                name="condition_ids"
                label="Kondisi"
                options={roadConditions.eksisting.map((c) => ({
                  id: c.id,
                  label: c.kondisi,
                }))}
              />
            )}

            {roadTypes?.eksisting && (
              <CheckboxGroupField
                control={control}
                name="type_ids"
                label="Jenis Jalan"
                options={roadTypes.eksisting.map((t) => ({
                  id: t.id,
                  label: t.jenisjalan,
                }))}
              />
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="mt-2 flex flex-col gap-2">
          <Button type="submit" className="w-full">
            <Filter />
            Terapkan Filter
          </Button>
          <Button
            type="button"
            onClick={onReset}
            variant="outline"
            className="w-full"
          >
            <RotateCcw />
            Reset Filter
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
