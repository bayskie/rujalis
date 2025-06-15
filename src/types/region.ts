import type { Meta } from "@/types/meta";

export interface GetAllProvincesResponse extends Meta {
  provinsi: {
    id: string;
    provinsi: string;
  }[];
}

export interface GetProvinceByIdResponse extends Meta {
  provinsi: {
    id: string;
    value: string;
  };
}

export interface GetAllRegenciesByProvinceIdResponse extends Meta {
  kabupaten: {
    id: string;
    value: string;
  }[];
}

export interface GetAllSubdistrictsByRegencyIdResponse extends Meta {
  kecamatan: {
    id: string;
    value: string;
  }[];
}

export interface GetAllVillagesBySubdistrictIdResponse extends Meta {
  desa: {
    id: string;
    value: string;
  }[];
}

export interface GetVillageByIdResponse extends Meta {
  desa: {
    id: string;
    desa: string;
  };
  kecamatan: {
    id: string;
    kecamatan: string;
  };
  kabupaten: {
    id: string;
    kabupaten: string;
  };
  provinsi: {
    id: string;
    provinsi: string;
  };
}

export interface GetAllRegionsResponse extends Meta {
  provinsi: {
    id: string;
    provinsi: string;
  }[];
  kabupaten: {
    id: string;
    prov_id: string;
    kabupaten: string;
  }[];
  kecamatan: {
    id: string;
    kab_id: string;
    kecamatan: string;
  }[];
  desa: {
    id: string;
    kec_id: string;
    desa: string;
  }[];
}
