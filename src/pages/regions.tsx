import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import {
  useAllProvincesQuery,
  useAllRegenciesByProvinceIdQuery,
  useAllSubdistrictsByRegencyIdQuery,
  useAllVillagesBySubdistrictIdQuery,
} from "@/hooks/use-region-query";
import DefaultLayout from "@/layout/default";
import { useState } from "react";

export default function Regions() {
  const [activeProvinceId, setActiveProvinceId] = useState<string>("");
  const [activeRegencyId, setActiveRegencyId] = useState<string>("");
  const [activeSubdistrictId, setActiveSubdistrictId] = useState<string>("");
  const [activeVillageId, setActiveVillageId] = useState<string>("");

  const allProvinces = useAllProvincesQuery();
  const allRegencies = useAllRegenciesByProvinceIdQuery(activeProvinceId);
  const allSubdistricts = useAllSubdistrictsByRegencyIdQuery(activeRegencyId);
  const allVillages = useAllVillagesBySubdistrictIdQuery(activeSubdistrictId);

  const provinceOptions =
    allProvinces.data?.provinsi.map((province) => ({
      value: String(province.id),
      label: province.provinsi,
    })) || [];

  const regencyOptions =
    allRegencies.data?.kabupaten.map((regency) => ({
      value: String(regency.id),
      label: regency.value,
    })) || [];

  const subdistrictOptions =
    allSubdistricts.data?.kecamatan.map((subdistrict) => ({
      value: String(subdistrict.id),
      label: subdistrict.value,
    })) || [];

  const villageOptions =
    allVillages.data?.desa.map((village) => ({
      value: String(village.id),
      label: village.value,
    })) || [];

  return (
    <DefaultLayout>
      <h1 className="mb-2 text-xl font-semibold">Wilayah</h1>
      {/* TODO: show detail of selected region */}
      <div className="flex flex-col flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <Label>Provinsi</Label>
          <Combobox
            options={provinceOptions}
            selectedValue={activeProvinceId}
            onChange={(value) => {
              setActiveProvinceId(value);
              setActiveRegencyId("");
              setActiveSubdistrictId("");
              setActiveVillageId("");
            }}
            placeholder="Pilih Provinsi"
            emptyMessage="Provinsi tidak ditemukan."
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Kabupaten/Kota</Label>
          <Combobox
            options={regencyOptions}
            selectedValue={activeRegencyId}
            onChange={(value) => {
              setActiveRegencyId(value);
              setActiveSubdistrictId("");
              setActiveVillageId("");
            }}
            placeholder="Pilih Kabupaten/Kota"
            emptyMessage="Kabupaten tidak ditemukan."
            disabled={!activeProvinceId}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Kecamatan</Label>
          <Combobox
            options={subdistrictOptions}
            selectedValue={activeSubdistrictId}
            onChange={(value) => {
              setActiveSubdistrictId(value);
              setActiveVillageId("");
            }}
            placeholder="Pilih Kecamatan"
            emptyMessage="Kecamatan tidak ditemukan."
            disabled={!activeRegencyId}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Desa/Kelurahan</Label>
          <Combobox
            options={villageOptions}
            selectedValue={activeVillageId}
            onChange={(value) => setActiveVillageId(value)}
            placeholder="Pilih Desa/Kelurahan"
            emptyMessage="Desa tidak ditemukan."
            disabled={!activeSubdistrictId}
          />
        </div>
      </div>
    </DefaultLayout>
  );
}
