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
import { useEnrichedRoadSegmentByIdQuery } from "@/hooks/use-road-segment-query";
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [clickedRoadSegmentId, setClickedRoadSegmentId] = useState<
    string | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: clickedRoadSegment } = useEnrichedRoadSegmentByIdQuery(
    clickedRoadSegmentId || "",
  );

  const decodePolyline = (encoded: string): [number, number][] => {
    return decode(encoded);
  };

  const getLatLngsFromLayer = (layer: L.Polyline): [number, number][] => {
    return (layer.getLatLngs() as L.LatLng[]).map(({ lat, lng }) => [lat, lng]);
  };

  const updatePolylineInfo = useCallback(
    (layer: L.Polyline) => {
      const geojson = layer.toGeoJSON();
      const coords = getLatLngsFromLayer(layer);
      const lengthMeters = turfLength(geojson, { units: "meters" });

      onLengthChange?.(lengthMeters);
      onEncodedChange?.(encode(coords));
    },
    [onLengthChange, onEncodedChange],
  );

  const attachPolylineEvents = useCallback(
    (polyline: L.Polyline) => {
      const map = mapRef.current;
      polyline.on("pm:update", () => updatePolylineInfo(polyline));
      polyline.on("pm:edit", () => updatePolylineInfo(polyline));
      polyline.on("pm:remove", () => {
        map?.removeLayer(polyline);
        polylineRef.current = null;
        onEncodedChange?.("");
        onLengthChange?.(0);
      });
    },
    [onEncodedChange, onLengthChange, updatePolylineInfo],
  );

  const setupMap = useCallback(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    });
    mapRef.current = map;

    const tile = TILE_LAYERS[0];
    L.tileLayer(tile.url, { attribution: tile.attribution }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    let viewCenter = center;

    if (activeRoadSegment) {
      const decoded = decodePolyline(activeRoadSegment.paths);
      if (decoded.length) {
        const [lng, lat] = turfCenter(lineString(decoded)).geometry.coordinates;
        viewCenter = [lng, lat];

        const polyline = L.polyline(decoded, { color: "blue" }).addTo(map);
        polylineRef.current = polyline;

        updatePolylineInfo(polyline);
        attachPolylineEvents(polyline);
      }
    }

    map.setView(viewCenter, zoom);

    map.pm.addControls({
      position: "topright",
      drawPolyline: drawable,
      editMode: drawable,
      removalMode: drawable,
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

    if (drawable) {
      map.on("pm:create", (e) => {
        if (polylineRef.current) return;

        const layer = e.layer as L.Polyline;
        map.addLayer(layer);
        polylineRef.current = layer;

        updatePolylineInfo(layer);
        attachPolylineEvents(layer);
      });
    }
  }, [
    center,
    activeRoadSegment,
    zoom,
    drawable,
    updatePolylineInfo,
    attachPolylineEvents,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !roadSegments.length) return;

    roadSegments.forEach((segment) => {
      if (
        !segment.paths ||
        (activeRoadSegment && segment.id === activeRoadSegment.id)
      )
        return;

      const decoded = decodePolyline(segment.paths);

      // TODO: Add dynamic weight, custom color and dashArray by road segment type
      const polyline = L.polyline(decoded, {
        color: "green",
        weight: 10,
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
        setClickedRoadSegmentId(segment.id);
        setIsDialogOpen(true);
      });
    });
  }, [activeRoadSegment, roadSegments]);

  useEffect(() => {
    setupMap();
  }, [setupMap]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div
        ref={mapContainerRef}
        className="z-10 h-full w-full rounded border"
      />

      <RoadSegmentDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        roadSegment={clickedRoadSegment?.ruasjalan}
      />
    </>
  );
};
