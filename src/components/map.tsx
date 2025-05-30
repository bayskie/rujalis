import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useCallback, useEffect, useRef } from "react";
import { encode, decode } from "@mapbox/polyline";
import {
  length as turfLength,
  center as turfCenter,
  lineString,
} from "@turf/turf";

const TILE_LAYERS = [
  {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
];

interface MapComponentProps {
  zoom?: number;
  center?: [number, number];
  encodedRoadSegment?: string;
  onLengthChange?: (lengthMeters: number) => void;
  onEncodedChange?: (encoded: string) => void;
}

export const MapComponent = ({
  zoom = 14,
  center = [-8.7947286, 115.17390369964819],
  encodedRoadSegment,
  onLengthChange,
  onEncodedChange,
}: MapComponentProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const roadSegmentRef = useRef<L.Polyline | null>(null);

  const updateRoadSegmentInfo = useCallback(
    (layer: L.Polyline) => {
      try {
        const geojson = layer.toGeoJSON();
        const lengthMeters = turfLength(geojson, { units: "meters" });
        onLengthChange?.(lengthMeters);

        const rawLatLngs = layer.getLatLngs();
        const latLngs = Array.isArray(rawLatLngs[0])
          ? (rawLatLngs[0] as L.LatLng[])
          : (rawLatLngs as L.LatLng[]);

        const coords: [number, number][] = latLngs.map(({ lat, lng }) => [
          lng,
          lat,
        ]);
        const encoded = encode(coords);
        onEncodedChange?.(encoded);
      } catch (err) {
        console.error("Error updating road segment info:", err);
      }
    },
    [onLengthChange, onEncodedChange],
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let initialCenter = center;
    let decodedCoords: [number, number][] = [];

    if (encodedRoadSegment) {
      decodedCoords = decode(encodedRoadSegment);
      const roadSegmentLine = lineString(decodedCoords);
      const roadSegmentCenter = turfCenter(roadSegmentLine);
      const [lng, lat] = roadSegmentCenter.geometry.coordinates;
      initialCenter = [lat, lng];
    }

    const map = L.map(mapContainerRef.current).setView(initialCenter, zoom);
    mapInstanceRef.current = map;

    const tile = TILE_LAYERS[0];
    L.tileLayer(tile.url, { attribution: tile.attribution }).addTo(map);

    if (encodedRoadSegment && decodedCoords.length) {
      const latLngs = decodedCoords.map(([lat, lng]) => L.latLng(lat, lng));
      const polyline = L.polyline(latLngs, { color: "blue" }).addTo(map);
      roadSegmentRef.current = polyline;
      updateRoadSegmentInfo(polyline);

      polyline.on("pm:update", () => updateRoadSegmentInfo(polyline));
      polyline.on("pm:edit", () => updateRoadSegmentInfo(polyline));
      polyline.on("pm:remove", () => {
        map.removeLayer(polyline);
        roadSegmentRef.current = null;
        onEncodedChange?.("");
        onLengthChange?.(0);
        map.pm.enableDraw("Line");
      });
    }

    map.pm.addControls({
      position: "topleft",
      drawPolyline: true,
      editMode: true,
      removalMode: true,
      drawMarker: false,
      drawCircleMarker: false,
      drawPolygon: false,
      drawRectangle: false,
      drawCircle: false,
      drawText: false,
      dragMode: false,
      cutPolygon: false,
      rotateMode: false,
    });

    map.on("pm:create", (e) => {
      if (roadSegmentRef.current) return;

      const layer = e.layer as L.Polyline;
      map.addLayer(layer);
      roadSegmentRef.current = layer;

      updateRoadSegmentInfo(layer);

      layer.on("pm:update", () => updateRoadSegmentInfo(layer));
      layer.on("pm:edit", () => updateRoadSegmentInfo(layer));
      layer.on("pm:remove", () => {
        map.removeLayer(layer);
        roadSegmentRef.current = null;
        onEncodedChange?.("");
        onLengthChange?.(0);
        map.pm.enableDraw("Line");
      });

      map.pm.disableDraw("Line");
    });
  }, [
    center,
    zoom,
    encodedRoadSegment,
    onEncodedChange,
    onLengthChange,
    updateRoadSegmentInfo,
  ]);

  return (
    <div ref={mapContainerRef} className="z-10 h-full w-full rounded border" />
  );
};
