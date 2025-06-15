import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSearchReversePlaceQuery } from "@/hooks/use-search-place-query";
import { Loader2, Plus } from "lucide-react";
import { Link } from "react-router";

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
  const { data, isLoading } = useSearchReversePlaceQuery(latLng[0], latLng[1]);

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
              <p className="font-medium">{data?.address?.state}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Kabupaten/Kota</p>
              <p className="font-medium">
                {data?.address?.county || data?.address?.city}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Kecamatan</p>
              <p className="font-medium">
                {data?.address?.municipality || data?.address?.city_district}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Desa</p>
              <p className="font-medium">
                {data?.address?.village ||
                  data?.address?.suburb ||
                  data?.address?.town}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button asChild>
            <Link to="/road-segments/add">
              <Plus /> Tambah Ruas Jalan
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
