import type { NominatimPlace } from "@/types/nominatim";
import type { GetAllRegionsResponse } from "@/types/region";

function normalize(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[^\p{ASCII}]/gu, "")
    .replace(/[^\w\s]/g, "")
    .trim()
    .toLowerCase();
}

export const matchRegions = (
  regions: GetAllRegionsResponse,
  place: NominatimPlace,
) => {
  const address = place.address;

  const provinceName = normalize(address?.state || "");
  const regencyName = normalize(address?.county || address?.city || "");
  const subdistrictName = normalize(
    address?.municipality || address?.city_district || "",
  );
  const villageName = normalize(
    address?.village || address?.suburb || address?.town || "",
  );

  const provinsi = regions?.provinsi.find(
    (p) => normalize(p.provinsi) === provinceName,
  );

  const kabupaten = regions?.kabupaten.find(
    (k) =>
      normalize(k.kabupaten) === regencyName &&
      (!provinsi || k.prov_id === provinsi.id),
  );

  const kecamatan = regions?.kecamatan.find(
    (kec) =>
      normalize(kec.kecamatan) === subdistrictName &&
      (!kabupaten || kec.kab_id === kabupaten.id),
  );

  const desa = regions?.desa.find(
    (d) =>
      normalize(d.desa) === villageName &&
      (!kecamatan || d.kec_id === kecamatan.id),
  );

  return {
    province_id: provinsi?.id || null,
    regency_id: kabupaten?.id || null,
    subdistrict_id: kecamatan?.id || null,
    village_id: desa?.id || null,
    lat: place.lat,
    lng: place.lon,
  };
};
