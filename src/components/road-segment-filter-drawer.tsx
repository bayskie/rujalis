import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { RoadSegmentFilterForm } from "@/components/road-segment-filter-form";
import { Filter } from "lucide-react";

export function RoadSegmentFilterDrawer() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Filter /> Filter
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Ruas Jalan</DrawerTitle>
          <DrawerDescription>
            Gunakan filter untuk menyaring data ruas jalan.
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-4">
          <RoadSegmentFilterForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
