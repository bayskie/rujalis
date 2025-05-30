import { useEffect, useState } from "react";
import {
  useForm,
  useController,
  type UseControllerProps,
  type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";

import {
  useAllProvincesQuery,
  useAllRegenciesByProvinceIdQuery,
  useAllSubdistrictsByRegencyIdQuery,
  useAllVillagesBySubdistrictIdQuery,
} from "@/hooks/use-region-query";
import {
  useMasterRoadMaterialsQuery,
  useMasterRoadConditionsQuery,
  useMasterRoadTypesQuery,
} from "@/hooks/use-master-data-query";

import type { RoadSegmentFormRequest } from "@/types/road-segment";
import { roadSegmentFormSchema } from "@/validators/road-segment";
import {
  useAddRoadSegmentMutation,
  useEditRoadSegmentMutation,
} from "@/hooks/use-road-segment-mutation";
import { Loader2 } from "lucide-react";

function useSelectOptions<T>(
  data: T[] | undefined,
  valueKey: keyof T,
  labelKey: keyof T,
) {
  return (
    data?.map((item) => ({
      value: String(item[valueKey]),
      label: String(item[labelKey]),
    })) || []
  );
}

type Option = { value: string; label: string };

function FormComboboxField<T extends FieldValues>({
  label,
  options,
  placeholder,
  disabled,
  ...controllerProps
}: UseControllerProps<T> & {
  label: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const {
    field,
    fieldState: { error },
  } = useController(controllerProps);

  return (
    <FormField
      control={controllerProps.control}
      name={controllerProps.name}
      render={() => (
        <FormItem className="flex-1">
          <FormLabel className="gap-1">
            <span>{label}</span>
            <span className="text-destructive">*</span>
          </FormLabel>
          <FormControl>
            <Combobox
              className="w-full"
              options={options}
              selectedValue={field.value ?? ""}
              onChange={field.onChange}
              placeholder={placeholder}
              emptyMessage="Tidak ditemukan."
              disabled={disabled}
              hasError={!!error}
            />
          </FormControl>
          <FormMessage className="overflow-hidden text-ellipsis whitespace-nowrap" />
        </FormItem>
      )}
    />
  );
}

interface RoadSegmentFormProps {
  values?: Partial<RoadSegmentFormRequest>;
  formType?: "add" | "edit";
  roadSegmentId?: string;
}

export const RoadSegmentForm = ({
  values,
  formType = "add",
  roadSegmentId,
}: RoadSegmentFormProps) => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedRegencyId, setSelectedRegencyId] = useState<string>("");
  const [selectedSubdistrictId, setSelectedSubdistrictId] =
    useState<string>("");

  const allProvinces = useAllProvincesQuery();
  const allRegencies = useAllRegenciesByProvinceIdQuery(selectedProvinceId);
  const allSubdistricts = useAllSubdistrictsByRegencyIdQuery(selectedRegencyId);
  const allVillages = useAllVillagesBySubdistrictIdQuery(selectedSubdistrictId);

  const allRoadMaterials = useMasterRoadMaterialsQuery();
  const allRoadConditions = useMasterRoadConditionsQuery();
  const allRoadTypes = useMasterRoadTypesQuery();

  const provinceOptions = useSelectOptions(
    allProvinces.data?.provinsi,
    "id",
    "provinsi",
  );
  const regencyOptions = useSelectOptions(
    allRegencies.data?.kabupaten,
    "id",
    "value",
  );
  const subdistrictOptions = useSelectOptions(
    allSubdistricts.data?.kecamatan,
    "id",
    "value",
  );
  const villageOptions = useSelectOptions(
    allVillages.data?.desa,
    "id",
    "value",
  );

  const roadMaterialOptions = useSelectOptions(
    allRoadMaterials.data?.eksisting,
    "id",
    "eksisting",
  );
  const roadConditionOptions = useSelectOptions(
    allRoadConditions.data?.eksisting,
    "id",
    "kondisi",
  );
  const roadTypeOptions = useSelectOptions(
    allRoadTypes.data?.eksisting,
    "id",
    "jenisjalan",
  );

  const form = useForm<RoadSegmentFormRequest>({
    resolver: zodResolver(roadSegmentFormSchema),
    defaultValues: {
      paths: values?.paths || "",
      kode_ruas: values?.kode_ruas || "",
      nama_ruas: values?.nama_ruas || "",
      keterangan: values?.keterangan || "",
      panjang: values?.panjang || 0,
      lebar: values?.lebar || 0,
      desa_id: values?.desa_id || "",
      eksisting_id: values?.eksisting_id || "",
      kondisi_id: values?.kondisi_id || "",
      jenisjalan_id: values?.jenisjalan_id || "",
    },
  });

  const { setValue } = form;

  useEffect(() => {
    return setValue("paths", values?.paths || "");
  }, [values?.paths, setValue]);

  useEffect(() => {
    return setValue("panjang", values?.panjang || 0);
  }, [values?.panjang, setValue]);

  const addRoadSegment = useAddRoadSegmentMutation();
  const editRoadSegment = useEditRoadSegmentMutation();

  const onSubmit = (data: RoadSegmentFormRequest) => {
    if (formType === "add") {
      addRoadSegment.mutate(data);
    } else {
      editRoadSegment.mutate({
        segmentId: roadSegmentId!,
        data,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[720px] space-y-4"
      >
        <h1 className="mb-4 text-xl font-semibold">
          {formType === "add" ? "Tambah" : "Edit"} Ruas Jalan
        </h1>

        <FormField
          control={form.control}
          name="kode_ruas"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                <span>Kode</span>
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="overflow-hidden text-ellipsis whitespace-nowrap" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paths"
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <FormField
          control={form.control}
          name="nama_ruas"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                <span>Nama</span>
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nama" {...field} />
              </FormControl>
              <FormMessage className="overflow-hidden text-ellipsis whitespace-nowrap" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keterangan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                <span>Keterangan</span>
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Keterangan" {...field} />
              </FormControl>
              <FormMessage className="overflow-hidden text-ellipsis whitespace-nowrap" />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="panjang"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="gap-1">
                  <span>Panjang (meter)</span>
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled />
                </FormControl>
                <FormMessage className="overflow-hidden text-ellipsis whitespace-nowrap" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lebar"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="gap-1">
                  <span>Lebar (meter)</span>
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage className="overflow-hidden text-ellipsis whitespace-nowrap" />
              </FormItem>
            )}
          />
        </div>

        {/* Region Selectors */}
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label className="gap-1">
              <span>Provinsi</span>
              <span className="text-destructive">*</span>
            </Label>
            <Combobox
              className="w-full"
              options={provinceOptions}
              selectedValue={selectedProvinceId}
              onChange={(val) => {
                setSelectedProvinceId(val);
                setSelectedRegencyId("");
                setSelectedSubdistrictId("");
              }}
              placeholder="Pilih Provinsi"
              emptyMessage="Provinsi tidak ditemukan."
            />
          </div>

          <div className="flex-1 space-y-2">
            <Label className="gap-1">
              <span>Kabupaten/Kota</span>
              <span className="text-destructive">*</span>
            </Label>
            <Combobox
              className="w-full"
              options={regencyOptions}
              selectedValue={selectedRegencyId}
              onChange={(val) => {
                setSelectedRegencyId(val);
                setSelectedSubdistrictId("");
              }}
              placeholder="Pilih Kabupaten/Kota"
              emptyMessage="Kabupaten/Kota tidak ditemukan."
              disabled={!selectedProvinceId}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label className="gap-1">
              <span>Kecamatan</span>
              <span className="text-destructive">*</span>
            </Label>
            <Combobox
              className="w-full"
              options={subdistrictOptions}
              selectedValue={selectedSubdistrictId}
              onChange={(val) => setSelectedSubdistrictId(val)}
              placeholder="Pilih Kecamatan"
              emptyMessage="Kecamatan tidak ditemukan."
              disabled={!selectedRegencyId}
            />
          </div>

          <FormComboboxField
            control={form.control}
            name="desa_id"
            label="Desa"
            options={villageOptions}
            placeholder="Pilih Desa"
            disabled={!selectedSubdistrictId}
          />
        </div>

        {/* Road Attributes */}
        <div className="flex gap-2">
          <FormComboboxField
            control={form.control}
            name="eksisting_id"
            label="Material"
            options={roadMaterialOptions}
            placeholder="Pilih Material"
          />

          <FormComboboxField
            control={form.control}
            name="kondisi_id"
            label="Kondisi"
            options={roadConditionOptions}
            placeholder="Pilih Kondisi"
          />

          <FormComboboxField
            control={form.control}
            name="jenisjalan_id"
            label="Jenis"
            options={roadTypeOptions}
            placeholder="Pilih Jenis"
          />
        </div>

        <Button
          type="submit"
          disabled={
            !form.formState.isValid ||
            addRoadSegment.isPending ||
            editRoadSegment.isPending
          }
        >
          {(addRoadSegment.isPending || editRoadSegment.isPending) && (
            <Loader2 className="animate-spin" />
          )}
          Simpan
        </Button>
      </form>
    </Form>
  );
};
