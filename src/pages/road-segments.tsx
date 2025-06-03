import { DataTable } from "@/components/data-table";
import { DeleteRoadSegmentButton } from "@/components/delete-road-segment-button";
import { RoadSegmentDialog } from "@/components/road-segment-dialog";
import { RoadSegmentFilterDrawer } from "@/components/road-segment-filter-drawer";
import { Button } from "@/components/ui/button";
import { useAllRoadSegmentsQuery } from "@/hooks/use-road-segment-query";
import DefaultLayout from "@/layout/default";
import type { RoadSegment } from "@/types/road-segment";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Plus } from "lucide-react";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";

const columns: ColumnDef<RoadSegment>[] = [
  {
    accessorKey: "kode_ruas",
    header: "Kode Ruas",
  },
  {
    accessorKey: "nama_ruas",
    header: "Nama Ruas",
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
  },
  {
    accessorKey: "panjang",
    header: "Panjang (m)",
    cell: ({ getValue }) => getValue<number>().toFixed(2),
  },
  {
    accessorKey: "lebar",
    header: "Lebar (m)",
    cell: ({ getValue }) => getValue<number>().toFixed(2),
  },
  {
    id: "aksi",
    header: "Aksi",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-1">
          <RoadSegmentDialog
            roadSegmentId={row.original.id}
            trigger={
              <Button size="icon" variant="success">
                <Eye />
              </Button>
            }
            showActions={false}
          />

          <Button size="icon" variant="warning" asChild>
            <Link to={`/road-segments/${row.original.id}/edit`}>
              <Pencil />
            </Link>
          </Button>

          <DeleteRoadSegmentButton roadSegment={row.original} size="icon" />
        </div>
      );
    },
  },
];

export default function RoadSegments() {
  const [searchParams] = useSearchParams();

  const filter = useMemo(() => {
    const getNumber = (key: string) => {
      const val = searchParams.get(key);
      return val ? Number(val) : undefined;
    };

    return {
      road_name: searchParams.get("road_name") || undefined,
      min_length: getNumber("min_length"),
      max_length: getNumber("max_length"),
      min_width: getNumber("min_width"),
      max_width: getNumber("max_width"),
      material_ids: searchParams.getAll("material_ids") || undefined,
      condition_ids: searchParams.getAll("condition_ids") || undefined,
      type_ids: searchParams.getAll("type_ids") || undefined,
    };
  }, [searchParams]);

  const { data } = useAllRoadSegmentsQuery(filter);

  return (
    <DefaultLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Ruas Jalan</h1>
        <h3 className="text-muted-foreground">Daftar ruas jalan</h3>
      </div>

      <div className="mb-4 flex justify-end gap-2">
        <RoadSegmentFilterDrawer />
        <Button asChild>
          <Link to="/road-segments/add">
            <Plus />
            Tambah
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={data?.ruasjalan ?? []} />
    </DefaultLayout>
  );
}
