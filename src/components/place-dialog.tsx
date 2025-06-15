import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { matchRegions } from "@/lib/match-regions";
import { useSearchReversePlaceQuery } from "@/hooks/use-search-place-query";
import { Loader2, Plus } from "lucide-react";
import { Link } from "react-router";
import { useAllRegionsQuery } from "@/hooks/use-region-query";

interface PlaceDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  latLng: [number, number];
}

export function PlaceDialog({
  isDialogOpen,
  setIsDialogOpen,
  latLng,
}: PlaceDialogProps) {
  const { data: place, isLoading } = useSearchReversePlaceQuery(
    latLng[0],
    latLng[1],
  );
  const { data: regions } = useAllRegionsQuery();

  const matched = place && regions ? matchRegions(regions, place) : null;

  console.log({ matched });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lokasi</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Loader2 className="text-muted-foreground animate-spin" />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Provinsi</p>
              <p className="font-medium">{place?.address?.state}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Kabupaten/Kota</p>
              <p className="font-medium">
                {place?.address?.county || place?.address?.city}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Kecamatan</p>
              <p className="font-medium">
                {place?.address?.municipality || place?.address?.city_district}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Desa</p>
              <p className="font-medium">
                {place?.address?.village ||
                  place?.address?.suburb ||
                  place?.address?.town}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button asChild>
            <Link
              to={{
                pathname: "/road-segments/add",
                search: matched
                  ? `?${new URLSearchParams(
                      Object.entries(matched)
                        .filter(([, v]) => v !== null)
                        .map(([k, v]) => [k, String(v)]),
                    ).toString()}`
                  : "",
              }}
            >
              <Plus /> Tambah Ruas Jalan
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
