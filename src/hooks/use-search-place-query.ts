import {
  searchPlaceFn,
  searchReversePlaceFn,
  structuredSearchPlaceFn,
} from "@/api/nominatim";
import type { NominatimPlace } from "@/types/nominatim";
import { useQuery } from "@tanstack/react-query";

export const useSearchPlaceQuery = (query: string) => {
  return useQuery<NominatimPlace[]>({
    queryKey: ["search-place", query],
    queryFn: () => searchPlaceFn(query),
    enabled: !!query,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
};

export const useSearchReversePlaceQuery = (lat: number, lng: number) => {
  return useQuery<NominatimPlace>({
    queryKey: ["search-reverse-place", lat, lng],
    queryFn: () => searchReversePlaceFn(lat, lng),
    enabled: !!lat && !!lng,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
};

export const useStructuredSearchPlaceQuery = (params: {
  street?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
  postalcode?: string;
}) => {
  const hasValidParams = Object.values(params).some((v) => !!v);

  return useQuery<NominatimPlace[]>({
    queryKey: ["structured-place", params],
    queryFn: () => structuredSearchPlaceFn(params),
    enabled: hasValidParams,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
};
