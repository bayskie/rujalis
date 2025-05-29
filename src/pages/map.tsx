import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState } from "react";
import MapLayout from "@/layout/map";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search, ZoomIn, ZoomOut } from "lucide-react";
import { useSearchPlaceQuery } from "@/hooks/use-search-place-query";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { Link } from "react-router";

const customIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  tooltipAnchor: [0, -41],
  shadowSize: [41, 41],
});

const TILE_LAYERS = [
  {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: "OpenTopoMap",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      '<a href="https://opentopomap.org">OpenTopoMap</a>',
  },
  {
    name: "CartoDB Positron",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a> ' +
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    name: "CartoDB Dark Matter",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a> ' +
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
];

export default function Map() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: places, isPending: isSearchPlacesPending } =
    useSearchPlaceQuery(searchQuery);
  const [activeTileLayer, setActiveTileLayer] = useState(TILE_LAYERS[0]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, { zoomControl: false }).setView(
      [-6.2, 106.8],
      10,
    );

    const tileLayer = activeTileLayer;

    tileLayerRef.current = L.tileLayer(tileLayer.url, {
      attribution: tileLayer.attribution,
    }).addTo(map);

    mapInstanceRef.current = map;
  }, [activeTileLayer]);

  // Update Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    tileLayerRef.current = L.tileLayer(activeTileLayer.url, {
      attribution: activeTileLayer.attribution,
    }).addTo(map);
  }, [activeTileLayer]);

  // Update Current Place
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !places?.length) return;

    const { lat, lon, display_name } = places[0];
    const latLng = L.latLng(parseFloat(lat), parseFloat(lon));

    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }

    const marker = L.marker(latLng, { icon: customIcon })
      .addTo(map)
      .bindTooltip(display_name, { direction: "top" })
      .openTooltip();

    markerRef.current = marker;
    map.flyTo(latLng, 14);

    const timeout = setTimeout(() => {
      map.removeLayer(marker);
      if (markerRef.current === marker) {
        markerRef.current = null;
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [places]);

  return (
    <MapLayout>
      <div className="relative h-full">
        <Card className="absolute top-2 left-2 z-30 w-64 p-1">
          <CardContent className="flex flex-col gap-2 p-1">
            {/* Search Bar */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && setSearchQuery(inputValue)}
                placeholder="Cari Tempat"
                disabled={isSearchPlacesPending}
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => setSearchQuery(inputValue)}
                disabled={isSearchPlacesPending}
              >
                {isSearchPlacesPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Search />
                )}
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="w-[calc(50%-0.25rem)]"
                onClick={() => mapInstanceRef.current?.zoomIn()}
              >
                <ZoomIn /> Perbesar
              </Button>
              <Button
                variant="outline"
                className="w-[calc(50%-0.25rem)]"
                onClick={() => mapInstanceRef.current?.zoomOut()}
              >
                <ZoomOut /> Perkecil
              </Button>
            </div>

            {/* Tile Layer Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <span>Ganti Peta</span>
                  <Separator orientation="vertical" className="mx-2" />
                  <span className="truncate overflow-hidden font-normal whitespace-nowrap">
                    {activeTileLayer.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup
                  value={activeTileLayer.name}
                  onValueChange={(name) => {
                    const selected = TILE_LAYERS.find((l) => l.name === name);
                    if (selected) setActiveTileLayer(selected);
                  }}
                >
                  {TILE_LAYERS.map((layer) => (
                    <DropdownMenuRadioItem key={layer.name} value={layer.name}>
                      {layer.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add Road Segment */}
            <Button asChild>
              <Link to="/road-segments/add">
                <Plus /> Tambah Ruas Jalan
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div
          ref={mapContainerRef}
          className="z-10 h-full w-full rounded border"
        />
      </div>
    </MapLayout>
  );
}
