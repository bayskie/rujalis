import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Trash } from "lucide-react";
import type { RoadSegment } from "@/types/road-segment";
import { useDeleteRoadSegmentMutation } from "@/hooks/use-road-segment-mutation";

interface DeleteRoadSegmentButtonProps {
  roadSegment: RoadSegment;
  size?: "icon" | "default";
  cancelText?: string;
}

export function DeleteRoadSegmentButton({
  roadSegment,
  size = "default",
  cancelText = "Batal",
}: DeleteRoadSegmentButtonProps) {
  const deleteRoadSegment = useDeleteRoadSegmentMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={deleteRoadSegment.isPending}
          size={size}
        >
          <Trash />
          {size === "default" && "Hapus"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Hapus ruas {roadSegment.kode_ruas}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus
            ruas <strong>{roadSegment.nama_ruas}</strong> dengan kode{" "}
            <strong>{roadSegment.kode_ruas}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteRoadSegment.mutate(roadSegment.id)}
            className={buttonVariants({ variant: "destructive" })}
          >
            <Trash />
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
