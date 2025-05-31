// components/map/MapToolbar.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router";
import { TILE_LAYERS } from "@/constants/tile-layers";

interface MapToolbarProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  isSearchPlacesPending: boolean;
  onSearch: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  activeTileLayerName: string;
  onChangeTileLayer: (name: string) => void;

  showSearch?: boolean;
  showTileLayer?: boolean;
  showAddButton?: boolean;
}

export function MapToolbar({
  inputValue,
  setInputValue,
  isSearchPlacesPending,
  onSearch,
  activeTileLayerName,
  onChangeTileLayer,
  showSearch = true,
  showTileLayer = true,
  showAddButton = true,
}: MapToolbarProps) {
  const tileLayers = TILE_LAYERS;

  return (
    <div className="absolute top-2 left-2 z-30 w-64 p-1">
      <div className="flex flex-col gap-2 rounded border bg-white p-1 shadow-md">
        {showSearch && (
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && onSearch()}
              placeholder="Cari Tempat"
              disabled={isSearchPlacesPending}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={onSearch}
              disabled={isSearchPlacesPending}
            >
              {isSearchPlacesPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search />
              )}
            </Button>
          </div>
        )}

        {showTileLayer && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <span>Ganti Peta</span>
                <Separator orientation="vertical" className="mx-2" />
                <span className="truncate font-normal">
                  {activeTileLayerName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={activeTileLayerName}
                onValueChange={onChangeTileLayer}
              >
                {tileLayers.map((layer) => (
                  <DropdownMenuRadioItem key={layer.name} value={layer.name}>
                    {layer.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showAddButton && (
          <Button asChild>
            <Link to="/road-segments/add">
              <Plus /> Tambah Ruas Jalan
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
