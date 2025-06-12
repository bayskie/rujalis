import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Loader2, Plus, Search } from "lucide-react";
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
import { useEffect, useState } from "react";
import { useSearchPlaceQuery } from "@/hooks/use-search-place-query";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RoadSegmentFilterForm } from "@/components/road-segment-filter-form";

interface RoadSegmentToolbarProps {
  showSearch?: boolean;
  showTileLayer?: boolean;
  showAddButton?: boolean;
  onTileLayerChange?: (layer: (typeof TILE_LAYERS)[0]) => void;
}

export const RoadSegmentToolbar = ({
  showSearch = true,
  showTileLayer = true,
  showAddButton = true,
  onTileLayerChange,
}: RoadSegmentToolbarProps) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchPlaces, isPending: isSearchPlacesPending } =
    useSearchPlaceQuery(searchQuery);

  const [activeTileLayerName, setActiveTileLayerName] = useState(
    TILE_LAYERS[0].name,
  );

  useEffect(() => {
    onTileLayerChange?.(
      TILE_LAYERS.find((l) => l.name === activeTileLayerName)!,
    );
  }, [activeTileLayerName, onTileLayerChange]);

  const onSearch = () => {
    setSearchQuery(inputValue);
  };

  return (
    <div className="absolute top-2 left-2 z-30 w-72 overflow-auto p-1">
      <div className="bg-background flex flex-col gap-2 rounded-lg border p-2 shadow-md">
        {/* Search Place */}
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
              onClick={onSearch}
              size="icon"
              disabled={isSearchPlacesPending || !inputValue}
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
                <Separator orientation="vertical" />
                <span className="truncate font-normal">
                  {activeTileLayerName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={activeTileLayerName}
                onValueChange={setActiveTileLayerName}
              >
                {TILE_LAYERS.map((layer) => (
                  <DropdownMenuRadioItem key={layer.name} value={layer.name}>
                    {layer.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Filter */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="mb-2 w-full justify-between">
              <h4 className="text-sm">Filter</h4>
              <Filter />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <RoadSegmentFilterForm height="10rem" />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {showAddButton && (
        <Button
          asChild
          className="bg-background hover:bg-background/90 text-foreground mt-2 w-full border shadow"
        >
          <Link to="/road-segments/add">
            <Plus /> Tambah Ruas Jalan
          </Link>
        </Button>
      )}
    </div>
  );
};
