import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator";
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
import { useSettingStore } from "@/stores/setting-store";
import { createIconPattern, createLinePattern } from "@/lib/create-pattern";
import { PlaceDialog } from "@/components/place-dialog";

interface MapComponentProps {
  zoom?: number;
  center?: [number, number];
  drawable?: boolean;
  activeTileLayer?: (typeof TILE_LAYERS)[0];
  activeRoadSegment?: RoadSegment;
  roadSegments?: RoadSegment[];
  onLengthChange?: (lengthMeters: number) => void;
  onEncodedChange?: (encoded: string) => void;
}

export const MapComponent = ({
  zoom = 14,
  center = [-8.7947286, 115.17390369964819],
  drawable = true,
  activeTileLayer = TILE_LAYERS[0],
  activeRoadSegment,
  roadSegments = [],
  onLengthChange,
  onEncodedChange,
}: MapComponentProps) => {
  const { scheme, roadMaterialStyle, roadConditionStyle, roadTypeStyle } =
    useSettingStore();

  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>("");
  const [isPlaceDialogOpen, setIsPlaceDialogOpen] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState<[number, number]>([
    0, 0,
  ]);
  const [isRoadSegmentDialogOpen, setIsRoadSegmentDialogOpen] = useState(false);

  const firstSegmentPath = roadSegments[0]?.paths;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const editablePolylineRef = useRef<L.Polyline | null>(null);
  const segmentLayerRefs = useRef<L.Layer[]>([]);

  // Encode latlngs to polyline
  const decodePolyline = (encoded: string): [number, number][] => {
    return decode(encoded);
  };

  // Extract latlngs from polyline
  const extractLatLngs = (polyline: L.Polyline): [number, number][] => {
    return (polyline.getLatLngs() as L.LatLng[]).map(({ lat, lng }) => [
      lat,
      lng,
    ]);
  };

  // Update polyline data such as length and encoded string when polyline is updated
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

  // Bind polyline events to update polyline data
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

  // Initialize the map when the component mounts
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapInstance = L.map(mapContainerRef.current, { zoomControl: false });
    mapRef.current = mapInstance;
    mapInstance.pm.setLang("id");

    const tileLayer = activeTileLayer;

    L.tileLayer(tileLayer.url, {
      attribution: tileLayer.attribution,
    }).addTo(mapInstance);

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

    if (drawable) {
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
    } else {
      mapInstance.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setSelectedLatLng([lat, lng]);
        setIsPlaceDialogOpen(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the map center when center changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady || !center) return;

    map.setView(center, zoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapReady, zoom, JSON.stringify(center)]);

  // Update the map center when road segment changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    if (activeRoadSegment) {
      const decodedPath = decodePolyline(activeRoadSegment.paths);
      if (decodedPath.length) {
        const [lat, lng] = turfCenter(lineString(decodedPath)).geometry
          .coordinates;
        map.setView([lat, lng], zoom);
      }
      return;
    }

    if (firstSegmentPath) {
      const decodedPath = decodePolyline(firstSegmentPath);
      if (decodedPath.length > 0) {
        const [lat, lng] = turfCenter(lineString(decodedPath)).geometry
          .coordinates;
        map.setView([lat, lng], zoom);
      }
    }
  }, [isMapReady, zoom, firstSegmentPath, activeRoadSegment]);

  // Update the map when active tile layer changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady || !activeTileLayer) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(activeTileLayer.url, {
      attribution: activeTileLayer.attribution,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [activeTileLayer, isMapReady]);

  // Update the map when road segments change or active road segment changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady || !roadSegments.length) return;

    segmentLayerRefs.current.forEach((layer) => map.removeLayer(layer));
    segmentLayerRefs.current = [];

    roadSegments.forEach((segment) => {
      if (!segment.paths) {
        return;
      }

      const path = decodePolyline(segment.paths);

      let color = "blue";
      if (scheme === "material") {
        color = roadMaterialStyle[segment.eksisting_id].color;
      } else if (scheme === "condition") {
        color = roadConditionStyle[segment.kondisi_id].color;
      } else if (scheme === "type") {
        color = roadTypeStyle[segment.jenisjalan_id].color;
      }

      const { icon } = roadConditionStyle[segment.kondisi_id];
      const { pattern, weight } = roadTypeStyle[segment.jenisjalan_id];

      const polyline = L.polyline(path, {
        interactive: true,
        color: pattern === "solid" ? color : "white",
        weight,
        opacity: pattern === "solid" ? 1 : 0.01,
      }).addTo(map);

      if (pattern !== "solid") {
        const linePatterns = createLinePattern(pattern, color, weight);
        const decorator = L.polylineDecorator(polyline, {
          patterns: linePatterns,
        }).addTo(map);
        segmentLayerRefs.current.push(decorator);
      }

      const iconPatterns = createIconPattern(icon, color);
      const decorator = L.polylineDecorator(polyline, {
        patterns: iconPatterns,
      }).addTo(map);

      segmentLayerRefs.current.push(polyline);
      segmentLayerRefs.current.push(decorator);

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

      polyline.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedSegmentId(segment.id);
        setIsRoadSegmentDialogOpen(true);
      });
    });
  }, [
    roadSegments,
    activeRoadSegment,
    scheme,
    isMapReady,
    roadMaterialStyle,
    roadConditionStyle,
    roadTypeStyle,
  ]);

  // Clean up the map when the component unmounts
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
      <PlaceDialog
        isDialogOpen={isPlaceDialogOpen}
        setIsDialogOpen={setIsPlaceDialogOpen}
        latLng={selectedLatLng}
      />
      <RoadSegmentDialog
        isDialogOpen={isRoadSegmentDialogOpen}
        setIsDialogOpen={setIsRoadSegmentDialogOpen}
        roadSegmentId={selectedSegmentId}
      />
    </div>
  );
};
