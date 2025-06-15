import { nominatimClient } from "@/lib/http-client";
import type { NominatimPlace } from "@/types/nominatim";

export const searchPlaceFn = async (
  query: string,
): Promise<NominatimPlace[]> => {
  const res = await nominatimClient.get("/search", {
    params: {
      q: query,
      format: "json",
      addressdetails: 1,
      limit: 10,
    },
  });

  return res.data;
};

export const searchReversePlaceFn = async (
  lat: number,
  lon: number,
): Promise<NominatimPlace> => {
  const res = await nominatimClient.get("/reverse", {
    params: {
      format: "json",
      addressdetails: 1,
      limit: 10,
      lat,
      lon,
    },
  });

  return res.data;
};

export const structuredSearchPlaceFn = async ({
  country,
  state,
  county,
  city,
  village,
}: {
  country?: string;
  state?: string;
  county?: string;
  city?: string;
  village?: string;
}): Promise<NominatimPlace[]> => {
  const res = await nominatimClient.get("/search", {
    params: {
      format: "json",
      addressdetails: 1,
      limit: 10,
      country,
      state,
      county,
      city,
      village,
    },
  });

  return res.data;
};
