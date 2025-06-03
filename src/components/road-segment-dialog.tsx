import { DeleteRoadSegmentButton } from "@/components/delete-road-segment-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEnrichedRoadSegmentByIdQuery } from "@/hooks/use-road-segment-query";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Loader2, Pencil } from "lucide-react";
import { Link } from "react-router";

interface RoadSegmentDialogProps {
  isDialogOpen?: boolean;
  setIsDialogOpen?: (open: boolean) => void;
  roadSegmentId?: string;
  trigger?: React.ReactNode;
  showActions?: boolean;
}

export const RoadSegmentDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  roadSegmentId,
  trigger,
  showActions = true,
}: RoadSegmentDialogProps) => {
  const isControlled = typeof isDialogOpen === "boolean" && !!setIsDialogOpen;

  const { data, isLoading } = useEnrichedRoadSegmentByIdQuery(
    roadSegmentId ?? "",
  );
  const roadSegment = data?.ruasjalan || null;

  return (
    <Dialog
      open={isControlled ? isDialogOpen : undefined}
      onOpenChange={isControlled ? setIsDialogOpen : undefined}
    >
      {!isControlled && trigger && (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ruas Jalan</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="text-muted-foreground animate-spin" />
          </div>
        ) : !roadSegment ? (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-muted-foreground">Ruas Jalan tidak ditemukan</p>
          </div>
        ) : null}

        {roadSegment && (
          <>
            <div className="my-4 grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Kode Ruas</p>
                <p className="font-medium">{roadSegment.kode_ruas}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Nama Ruas</p>
                <p className="font-medium">{roadSegment.nama_ruas}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Keterangan</p>
                <p className="font-medium">{roadSegment.keterangan}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Daerah</p>
                <p className="font-medium">
                  {roadSegment.desa}
                  {", "}
                  {roadSegment.kecamatan}
                  {", "}
                  {roadSegment.kabupaten}
                  {", "}
                  {roadSegment.provinsi}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Panjang</p>
                <p className="font-medium">
                  {roadSegment.panjang.toFixed(2)} m
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Lebar</p>
                <p className="font-medium">{roadSegment.lebar.toFixed(2)} m</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Material</p>
                <Badge variant="secondary">{roadSegment.eksisting}</Badge>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Kondisi</p>
                <Badge variant="secondary">{roadSegment.kondisi}</Badge>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground">Jenis Jalan</p>
                <Badge variant="secondary">{roadSegment.jenisjalan}</Badge>
              </div>
            </div>

            {showActions && (
              <DialogFooter>
                {roadSegment && (
                  <DeleteRoadSegmentButton roadSegment={roadSegment} />
                )}

                <Button variant="warning" asChild>
                  <Link to={`/road-segments/${roadSegment.id}/edit`}>
                    <Pencil />
                    Edit
                  </Link>
                </Button>
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
