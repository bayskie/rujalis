import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "@/assets/styles/tooltip.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { encode, decode } from "@mapbox/polyline";
import {
  length as turfLength,
  center as turfCenter,
  lineString,
} from "@turf/turf";

import { TILE_LAYERS } from "@/constants/tile-layers";
import type { RoadSegment } from "@/types/road-segment";
import { RoadSegmentDialog } from "@/components/road-segment-dialog";

interface MapComponentProps {
  zoom?: number;
  center?: [number, number];
  activeRoadSegment?: RoadSegment;
  roadSegments?: RoadSegment[];
  onLengthChange?: (lengthMeters: number) => void;
  onEncodedChange?: (encoded: string) => void;
  drawable?: boolean;
}

export const MapComponent = ({
  zoom = 14,
  center = [-8.7947286, 115.17390369964819],
  activeRoadSegment,
  roadSegments = [],
  onLengthChange,
  onEncodedChange,
  drawable = true,
}: MapComponentProps) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const editablePolylineRef = useRef<L.Polyline | null>(null);
  const segmentLayerRefs = useRef<L.Layer[]>([]);

  const decodePolyline = (encoded: string): [number, number][] =>
    decode(encoded);

  const extractLatLngs = (polyline: L.Polyline): [number, number][] =>
    (polyline.getLatLngs() as L.LatLng[]).map(({ lat, lng }) => [lat, lng]);

  const updatePolylineData = useCallback(
    (polyline: L.Polyline) => {
      const geojson = polyline.toGeoJSON();
      const coordinates = extractLatLngs(polyline);
      const length = turfLength(geojson, { units: "meters" });

      onLengthChange?.(length);
      onEncodedChange?.(encode(coordinates));
    },
    [onLengthChange, onEncodedChange],
  );

  const bindPolylineEvents = useCallback(
    (polyline: L.Polyline) => {
      polyline.on("pm:update", () => updatePolylineData(polyline));
      polyline.on("pm:edit", () => updatePolylineData(polyline));
      polyline.on("pm:remove", () => {
        mapRef.current?.removeLayer(polyline);
        editablePolylineRef.current = null;
        onLengthChange?.(0);
        onEncodedChange?.("");
      });
    },
    [updatePolylineData, onLengthChange, onEncodedChange],
  );

  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapInstance = L.map(mapContainerRef.current, { zoomControl: false });
    mapRef.current = mapInstance;
    mapInstance.pm.setLang("id");

    const baseTile = TILE_LAYERS[0];
    L.tileLayer(baseTile.url, { attribution: baseTile.attribution }).addTo(
      mapInstance,
    );
    L.control.zoom({ position: "topright" }).addTo(mapInstance);

    let viewCenter = center;

    if (activeRoadSegment) {
      const decodedPath = decodePolyline(activeRoadSegment.paths);
      if (decodedPath.length) {
        const [lng, lat] = turfCenter(lineString(decodedPath)).geometry
          .coordinates;
        viewCenter = [lng, lat];

        const polyline = L.polyline(decodedPath, { color: "blue" }).addTo(
          mapInstance,
        );
        editablePolylineRef.current = polyline;

        updatePolylineData(polyline);
        bindPolylineEvents(polyline);
      }
    }

    mapInstance.setView(viewCenter, zoom);
    setIsMapReady(true);

    mapInstance.pm.addControls({
      position: "topright",
      drawPolyline: drawable,
      editMode: drawable,
      removalMode: drawable,
      drawMarker: false,
      drawPolygon: false,
      drawCircle: false,
      drawRectangle: false,
      drawText: false,
      drawCircleMarker: false,
      dragMode: false,
      cutPolygon: false,
      rotateMode: false,
    });

    if (drawable) {
      mapInstance.on("pm:drawstart", ({ workingLayer }) => {
        workingLayer.on("pm:vertexadded", ({ workingLayer: layer }) => {
          if (editablePolylineRef.current) {
            mapInstance.removeLayer(editablePolylineRef.current);
            editablePolylineRef.current = null;
          }
          updatePolylineData(layer as L.Polyline);
        });
      });

      mapInstance.on("pm:create", ({ layer }) => {
        const newPolyline = layer as L.Polyline;
        editablePolylineRef.current = newPolyline;
        mapInstance.addLayer(newPolyline);

        updatePolylineData(newPolyline);
        bindPolylineEvents(newPolyline);
      });
    }
  }, [
    center,
    zoom,
    drawable,
    activeRoadSegment,
    updatePolylineData,
    bindPolylineEvents,
  ]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady || !roadSegments.length) return;

    segmentLayerRefs.current.forEach((layer) => map.removeLayer(layer));
    segmentLayerRefs.current = [];

    roadSegments.forEach((segment) => {
      if (
        !segment.paths ||
        (activeRoadSegment && segment.id === activeRoadSegment.id)
      )
        return;

      const path = decodePolyline(segment.paths);
      const polyline = L.polyline(path, {
        color: "green",
        weight: 4,
        opacity: 1,
        dashArray: "7, 20",
        interactive: true,
      }).addTo(map);

      polyline.bindTooltip(
        `<div class="leaflet-tooltip-custom__content">
          <strong class="leaflet-tooltip-custom__title">${segment.kode_ruas}</strong>
          <p class="leaflet-tooltip-custom__subtitle">${segment.nama_ruas}</p>
          <p class="leaflet-tooltip-custom__description">${segment.keterangan}</p>
        </div>`,
        {
          permanent: false,
          direction: "top",
          sticky: true,
          className: "leaflet-tooltip-custom",
        },
      );

      polyline.on("click", () => {
        setSelectedSegmentId(segment.id);
        setIsDialogOpen(true);
      });

      segmentLayerRefs.current.push(polyline);
    });
  }, [roadSegments, activeRoadSegment, isMapReady]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div
        ref={mapContainerRef}
        className="z-10 h-full w-full rounded border"
      />
      <RoadSegmentDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        roadSegmentId={selectedSegmentId}
      />
    </div>
  );
};
