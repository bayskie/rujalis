import { Card, CardContent } from "@/components/ui/card";
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
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Wilayah</h1>
        <h3 className="text-muted-foreground text-sm">
          Data lengkap wilayah yang terdaftar
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="py-2">
          <CardContent className="p-4">
            <div className="space-y-2">
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
                className="w-full"
              />
              <div className="mt-2 h-60 space-y-1 overflow-y-auto rounded-md border p-2">
                {allProvinces.isLoading && (
                  <p className="text-muted-foreground text-sm">Memuat...</p>
                )}
                {allProvinces.data?.provinsi.map((province) => (
                  <p
                    key={province.id}
                    className="rounded-lg border px-2 py-1.5 text-sm"
                  >
                    {province.provinsi}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-2">
          <CardContent className="p-4">
            <div className="space-y-2">
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
                disabled={!activeProvinceId || allRegencies.isLoading}
                className="w-full"
              />
              <div className="mt-2 h-60 space-y-1 overflow-y-auto rounded-md border p-2">
                {allRegencies.isLoading && (
                  <p className="text-muted-foreground text-sm">Memuat...</p>
                )}
                {allRegencies.data?.kabupaten.map((regency) => (
                  <p
                    key={regency.id}
                    className="rounded-lg border px-2 py-1.5 text-sm"
                  >
                    {regency.value}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-2">
          <CardContent className="p-4">
            <div className="space-y-2">
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
                disabled={!activeRegencyId || allSubdistricts.isLoading}
                className="w-full"
              />
              <div className="mt-2 h-60 space-y-1 overflow-y-auto rounded-md border p-2">
                {allSubdistricts.isLoading && (
                  <p className="text-muted-foreground text-sm">Memuat...</p>
                )}
                {allSubdistricts.data?.kecamatan.map((subdistrict) => (
                  <p
                    key={subdistrict.id}
                    className="rounded-lg border px-2 py-1.5 text-sm"
                  >
                    {subdistrict.value}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-2">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Label>Desa/Kelurahan</Label>
              <Combobox
                options={villageOptions}
                selectedValue={activeVillageId}
                onChange={(value) => setActiveVillageId(value)}
                placeholder="Pilih Desa/Kelurahan"
                emptyMessage="Desa tidak ditemukan."
                disabled={!activeSubdistrictId || allVillages.isLoading}
                className="w-full"
              />
              <div className="mt-2 h-60 space-y-1 overflow-y-auto rounded-md border p-2">
                {allVillages.isLoading && (
                  <p className="text-muted-foreground text-sm">Memuat...</p>
                )}
                {allVillages.data?.desa.map((village) => (
                  <p
                    key={village.id}
                    className="rounded-lg border px-2 py-1.5 text-sm"
                  >
                    {village.value}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
}
