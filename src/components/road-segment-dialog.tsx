import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteRoadSegmentMutation } from "@/hooks/use-road-segment-mutation";
import type { EnrichedRoadSegment } from "@/types/road-segment";
import { Loader2, Pencil, Trash } from "lucide-react";
import { Link } from "react-router";

interface RoadSegmentDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  roadSegment?: EnrichedRoadSegment;
}

export const RoadSegmentDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  roadSegment,
}: RoadSegmentDialogProps) => {
  const deleteRoadSegmentById = useDeleteRoadSegmentMutation();

  const handleDelete = () => {
    deleteRoadSegmentById.mutate(roadSegment?.id || "");
    setIsDialogOpen(false);
  };

  const deleteAlertDialog = (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Hapus ruas {roadSegment?.kode_ruas}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus
            ruas {roadSegment?.nama_ruas} dengan kode {roadSegment?.kode_ruas}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className={buttonVariants({ variant: "destructive" })}
          >
            <Trash />
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ruas Jalan</DialogTitle>
        </DialogHeader>

        {!roadSegment && (
          <div className="my-4">
            <div className="text-muted-foreground flex animate-spin items-center justify-center">
              <Loader2 />
            </div>
          </div>
        )}

        {roadSegment && (
          <div className="my-4 grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Kode Ruas</p>
              <p className="font-medium">{roadSegment?.kode_ruas}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Nama Ruas</p>
              <p className="font-medium">{roadSegment?.nama_ruas}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Keterangan</p>
              <p className="font-medium">{roadSegment?.keterangan}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Daerah</p>
              <p className="font-medium">
                {roadSegment?.desa}
                {", "}
                {roadSegment?.kecamatan}
                {", "}
                {roadSegment?.kabupaten}
                {", "}
                {roadSegment?.provinsi}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Panjang</p>
              <p className="font-medium">{roadSegment?.panjang.toFixed(2)} m</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Lebar</p>
              <p className="font-medium">{roadSegment?.lebar.toFixed(2)} m</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Material</p>
              <Badge variant="secondary">{roadSegment?.eksisting}</Badge>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Kondisi</p>
              <Badge variant="secondary">{roadSegment?.kondisi}</Badge>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground">Jenis Jalan</p>
              <Badge variant="secondary">{roadSegment?.jenisjalan}</Badge>
            </div>
          </div>
        )}

        <DialogFooter>
          {deleteAlertDialog}

          <Button variant="warning" asChild>
            <Link to={`/road-segments/${roadSegment?.id}/edit`}>
              <Pencil />
              Edit
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
